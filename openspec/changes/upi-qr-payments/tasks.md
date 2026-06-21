## 1. UI Elements

- [x] 1.1 Add merchant VPA settings inputs to the Admin System Settings sub-panel inside `index.html`.
- [x] 1.2 Add the client `#upi-payment-modal` overlay container inside `index.html` including transaction UTR fields.
- [x] 1.3 Implement styles in `index.css` for the QR modal and dynamic state badges.

## 2. Admin Settings Configuration

- [x] 2.1 Add event handlers in `app.js` to store payee details and merchant UPI IDs in LocalStorage.
- [x] 2.2 Load and pre-populate UPI parameters upon dashboard initialization.

## 3. Dynamic Student Payment Flow

- [x] 3.1 Insert "Pay via UPI" triggers next to pending invoices in the student profile billing grid.
- [x] 3.2 Build the dynamic QR URL generator overlay using the QRServer API.
- [x] 3.3 Add UTR submit forms to update status to "review" and log reference codes.

## 4. Admin Validation Ledger

- [x] 4.1 Update the admin payments ledger to display UTR details and confirm actions for review states.
- [x] 4.2 Program approval/rejection event listeners to commit status changes.

## 5. Verification & Testing

- [x] 5.1 Test settings inputs, student payment flows, and admin confirmations in the browser.
