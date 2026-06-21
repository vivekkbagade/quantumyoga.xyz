## Why

Currently, Quantum Yoga members do not have a unified, personalized hub to view their specific class schedules, batch assignments, and payment histories. Creating a customized client page simplifies the member experience by consolidating class previews, batch overviews, and billing logs into a single dedicated space, keeping clients connected and engaged with their wellness journey.

## What Changes

- **Personalized Client Hub**: Restructure the Profile section into a comprehensive client dashboard displaying upcoming classes, batch details, and billing logs alongside favorites and history.
- **Batch & Class Previews**: Display details of the client's assigned batch (schedule, instructor, size) and highlight their next upcoming class sessions.
- **Interactive Billing Log**: Provide a tabular view of the member's invoices and subscription records with download/print functionality for receipts.
- **Class Actions**: Allow members to check-in, reschedule, or cancel bookings directly from their dashboard.

## Capabilities

### New Capabilities
- `custom-client-pages`: Provides each yoga student with a dedicated, personalized dashboard within their profile containing upcoming classes, batch details, and billing history.

### Modified Capabilities

## Impact

- Modifies `index.html` to expand the student profile tab layout with sections for batch info, schedule previews, and invoice lists.
- Modifies `app.js` to load, filter, and render relational client data (batches, classes, invoices) from LocalStorage based on the current user's profile.
