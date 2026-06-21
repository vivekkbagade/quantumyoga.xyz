import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'mock-db-middleware',
      configureServer(server) {
        server.middlewares.use('/api/db', (req, res, next) => {
          const dbPath = path.resolve(__dirname, 'db.json');

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            if (fs.existsSync(dbPath)) {
              const data = fs.readFileSync(dbPath, 'utf8');
              res.end(data || '{}');
            } else {
              res.end('{}');
            }
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                // Validate JSON before saving
                JSON.parse(body);
                fs.writeFileSync(dbPath, body, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              }
            });
          } else {
            next();
          }
        });

        // Resend email proxy — avoids browser CORS block on api.resend.com
        server.middlewares.use('/api/send-email', (req, res, next) => {
          if (req.method !== 'POST') { next(); return; }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { apiKey, from, to, subject, html } = JSON.parse(body);
              if (!apiKey) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'API key is required' }));
                return;
              }
              // Node-side fetch to Resend (no CORS restriction here)
              const { default: https } = await import('node:https');
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
                  res.statusCode = proxyRes.statusCode;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(data);
                });
              });
              proxyReq.on('error', err => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              });
              proxyReq.write(payload);
              proxyReq.end();
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // Resend retrieve email proxy
        server.middlewares.use('/api/resend-emails', (req, res, next) => {
          if (req.method !== 'GET') { next(); return; }
          const url = new URL(req.url, `http://${req.headers.host}`);
          const apiKey = url.searchParams.get('apiKey');
          const type = url.searchParams.get('type') || 'sent'; // 'sent' or 'receiving'
          const emailId = url.searchParams.get('id');

          if (!apiKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'API key is required' }));
            return;
          }

          let apiPath = '/emails';
          if (emailId) {
            apiPath = type === 'receiving' ? `/emails/receiving/${emailId}` : `/emails/${emailId}`;
          } else if (type === 'receiving') {
            apiPath = '/emails/receiving';
          }

          const options = {
            hostname: 'api.resend.com',
            path: apiPath,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          };

          import('node:https').then(({ default: https }) => {
            const proxyReq = https.request(options, proxyRes => {
              let data = '';
              proxyRes.on('data', chunk => { data += chunk; });
              proxyRes.on('end', () => {
                res.statusCode = proxyRes.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
              });
            });
            proxyReq.on('error', err => {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            });
            proxyReq.end();
          }).catch(err => {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          });
        });

        // WhatsApp Proxy Middleware for Development Server
        server.middlewares.use('/api/send-whatsapp', (req, res, next) => {
          if (req.method !== 'POST') { next(); return; }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { to, message } = JSON.parse(body);
              console.log(`[Vite Dev WhatsApp Proxy] Send attempt to ${to}: "${message}"`);
              
              // Load .env variables manually to ensure local Twilio settings are loaded
              const envPath = path.resolve(__dirname, '.env');
              if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                envContent.split('\n').forEach(line => {
                  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                  if (match) {
                    const key = match[1];
                    let value = (match[2] || '').trim();
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                    process.env[key] = value;
                  }
                });
              }

              const accountSid = process.env.TWILIO_ACCOUNT_SID;
              const authToken = process.env.TWILIO_AUTH_TOKEN;
              const sender = process.env.TWILIO_SENDER_NUMBER || '+14155238886';

              if (accountSid && accountSid !== 'ACyour_account_sid_here' && authToken && authToken !== 'your_auth_token_here') {
                const { default: https } = await import('node:https');
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
                    console.log(`[Vite Dev WhatsApp Twilio] Status: ${proxyRes.statusCode}, Response: ${responseData}`);
                    res.statusCode = proxyRes.statusCode;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(responseData);
                  });
                });
                proxyReq.on('error', err => {
                  console.error('[Vite Dev WhatsApp Twilio Error]', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                });
                proxyReq.write(payload);
                proxyReq.end();
              } else {
                console.log('[Vite Dev WhatsApp Proxy] Twilio credentials not configured. Mocking success.');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, mock: true }));
              }
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: 80
  }
});
