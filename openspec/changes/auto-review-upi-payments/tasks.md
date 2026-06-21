## 1. Database & Server Setup

- [ ] 1.1 Extend the state model in `server.js` and `db.json` to include a `upi_ledger` cache representing received UPI bank transactions.
- [ ] 1.2 Implement the POST `/api/verify-upi` API endpoint on the Express server in `server.js` to process auto-verification matching against the `upi_ledger`.
- [ ] 1.3 Add a POST `/api/admin/upload-ledger` file upload endpoint to parse CSV and Excel bank statement files, extracting transaction details (UTR, amount, date, and other descriptions).

## 2. Client Integration & Form Callbacks

- [ ] 2.1 Update the UPI payment submission handler in `app.js` to invoke the verification API endpoint upon student UTR entry.
- [ ] 2.2 Add alert indicators in the student UI to notify that verification is in progress (due to statement upload delays) or if it has been auto-approved.
- [ ] 2.3 Ensure email and WhatsApp triggers are instantly dispatched with UTR metadata if auto-approved.

## 3. Administrative Interface Updates

- [ ] 3.1 Update the Admin Billing view to display transaction statuses properly (e.g. flagging unmatched/review items or showing automated approval details).
- [ ] 3.2 Add a ledger upload widget to the Admin settings tab to allow admins to upload CSV/Excel bank statements manually.
- [ ] 3.3 Ensure the ledger upload widget shows parsing summaries (e.g. "X transactions imported, Y duplicates ignored").
