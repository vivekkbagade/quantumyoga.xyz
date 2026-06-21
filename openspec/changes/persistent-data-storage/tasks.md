## 1. Backend API Endpoint Setup

- [x] 1.1 Create `vite.config.js` in the project root with the connect middleware registered at `/api/db` to serve GET/POST requests and interact with `db.json`
- [x] 1.2 Create an empty `db.json` file in the project root to store serialized JSON database data

## 2. Client-side Synchronization Logic

- [x] 2.1 Implement `loadFromServer()` and `saveToServer()` background fetch helpers in `app.js` to get and post entire state snapshots
- [x] 2.2 Update `DOMContentLoaded` startup process in `app.js` to call `loadFromServer()` and overwrite local storage keys before initializing dashboard state
- [x] 2.3 Update client save functions (`saveUsers`, `saveAppointments`, `savePayments`, `saveLeads`, etc.) in `app.js` to trigger background POST synchronization to `/api/db`

## 3. Verification

- [x] 3.1 Verify registering a new user creates a new record in `db.json` on the filesystem
- [x] 3.2 Verify restarting the server or reloading the browser displays the registered user and their session persistently
