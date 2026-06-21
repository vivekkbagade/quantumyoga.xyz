## 1. Setup & Environment Configuration

- [x] 1.1 Add `@supabase/supabase-js` dependency to `package.json` and install
- [x] 1.2 Configure database connection keys `SUPABASE_URL` and `SUPABASE_KEY` (Service role or Anon Key)
- [x] 1.3 Setup the SQL schema in Supabase (`quantum_yoga_db` table with a `state` JSONB column)

## 2. Server Implementation

- [x] 2.1 Initialize the Supabase client in `server.js` using config credentials
- [x] 2.2 Refactor the GET `/api/db` endpoint to fetch the `state` JSONB document from the `quantum_yoga_db` table
- [x] 2.3 Refactor the POST `/api/db` endpoint to update/upsert the `state` JSONB document in the `quantum_yoga_db` table
- [x] 2.4 Implement a server-side migration fallback (if Supabase table is empty on startup, seed it with the contents of local `db.json`)
