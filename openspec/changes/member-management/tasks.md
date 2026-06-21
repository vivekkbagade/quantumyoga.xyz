## 1. UI Implementation

- [x] 1.1 Add membership indicators (tier, status, expiration) and student goals/health log textareas to the Profile section in `index.html`.
- [x] 1.2 Inject membership configuration inputs (tier selects, status dropdowns, expiry inputs, and coaching note textareas) to the Admin inspect user detail modal in `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind DOM variables for profile membership displays, wellness goal forms, admin inspect selector inputs in `app.js`.
- [x] 2.2 Seed newly registered user records with default membership properties (tier Basic, status Active, expiry current date + 30 days) in `app.js`.
- [x] 2.3 Implement legacy fallbacks in `loadUsers()` within `app.js` to auto-populate missing membership schemas dynamically for older test profiles.
- [x] 2.4 Implement the Profile wellness forms save listener in `app.js` to store goals and physical notes updates.
- [x] 2.5 Update administrative user inspection modal handlers in `app.js` to render and save updated membership tier, status, dates, and coaching logs.

## 3. Verification

- [x] 3.1 Verify student wellness goals, health logs, and membership level listings update and save correctly in the browser.
- [x] 3.2 Verify administrator controls for membership status, levels, expiration dates, and logs sync and save in the browser.
