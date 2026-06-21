## Context

The system currently reads and writes database state via `/api/db` to `db.json` on disk.
To support cloud persistence, we want to migrate this to Supabase. Since refactoring the whole codebase to use SQL tables requires rewriting all queries and schemas in the client-side SPA, a simpler approach is to store the unified `db.json` structure directly in a single row/table inside Supabase using a JSONB column (e.g., table `quantum_yoga_db` with key `database_state`), preserving backend compatibility without rewriting frontend API interactions.

## Goals / Non-Goals

**Goals:**
- Connect the server backend to Supabase using `@supabase/supabase-js`.
- Store the application database state in a Postgres table using a JSONB field.
- Maintain a fully backward-compatible `/api/db` endpoint so the frontend client requires zero modifications.

**Non-Goals:**
- Mapping all JSON collections to fully relational SQL tables.
- Directly connecting the client-side browser to Supabase (all queries are proxied via the server to protect keys).

## Decisions

### 1. Unified JSONB Document Table vs Relational Tables
- **Choice:** Use a single table `quantum_yoga_db` containing a single row of JSONB data storing the entire database state.
- **Rationale:** Minimizes structural modifications. The frontend is coupled to requesting the entire DB via `/api/db` and modifying it locally before posting back. A single JSONB state matches this paradigm and requires hours instead of weeks of refactoring.
- **Alternative:** Creating relational SQL tables. Rejected due to the massive refactoring required in `app.js` (thousands of lines of client-side filtering, joins, and queries).

## Risks / Trade-offs

- **[Risk]** Large payload sizes over time if database grows.
  - *Mitigation:* The total database state size for a yoga studio is very small (typically < 1MB), which easily fits in a single PostgreSQL row. If it grows larger, we can split into collections (users, payments, appointments) while keeping the same `/api/db` payload format.
- **[Risk]** Concurrency collisions if multiple admins edit simultaneously.
  - *Mitigation:* Utilize Supabase's built-in transaction queries or a last-write-wins pattern on the Node/Express server.
