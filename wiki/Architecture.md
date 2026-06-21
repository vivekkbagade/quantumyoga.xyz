# System Architecture & Database Setup

Quantum Yoga utilizes a clean, decoupled design featuring a responsive SPA frontend and a proxy-enabled API backend.

```
+-------------------------------------------------------------+
|                         Vite Client                         |
|  - Midnight Aura (Dark), Zen Sunset, Ethereal Light Themes  |
|  - Custom SPA Navigation Router                             |
+-------------------------------------------------------------+
                              │
                              ▼ (API Requests & Proxying)
+-------------------------------------------------------------+
|                     Express API Server                      |
|  - Static content serving                                   |
|  - Resend, Google Gmail OAuth & WhatsApp Proxy Endpoints    |
+-------------------------------------------------------------+
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼ (if DATABASE_URL)    ▼ (if SUPABASE keys)   ▼ (fallback)
+──────────────+       +──────────────+       +──────────────+
| PostgreSQL   |       | Supabase DB  |       | Local JSON   |
| Pool         |       | Client (Real)|       | (db.json)    |
+──────────────+       +──────────────+       +──────────────+
```

---

## 💾 Unified Database Adapters

Quantum Yoga features a **Unified Storage Manager** inside `server.js` that checks for database availability in the following order:

1. **PostgreSQL Pool:** If `DATABASE_URL` is found in the environment, a `pg.Pool` handles persistent queries.
2. **Supabase Client:** If no `DATABASE_URL` is configured, but `SUPABASE_URL` and `SUPABASE_KEY` are present, it initializes the `@supabase/supabase-js` client.
3. **Local Fallback (`db.json`):** If no environment parameters are detected, the app automatically reads and writes states locally to `db.json` in the project root.

### PostgreSQL Table Schema

If setting up your production PostgreSQL server, run the following setup script (`schema.sql`):

```sql
CREATE TABLE IF NOT EXISTS quantum_yoga_db (
    id VARCHAR(50) PRIMARY KEY,
    state JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Environment Configuration

Define the following parameters in your `.env` configuration file:

| Variable | Description | Example |
|---|---|---|
| `PORT` | The port the Express production server binds to. | `8080` |
| `DATABASE_URL` | PostgreSQL connection URI. | `postgresql://user:pass@127.0.0.1:5432/db` |
| `SUPABASE_URL` | Supabase project API gateway url. | `https://project.supabase.co` |
| `SUPABASE_KEY` | Supabase project anonymized public key. | `sb_secret_key...` |
| `RESEND_API_KEY` | Authorization key for the Resend Email Client. | `re_ApiKey...` |
| `RESEND_FROM_ADDRESS` | Configured sender address in Resend dashboard. | `admin@quantumyoga.xyz` |

---

## 🛠️ Build and Deploy Commands

### Development Setup
Start the Vite dev server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production Build & Launch
Build client-side assets and spin up the Express server:
```bash
npm run build
npm run start
```
