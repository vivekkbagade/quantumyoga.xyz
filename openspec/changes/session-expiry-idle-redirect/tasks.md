## 1. Core Implementation

- [x] 1.1 Implement route guard checking on startup in `app.js` to redirect unauthenticated users accessing protected hashes (`#admin-section` or `#profile-section`) to the login screen and clear the URL hash
- [x] 1.2 Add a `hashchange` event listener on `window` to enforce the route guard if a visitor manually edits the URL hash in the browser address bar
- [x] 1.3 Modify the explicit logout button event handler to clear the URL hash when logging out
- [x] 1.4 Attach global activity event listeners (`mousemove`, `mousedown`, `keypress`, `scroll`, `click`, `touchstart`) inside `app.js` that update a throttled `qy_last_activity` timestamp in `localStorage`
- [x] 1.5 Implement a periodic `setInterval` check (every 5 seconds) that triggers session expiry, clears the hash, and redirects to the login screen when the user is idle for more than 15 minutes (or 10 seconds if the query string `?idleTest=1` is present)

## 2. Verification

- [x] 2.1 Verify that attempting to visit `#admin-section` or `#profile-section` directly without an active session redirects to the login screen and resets the URL hash
- [x] 2.2 Verify that clicking the explicit logout button clears the active URL hash and redirects to the login screen
- [x] 2.3 Verify that logging in with `?idleTest=1` in the URL automatically logs out the user and redirects them to the auth screen after 10 seconds of complete inactivity
