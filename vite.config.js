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
      }
    }
  ],
  server: {
    port: 80
  }
});
