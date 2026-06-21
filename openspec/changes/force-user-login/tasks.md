## 1. HTML Layout Restructuring

- [x] 1.1 Wrap header, main, and footer layout sections inside `#dashboard-app` in `index.html`.
- [x] 1.2 Create `#auth-gate-fullscreen` container outside the dashboard wrapper containing the tabbed login and registration forms in `index.html`.

## 2. Authentication Gate Logic

- [x] 2.1 Bind JS variables for `#dashboard-app` and `#auth-gate-fullscreen` in `app.js`.
- [x] 2.2 Update session initialization and check flows to show/hide layout wrappers accordingly in `app.js`.
- [x] 2.3 Refactor registration, login, and logout submit handlers to transition views on auth state change in `app.js`.

## 3. Styling & Verification

- [x] 3.1 Design fullscreen flex layout styles and glassmorphic card overlays for `#auth-gate-fullscreen` in `index.css`.
- [x] 3.2 Verify login enforcement, regular logins, and logout redirects in the browser.
