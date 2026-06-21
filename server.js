import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'node:https';
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

// Unified state helper functions
async function getDbState() {
  if (pgPool) {
    const res = await pgPool.query("SELECT state FROM quantum_yoga_db WHERE id = $1", ['default']);
    return res.rows[0] ? res.rows[0].state : null;
  } else if (supabase) {
    const { data, error } = await supabase
      .from('quantum_yoga_db')
      .select('state')
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    return data ? data.state : null;
  }
  return null;
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
        return res.json(fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {});
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

// Catch-all route to serve index.html for spa routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Production server running on port ${PORT}`);
  await seedDbIfNeeded();
});
