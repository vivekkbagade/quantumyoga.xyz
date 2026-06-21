## 1. UI Structure Restructuring

- [x] 1.1 Restructure `#profile-section` in `index.html` to introduce a sub-tab navigation bar with "My Studio Dashboard" and "My Practice Log" options.
- [x] 1.2 Design and inject container elements for the Batch Overview card, the Upcoming Session timeline feed, and the Billing Log list inside the Dashboard view.
- [x] 1.3 Move the existing favorites grid and completion history list under the Practice Log panel container.

## 2. CSS Styling & Premium UI Polish

- [x] 2.1 Write styling in `index.css` for sub-tab navigation buttons, active batch info cards, session timelines, and billing tables.
- [x] 2.2 Apply glassmorphic borders, hover transitions, flex/grid responsiveness, and matching visual accents (Midnight Aura, Ethereal Light, Zen Sunset).

## 3. Dashboard Logic & Relational Data Rendering

- [x] 3.1 Implement dashboard controller logic in `app.js` to run on tab switch or page loading, reading user session state.
- [x] 3.2 Implement `renderClientBatchDetails()` to find the active batch in `qy_batches` using `user.batchId` and populate the batch details block.
- [x] 3.3 Implement `renderClientSessionsFeed()` to combine upcoming batch sessions and appointments from `qy_appointments` into a sorted chronological feed.
- [x] 3.4 Implement inline interaction handlers for class check-ins, cancellations, or rescheduling requests, modifying LocalStorage entries and triggering UI refreshes.
- [x] 3.5 Implement `renderClientBillingHistory()` to query payments from `qy_payments` for the user and render invoices with download triggers.

## 4. Verification & Testing

- [x] 4.1 Perform verification by logging in as a member, checking batch details, checking upcoming classes, and interacting with schedule items.
- [x] 4.2 Verify invoice listings render correctly and receipts open print dialogue sheets properly.
