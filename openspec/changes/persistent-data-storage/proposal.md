## Why

Currently, the Quantum Yoga platform operates purely as a static site using client-side browser LocalStorage for data persistence. This creates a data loss vulnerability when users access the site from clean browser profiles, different browsers, or when the development server is restarted or updated. Standardizing data persistence on a local backend JSON file synchronized with LocalStorage ensures data consistency, prevents data loss, and guarantees persistent state across server restarts and user logins.

## What Changes

- **Backend Persistence API**: Add a mock database middleware to the Vite dev server configuration that writes the system state to a local JSON file (`db.json`).
- **Data Synchronization on Load**: Fetch the persistent state from the server on application boot and seed it into browser LocalStorage if present.
- **Data Synchronization on Write**: Send POST requests to the backend API whenever the client-side state (users, appointments, leads, payments, settings) is mutated, ensuring instant persistence to the local file.

## Capabilities

### New Capabilities
- `persistent-data-storage`: Handles server-side file persistence via mock API endpoints and client-side database synchronization with browser LocalStorage.

### Modified Capabilities
<!-- None -->

## Impact

- **vite.config.js**: Add a custom dev server plugin middleware to serve a `/api/db` endpoint supporting GET and POST requests for a local `db.json` database.
- **db.json**: Store the serialized application state (users, appointments, payments, leads, and UPI settings).
- **app.js**: Integrate asynchronous fetch and POST synchronization calls into storage wrappers (`loadUsers`, `saveUsers`, `saveAppointments`, `savePayments`, etc.).
