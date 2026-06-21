import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'node:https';
import http from 'node:http';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
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
    invoice: "Hello {{name}}, a new invoice {{invoiceId}} for {{amount}} is due on {{dueDate}}. Pay here: {{link}}",
    booking: "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}."
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
  if (state && !state.whatsappSettings) {
    state.whatsappSettings = DEFAULT_WHATSAPP_SETTINGS;
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

// Catch-all route to serve index.html for spa routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Production server running on port ${PORT}`);
  await seedDbIfNeeded();
});
