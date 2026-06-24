import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'node:https';
import http from 'node:http';
import { createClient } from '@supabase/supabase-js';
import ws, { WebSocketServer } from 'ws';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json({ limit: 52428800 }));
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Postgres Pool if DATABASE_URL is present
let pgPool = null;
if (process.env.DATABASE_URL) {
  const isLocalhost = process.env.DATABASE_URL.includes('127.0.0.1') || process.env.DATABASE_URL.includes('localhost');
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalhost ? false : { rejectUnauthorized: false }
  });
  console.log("Database initialized with PostgreSQL connection pool.");
}

// Initialize Supabase Client if SUPABASE_URL and SUPABASE_KEY are present and DATABASE_URL is NOT present
let supabase = null;
if (!pgPool && process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    realtime: {
      transport: ws,
    },
  });
  console.log("Database initialized with Supabase client.");
}

if (!pgPool && !supabase) {
  console.warn("WARNING: Neither DATABASE_URL nor Supabase keys are configured. Falling back to local db.json file.");
}

const DEFAULT_WHATSAPP_SETTINGS = {
  enabled: false,
  apiKey: "",
  gatewayUrl: "",
  templates: {
    welcome: "Hello {{name}}, welcome to Quantum Yoga! Your temporary password is {{tempPass}}.",
    invoice: "Hello {{name}}, a new invoice {{invoiceId}} for ₹{{amount}} is due on {{dueDate}}. Pay via UPI VPA: {{upiVpa}} ({{upiName}}) or tap here: {{upiLink}}",
    booking: "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}. Session Fee: ₹{{amount}}. Pay via UPI VPA: {{upiVpa}} ({{upiName}}) or tap here: {{upiLink}}"
  }
};

// Unified state helper functions
async function getDbState() {
  let state = null;
  if (pgPool) {
    const res = await pgPool.query("SELECT state FROM quantum_yoga_db WHERE id = $1", ['default']);
    state = res.rows[0] ? res.rows[0].state : null;
  } else if (supabase) {
    const { data, error } = await supabase
      .from('quantum_yoga_db')
      .select('state')
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    state = data ? data.state : null;
  }
  if (state) {
    if (!state.whatsappSettings) {
      state.whatsappSettings = DEFAULT_WHATSAPP_SETTINGS;
    }
    if (!state.upi_ledger) {
      state.upi_ledger = [];
    }
  }
  return state;
}

async function setDbState(state) {
  if (pgPool) {
    await pgPool.query(
      "INSERT INTO quantum_yoga_db (id, state, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (id) DO UPDATE SET state = $2, updated_at = NOW()",
      ['default', JSON.stringify(state)]
    );
  } else if (supabase) {
    const { error } = await supabase
      .from('quantum_yoga_db')
      .upsert({ id: 'default', state: state, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
}

// Seed function if table is empty
async function seedDbIfNeeded() {
  if (!pgPool && !supabase) return;
  try {
    const state = await getDbState();
    if (!state) {
      console.log('No state found in database. Attempting to seed from db.json...');
      const dbPath = path.resolve(__dirname, 'db.json');
      let initialState = {};
      if (fs.existsSync(dbPath)) {
        try {
          initialState = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch (e) {
          console.error('Error reading local db.json for seeding:', e);
        }
      }
      await setDbState(initialState);
      console.log('Successfully seeded database with initial state.');
    } else {
      console.log('Database already has database state. Seeding skipped.');
    }
  } catch (err) {
    console.error('Unexpected error in seedDbIfNeeded:', err);
  }
}

// 1. Database endpoint
app.all('/api/db', async (req, res) => {
  const dbPath = path.resolve(__dirname, 'db.json');
  if (req.method === 'GET') {
    try {
      const state = await getDbState();
      if (state === null) {
        const localState = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
        if (!localState.whatsappSettings) {
          localState.whatsappSettings = DEFAULT_WHATSAPP_SETTINGS;
        }
        return res.json(localState);
      }
      res.json(state);
    } catch (err) {
      console.error('GET /api/db error:', err);
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!pgPool && !supabase) {
        fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2), 'utf8');
        return res.json({ success: true });
      }
      await setDbState(req.body);
      res.json({ success: true });
    } catch (err) {
      console.error('POST /api/db error:', err);
      res.status(400).json({ error: err.message });
    }
  }
});

// 2. Resend Send email proxy
app.post('/api/send-email', (req, res) => {
  const apiKey = req.body.apiKey || process.env.RESEND_API_KEY;
  const from = req.body.from || process.env.RESEND_FROM_ADDRESS;
  const { to, subject, html } = req.body;

  if (!apiKey) return res.status(400).json({ error: 'API key is required' });
  if (!from) return res.status(400).json({ error: 'From address is required' });

  const payload = JSON.stringify({ from, to, subject, html });
  const options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const proxyReq = https.request(options, proxyRes => {
    let data = '';
    proxyRes.on('data', chunk => { data += chunk; });
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode).set('Content-Type', 'application/json').end(data);
    });
  });
  proxyReq.on('error', err => res.status(500).json({ error: err.message }));
  proxyReq.write(payload);
  proxyReq.end();
});

// 3. Resend Get/List email proxy
app.get('/api/resend-emails', (req, res) => {
  const apiKey = req.query.apiKey || process.env.RESEND_API_KEY;
  const { type, id } = req.query;
  if (!apiKey) return res.status(400).json({ error: 'API key is required' });

  let apiPath = '/emails';
  if (id) {
    apiPath = type === 'receiving' ? `/emails/receiving/${id}` : `/emails/${id}`;
  } else if (type === 'receiving') {
    apiPath = '/emails/receiving';
  }

  const options = {
    hostname: 'api.resend.com',
    path: apiPath,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  };

  const proxyReq = https.request(options, proxyRes => {
    let data = '';
    proxyRes.on('data', chunk => { data += chunk; });
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode).set('Content-Type', 'application/json').end(data);
    });
  });
  proxyReq.on('error', err => res.status(500).json({ error: err.message }));
  proxyReq.end();
});

// 4. WhatsApp Proxy Endpoints
app.post('/api/send-whatsapp', async (req, res) => {
  const { to, message } = req.body;
  console.log(`[WhatsApp Outbox] Send attempt to ${to}: "${message}"`);
  
  const dbState = await getDbState();
  const settings = dbState?.whatsappSettings || DEFAULT_WHATSAPP_SETTINGS;
  
  const enabled = settings.enabled || !!process.env.WHATSAPP_API_KEY || !!process.env.TWILIO_AUTH_TOKEN;
  
  // If Twilio credentials are in environment, use Twilio!
  if (enabled && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const sender = process.env.TWILIO_SENDER_NUMBER || '+14155238886';
      
      let recipient = to.trim();
      if (!recipient.startsWith('whatsapp:')) {
        let clean = recipient.replace(/\D/g, "");
        if (clean.length === 10) clean = "91" + clean;
        recipient = `whatsapp:+${clean}`;
      }
      
      const twilioSender = sender.startsWith('whatsapp:') ? sender : `whatsapp:${sender}`;
      
      const payload = new URLSearchParams({
        To: recipient,
        From: twilioSender,
        Body: message
      }).toString();
      
      const options = {
        hostname: 'api.twilio.com',
        port: 443,
        path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64')
        }
      };
      
      const proxyReq = https.request(options, proxyRes => {
        let responseData = '';
        proxyRes.on('data', chunk => { responseData += chunk; });
        proxyRes.on('end', () => {
          console.log(`[Twilio WhatsApp Link] Status: ${proxyRes.statusCode}, Response: ${responseData}`);
          res.status(200).json({ success: proxyRes.statusCode >= 200 && proxyRes.statusCode < 300, mock: false, providerStatus: proxyRes.statusCode });
        });
      });
      proxyReq.on('error', err => {
        console.error('[Twilio WhatsApp Link Error]', err);
        res.status(200).json({ success: true, mock: true, error: err.message });
      });
      proxyReq.write(payload);
      proxyReq.end();
      return;
    } catch (e) {
      console.error('[Twilio Config Gateway Error]', e);
    }
  }

  const apiKey = process.env.WHATSAPP_API_KEY || settings.apiKey;
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || settings.gatewayUrl;
  
  if (enabled && apiKey && gatewayUrl) {
    try {
      const url = new URL(gatewayUrl);
      const payload = JSON.stringify({
        to,
        message,
        apiKey: apiKey
      });
      
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };
      
      const reqProto = url.protocol === 'https:' ? https : http;
      const proxyReq = reqProto.request(options, proxyRes => {
        let responseData = '';
        proxyRes.on('data', chunk => { responseData += chunk; });
        proxyRes.on('end', () => {
          console.log(`[WhatsApp Production Link] Status: ${proxyRes.statusCode}`);
          res.status(200).json({ success: true, mock: false, providerStatus: proxyRes.statusCode });
        });
      });
      proxyReq.on('error', err => {
        console.error('[WhatsApp Production Link Error]', err);
        res.status(200).json({ success: true, mock: true, error: err.message });
      });
      proxyReq.write(payload);
      proxyReq.end();
      return;
    } catch (e) {
      console.error('[WhatsApp Config Gateway Error]', e);
    }
  }
  
  // Fallback to mock success
  res.json({ success: true, mock: true });
});

// POST /api/verify-upi
app.post('/api/verify-upi', async (req, res) => {
  const { invoiceId, utr, amount } = req.body;
  if (!invoiceId || !utr || !amount) {
    return res.status(400).json({ error: 'Missing invoiceId, utr, or amount' });
  }

  try {
    const dbState = await getDbState();
    if (!dbState) {
      return res.status(500).json({ error: 'Database state could not be loaded' });
    }

    const upiLedger = dbState.upi_ledger || [];
    const payments = dbState.payments || [];
    
    const payment = payments.find(p => p.id === invoiceId);
    if (!payment) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Clean inputs
    const submittedUtr = String(utr).trim();
    const submittedAmount = parseFloat(amount);

    // Look for matching ledger entry
    const ledgerMatch = upiLedger.find(entry => String(entry.utr).trim() === submittedUtr);

    let status = 'review';
    let matchedEntry = null;
    let verificationError = '';

    // Load reconciliation settings
    const recSettings = dbState.reconciliationSettings || { tolerance: 0.05, maxAgeDays: 30 };
    const tolerance = parseFloat(recSettings.tolerance) !== undefined ? parseFloat(recSettings.tolerance) : 0.05;
    const maxAgeDays = parseInt(recSettings.maxAgeDays) !== undefined ? parseInt(recSettings.maxAgeDays) : 30;

    let dateMatch = true;

    if (ledgerMatch) {
      const entryAmount = parseFloat(ledgerMatch.amount);
      
      // Verify date window limit
      if (ledgerMatch.date && payment.dueDate) {
        const ledgerDate = new Date(ledgerMatch.date);
        const invoiceDate = new Date(payment.dueDate);
        const diffTime = Math.abs(ledgerDate - invoiceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > maxAgeDays) {
          dateMatch = false;
        }
      }

      if (Math.abs(entryAmount - submittedAmount) <= tolerance) {
        if (dateMatch) {
          status = 'paid';
          matchedEntry = ledgerMatch;
        } else {
          status = 'discrepancy';
          verificationError = 'Date window exceeded';
        }
      } else {
        status = 'discrepancy';
        verificationError = 'Amount mismatch';
      }
    } else {
      verificationError = 'UTR not found in ledger';
    }

    // Update payment record
    payment.status = status;
    payment.utr = submittedUtr;
    if (status === 'paid') {
      payment.paymentDate = matchedEntry?.date || new Date().toISOString().split('T')[0];
      payment.verifiedAt = new Date().toISOString();
      payment.verificationSource = 'ledger';
      delete payment.verificationError;
    } else {
      payment.verificationError = verificationError;
    }

    // Log the reconciliation audit log
    const auditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      invoiceId,
      utr: submittedUtr,
      amount: submittedAmount,
      status,
      details: status === 'paid'
        ? `Auto-approved: UTR matches. Amount: ₹${submittedAmount} (within tolerance of ±₹${tolerance}).`
        : (status === 'discrepancy'
            ? (verificationError === 'Date window exceeded'
                ? `Discrepancy: UTR matched but transaction date (${ledgerMatch.date}) is beyond the ${maxAgeDays}-day window of invoice due date (${payment.dueDate}).`
                : `Discrepancy: UTR matched but amount differs. Submitted: ₹${submittedAmount}, Ledger: ₹${ledgerMatch.amount}.`)
            : `Under Review: UTR not found in bank statement ledger.`)
    };

    if (!dbState.upi_reconciliation_logs) {
      dbState.upi_reconciliation_logs = [];
    }
    dbState.upi_reconciliation_logs.unshift(auditLog);
    if (dbState.upi_reconciliation_logs.length > 500) {
      dbState.upi_reconciliation_logs = dbState.upi_reconciliation_logs.slice(0, 500);
    }

    await setDbState(dbState);
    res.json({ success: true, status, payment });
  } catch (err) {
    console.error('Error in /api/verify-upi:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/upload-ledger
app.post('/api/admin/upload-ledger', async (req, res) => {
  const { fileContent, columnMapping } = req.body; // Expect base64/plaintext CSV and optional custom mapping
  if (!fileContent) {
    return res.status(400).json({ error: 'No file content provided' });
  }

  try {
    const dbState = await getDbState();
    if (!dbState) {
      return res.status(500).json({ error: 'Database state could not be loaded' });
    }

    // Simple CSV parser
    const lines = fileContent.split(/\r?\n/);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'Invalid CSV format or empty file' });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    // Find column indices using custom mapping or falling back to regex
    let utrIdx = -1;
    let amountIdx = -1;
    let dateIdx = -1;
    let senderIdx = -1;
    let detailsIdx = -1;

    if (columnMapping) {
      const getIndex = (fieldVal) => {
        if (!fieldVal) return -1;
        if (/^\d+$/.test(fieldVal)) {
          return parseInt(fieldVal);
        }
        return headers.findIndex(h => h.toLowerCase() === String(fieldVal).toLowerCase());
      };

      utrIdx = getIndex(columnMapping.utr);
      amountIdx = getIndex(columnMapping.amount);
      dateIdx = getIndex(columnMapping.date);
      senderIdx = getIndex(columnMapping.senderName || columnMapping.sender);
      detailsIdx = getIndex(columnMapping.details);
    }

    if (utrIdx === -1) utrIdx = headers.findIndex(h => /utr|ref|transaction\s*(?:ref|id)|reference/i.test(h));
    if (amountIdx === -1) amountIdx = headers.findIndex(h => /amount|value|sum/i.test(h));
    if (dateIdx === -1) dateIdx = headers.findIndex(h => /date/i.test(h));
    if (senderIdx === -1) senderIdx = headers.findIndex(h => /sender|name|from|payer/i.test(h));
    if (detailsIdx === -1) detailsIdx = headers.findIndex(h => /details|desc|remarks|memo/i.test(h));

    if (utrIdx === -1 || amountIdx === -1) {
      return res.status(400).json({ error: `Could not identify required columns. Found headers: ${headers.join(', ')}. Need columns mapping to UTR/Ref and Amount.` });
    }

    const imported = [];
    let duplicates = 0;
    const existingUtrs = new Set((dbState.upi_ledger || []).map(entry => String(entry.utr).trim()));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic comma split handling simple quotes
      const cols = [];
      let current = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      cols.push(current.trim().replace(/^["']|["']$/g, ''));

      if (cols.length < Math.max(utrIdx, amountIdx) + 1) continue;

      const utr = cols[utrIdx]?.trim();
      const amountStr = cols[amountIdx]?.trim();
      if (!utr || !amountStr) continue;

      // clean UTR: must be alphanumeric (12 digit typically, but let's grab the raw string minus spaces)
      const cleanUtr = utr.replace(/\s+/g, '');
      if (cleanUtr.length < 6) continue; // safety check for header-like/empty values

      if (existingUtrs.has(cleanUtr)) {
        duplicates++;
        continue;
      }

      const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
      if (isNaN(amount)) continue;

      const date = dateIdx !== -1 ? cols[dateIdx]?.trim() : new Date().toISOString().split('T')[0];
      const senderName = senderIdx !== -1 ? cols[senderIdx]?.trim() : '';
      const details = detailsIdx !== -1 ? cols[detailsIdx]?.trim() : '';

      const newEntry = {
        utr: cleanUtr,
        amount: String(amount),
        date: date || new Date().toISOString().split('T')[0],
        senderName: senderName || 'Unknown',
        details: details || 'Imported via CSV',
        importedAt: new Date().toISOString()
      };

      imported.push(newEntry);
      existingUtrs.add(cleanUtr);
    }

    if (!dbState.upi_ledger) {
      dbState.upi_ledger = [];
    }
    dbState.upi_ledger.push(...imported);

    await setDbState(dbState);

    res.json({
      success: true,
      importedCount: imported.length,
      duplicateCount: duplicates,
      summary: `${imported.length} transactions imported, ${duplicates} duplicates ignored`
    });
  } catch (err) {
    console.error('Error in /api/admin/upload-ledger:', err);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve index.html for spa routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

async function getUnifiedState() {
  const state = await getDbState();
  if (state !== null) {
    if (!state.chatMessages) {
      state.chatMessages = [];
    }
    return state;
  }
  
  const dbPath = path.resolve(__dirname, 'db.json');
  const localState = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
  if (!localState.whatsappSettings) {
    localState.whatsappSettings = DEFAULT_WHATSAPP_SETTINGS;
  }
  if (!localState.upi_ledger) {
    localState.upi_ledger = [];
  }
  if (!localState.chatMessages) {
    localState.chatMessages = [];
  }
  return localState;
}

async function saveUnifiedState(state) {
  if (pgPool || supabase) {
    await setDbState(state);
  } else {
    const dbPath = path.resolve(__dirname, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(state, null, 2), 'utf8');
  }
}

const server = app.listen(PORT, async () => {
  console.log(`Production server running on port ${PORT}`);
  await seedDbIfNeeded();
});

// Setup WebSocket Server co-hosted on HTTP Server port
const wss = new WebSocketServer({ server });
const connectedUsers = new Map();

wss.on('connection', (socket) => {
  console.log('[WebSocket] Client connected.');

  socket.on('message', async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'join') {
        connectedUsers.set(socket, { name: message.name, role: message.role });
        
        // Send history to user
        const dbState = await getUnifiedState();
        socket.send(JSON.stringify({
          type: 'history',
          messages: dbState.chatMessages || []
        }));

        // Broadcast updated user list
        broadcastActiveUsers();
      }

      if (message.type === 'message') {
        const dbState = await getUnifiedState();
        if (!dbState.chatMessages) {
          dbState.chatMessages = [];
        }

        const newMsg = {
          id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          name: message.name,
          role: message.role,
          text: message.text,
          timestamp: new Date().toISOString()
        };

        dbState.chatMessages.push(newMsg);
        if (dbState.chatMessages.length > 50) {
          dbState.chatMessages = dbState.chatMessages.slice(-50);
        }

        await saveUnifiedState(dbState);

        // Broadcast new message
        broadcast({
          type: 'message',
          message: newMsg
        });
      }
    } catch (e) {
      console.error('[WebSocket] Error processing message:', e);
    }
  });

  socket.on('close', () => {
    console.log('[WebSocket] Client disconnected.');
    connectedUsers.delete(socket);
    broadcastActiveUsers();
  });
});

function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  }
}

function broadcastActiveUsers() {
  broadcast({
    type: 'users',
    users: Array.from(connectedUsers.values())
  });
}
