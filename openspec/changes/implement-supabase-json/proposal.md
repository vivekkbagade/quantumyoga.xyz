## Why

Currently, the application stores data client-side in localStorage and server-side in a local `db.json` file. This local file storage lacks durability, security, and scalability, and can lead to data loss or concurrency issues. Migrating to Supabase provides a hosted, robust cloud data store while preserving the flexible JSON/NoSQL document structure by utilizing PostgreSQL's native JSONB capabilities.

## What Changes

- **Cloud Synchronization:** Replace local file-based `db.json` read/write operations with async queries to Supabase.
- **JSONB Tables:** Set up Supabase tables using PostgreSQL's native `jsonb` column types to store existing JSON document structures (users, payments, appointments).
- **Secure Endpoints:** Update the Express server backend to interact with Supabase secure APIs, keeping client keys hidden and maintaining backend compatibility.

## Capabilities

### New Capabilities
- `supabase-json-storage`: Integration of Supabase Client and cloud persistence using PostgreSQL JSONB schema.

### Modified Capabilities

## Impact

- **Affected Files:**
  - `server.js` (Express endpoints updated to fetch/save from/to Supabase instead of local fs reading/writing `db.json`).
  - `package.json` (Add `@supabase/supabase-js` dependency).
  - `.env` / Environment variables (Supabase URL and Service Role / Anon API Key).
