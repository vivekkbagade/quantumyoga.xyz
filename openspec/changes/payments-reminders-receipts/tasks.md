## 1. UI Implementation

- [x] 1.1 Add the "Billing & Receipts" card and invoice list table inside `#profile-section` of `index.html`.
- [x] 1.2 Inject the overdue payment notification banner `#overdue-payment-banner` to the main viewport area of `index.html`.
- [x] 1.3 Add the detailed receipt modal `#receipt-modal` overlay (including print styling classes) in `index.html`.
- [x] 1.4 Add the "Payments & Billing" sub-tab button `#admin-payments-tab-btn` and panel `#admin-payments-panel` to the admin section of `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind DOM variables for invoice summaries, warning banners, receipt views, and admin billing selectors in `app.js`.
- [x] 2.2 Extend `setAdminSubTab(panelName)` in `app.js` to support switching to the `"payments"` panel and loading transaction tables.
- [x] 2.3 Implement storage functions (`loadPayments()`, `savePayments()`) and dynamic mockup invoice seeder logic inside user startup checks in `app.js`.
- [x] 2.4 Integrate overdue payment alert checks inside `updateUIForLogin()` to display the header warning banner dynamically.
- [x] 2.5 Implement the receipt overlay modal details display, print handler, and admin triggers for manual payments and alerts in `app.js`.

## 3. Verification

- [x] 3.1 Verify student-facing billing summaries, overdue alerts, and PDF receipt downloads display correctly in the browser.
- [x] 3.2 Verify admin-facing billing pipeline actions (recording payments, creating invoices, sending reminders) sync and persist in the browser.
