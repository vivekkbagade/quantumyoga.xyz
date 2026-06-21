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

        // UPI verification proxy middleware for dev server
        server.middlewares.use('/api/verify-upi', (req, res, next) => {
          if (req.method !== 'POST') { next(); return; }
          const dbPath = path.resolve(__dirname, 'db.json');
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { invoiceId, utr, amount } = JSON.parse(body);
              if (!invoiceId || !utr || !amount) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing invoiceId, utr, or amount' }));
                return;
              }

              const dbState = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
              const upiLedger = dbState.upi_ledger || [];
              const payments = dbState.payments || [];

              const payment = payments.find(p => p.id === invoiceId);
              if (!payment) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Invoice not found' }));
                return;
              }

              const submittedUtr = String(utr).trim();
              const submittedAmount = parseFloat(amount);
              const ledgerMatch = upiLedger.find(entry => String(entry.utr).trim() === submittedUtr);

              let status = 'review';
              let matchedEntry = null;

              if (ledgerMatch) {
                const entryAmount = parseFloat(ledgerMatch.amount);
                if (Math.abs(entryAmount - submittedAmount) < 0.01) {
                  status = 'paid';
                  matchedEntry = ledgerMatch;
                } else {
                  status = 'discrepancy';
                }
              }

              payment.status = status;
              payment.utr = submittedUtr;
              if (status === 'paid') {
                payment.paymentDate = matchedEntry?.date || new Date().toISOString().split('T')[0];
                payment.verifiedAt = new Date().toISOString();
                payment.verificationSource = 'ledger';
              } else {
                payment.verificationError = status === 'discrepancy' ? 'Amount mismatch' : 'UTR not found in ledger';
              }

              fs.writeFileSync(dbPath, JSON.stringify(dbState, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, status, payment }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // UPI Ledger upload middleware for dev server
        server.middlewares.use('/api/admin/upload-ledger', (req, res, next) => {
          if (req.method !== 'POST') { next(); return; }
          const dbPath = path.resolve(__dirname, 'db.json');
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { fileContent } = JSON.parse(body);
              if (!fileContent) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'No file content provided' }));
                return;
              }

              const dbState = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
              const lines = fileContent.split(/\r?\n/);
              if (lines.length < 2) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid CSV format or empty file' }));
                return;
              }

              const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
              const utrIdx = headers.findIndex(h => /utr|ref|transaction\s*(?:ref|id)|reference/i.test(h));
              const amountIdx = headers.findIndex(h => /amount|value|sum/i.test(h));
              const dateIdx = headers.findIndex(h => /date/i.test(h));
              const senderIdx = headers.findIndex(h => /sender|name|from|payer/i.test(h));
              const detailsIdx = headers.findIndex(h => /details|desc|remarks|memo/i.test(h));

              if (utrIdx === -1 || amountIdx === -1) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: `Could not identify required columns. Found headers: ${headers.join(', ')}. Need columns mapping to UTR/Ref and Amount.` }));
                return;
              }

              const imported = [];
              let duplicates = 0;
              const existingUtrs = new Set((dbState.upi_ledger || []).map(entry => String(entry.utr).trim()));

              for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

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

                const cleanUtr = utr.replace(/\s+/g, '');
                if (cleanUtr.length < 6) continue;

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

              fs.writeFileSync(dbPath, JSON.stringify(dbState, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                importedCount: imported.length,
                duplicateCount: duplicates,
                summary: `${imported.length} transactions imported, ${duplicates} duplicates ignored`
              }));
            } catch (err) {
              res.statusCode = 500;
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
