## Context

The Quantum Yoga platform is a static Vite dashboard app that persists state using browser LocalStorage. This means data is not shared between different browsers, and is lost if the browser profile is cleared or if the dev server runs in a temporary container. We want to implement a backend synchronization mechanism that saves state to a local `db.json` file.

## Goals / Non-Goals

**Goals:**
- Create a `db.json` file on the filesystem to serve as the persistent database.
- Create a `vite.config.js` file and implement custom server middleware inside it to handle GET/POST requests at `/api/db`.
- Fetch the server database state on application boot and sync it into browser LocalStorage.
- Add client-side hooks to send background POST requests to `/api/db` whenever user data, appointments, leads, payments, or UPI settings are saved.

**Non-Goals:**
- Moving to a heavy external database (e.g. MongoDB or PostgreSQL).
- Implementing JWT auth or server-side validation; the client-side logic remains the source of truth for validations.

## Decisions

### 1. Dev Server Custom Middleware (Vite config)
- **Decision**: Create a `vite.config.js` configuration file and implement a custom server middleware utilizing Vite's `configureServer` development hook. The middleware will map requests for `/api/db` to file read/write operations on a local `db.json` file.
- **Rationale**: Keeps the codebase simple without needing a separate backend server process. It works seamlessly within the existing `npm run dev` script.
- **Alternatives considered**: Setting up a concurrent Express server. Rejected because it adds port overhead, process management complexity, and requires changing the start scripts.

### 2. Full State Serialization
- **Decision**: The `/api/db` payload will consist of a single JSON object containing all database tables: `users`, `leads`, `payments`, `appointments`, `upi_settings`, and `batches`.
- **Rationale**: State is relatively small (less than 1MB). Serializing the entire database object prevents table-level conflict-resolution code and is straightforward to implement.
- **Alternatives considered**: Defining individual REST endpoints for each entity. Rejected because it creates excessive boilerplate and requires multiple fetch integrations.

### 3. Background Sync (Fire-and-forget POST)
- **Decision**: Client modifications to LocalStorage will continue to execute synchronously to ensure zero UI delay, and will then execute a non-blocking asynchronous `fetch` POST to `/api/db` in the background to commit changes to the backend.
- **Rationale**: Keeps client UI interactions fast while guaranteeing background filesystem persistence.

## Risks / Trade-offs

- **[Risk]** Data model mismatches on the first load of an empty `db.json` file.
  - *Mitigation*: If `/api/db` returns an empty object or is missing keys, the client's `seedMockData()` will populate defaults and save them back to the server to establish a base state.
- **[Risk]** Multiple active browser tabs overwriting each other.
  - *Mitigation*: For local developer/admin usage, simple overwrite on write is acceptable.
