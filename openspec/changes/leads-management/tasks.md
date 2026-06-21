## 1. UI Implementation

- [x] 1.1 Add the "Inquire" tab button `#auth-inquire-tab-btn` and the inquiry form container `#auth-inquire-form-wrapper` to the public fullscreen login gate in `index.html`.
- [x] 1.2 Add the "Leads Pipeline" sub-tab button `#admin-leads-tab-btn` and leads panel `#admin-leads-panel` to the admin section of `index.html`.
- [x] 1.3 Implement the lead inspection modal `#admin-inspect-lead-modal` (containing log displays, follow-up inputs, status dropdowns, and conversion triggers) in `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind DOM variables for inquiry tab controls, inquiry forms, leads panel buttons, and inspect lead modal fields in `app.js`.
- [x] 2.2 Extend the auth gate switcher function `switchAuthTab` in `app.js` to handle switching to the inquiry tab.
- [x] 2.3 Implement storage functions (`loadLeads()`, `saveLeads()`) and submit handlers for public inquiries to persist entries to LocalStorage under the key `qy_leads`.
- [x] 2.4 Extend `setAdminSubTab` in `app.js` to support tab-switching for the `"leads"` panel and rendering the leads pipeline table.
- [x] 2.5 Implement handlers in `app.js` to inspect leads, add follow-up notes, transition pipeline statuses, and auto-register converted users.

## 3. Verification

- [x] 3.1 Verify public lead submission forms, validation checks, and success messages in the browser.
- [x] 3.2 Verify admin-facing lead pipeline logs, status changes, and user conversions save and persist correctly in the browser.
