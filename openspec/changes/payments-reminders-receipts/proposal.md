## Why

Currently, Quantum Yoga provides no financial or membership payment management. Introducing billing capabilities, invoice tracking, automated due reminders, and downloadable payment receipts helps administrators track studio revenue and keeps students informed of their active invoice details without administrative overhead.

## What Changes

- **Student Billing Panel**: Add a "Billing & Receipts" section inside the student Profile view to display invoice lists (due amount, status, date) and download receipts.
- **Overdue Payment Alerts**: Display a high-visibility header banner alert for logged-in students if they have pending or overdue subscription payments.
- **Admin Invoicing & Reminders**: Add a new "Payments & Billing" sub-tab in the Admin dashboard showing studio-wide transaction lists.
- **Reminders & Receipts Control**: Allow administrators to manually trigger reminder alerts, record payments to transition status, and auto-generate receipts.

## Capabilities

### New Capabilities
- `payments-reminders-receipts`: Enables billing tracking, receipt generation, automated overdue notifications, and administrative invoice recording.

### Modified Capabilities

## Impact

- Modifies `index.html` to inject student billing summaries, invoice lists, warning banners, and the administrative payments tracking panel.
- Modifies `app.js` to manage billing entries, trigger alerts, process payment logs, and persist finance entries under `qy_payments` in LocalStorage.
