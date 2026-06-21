## Why

To support seamless digital transactions for members in India, the system needs a local payment integration. Standard credit card processors are often not preferred or accessible for Indian students, whereas Unified Payments Interface (UPI) is the dominant payment method. Adding a dynamic UPI QR code generation system configured by administrators allows students to pay invoices instantly using standard mobile payment apps (GPay, PhonePe, Paytm).

## What Changes

- **Admin UPI Configuration**: Introduce a form in the Admin System Settings sub-panel allowing administrators to configure the studio's merchant UPI ID (VPA) and payee name.
- **Dynamic QR Code Display**: In the student's profile billing panel, replace the static invoice listings or manual overlays with a dynamic "Pay via UPI" interface that generates a QR code representing the UPI payment URL (`upi://pay?pa=...&pn=...&am=...&tn=...`).
- **Student Payment Submission**: Allow students to submit the transaction reference number (UTR/UPI Ref) after scanning the QR code, transitioning the invoice status to "Under Review".
- **Admin Validation Ledger**: Update the administrator's payments ledger to highlight invoices that are "Under Review", displaying the student-submitted UTR and allowing the admin to record the payment as "Paid" or reject it.

## Capabilities

### New Capabilities
- `upi-qr-payments`: Introduces administrative configuration settings for a UPI ID, dynamic UPI QR payment link generation in the client billing panel, student reference submission, and admin payment confirmation dashboards.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Modifies `index.html` to add the UPI config form in Admin Settings, a UPI reference submission form in the Client Billing panel, and references to a QR code generator library (e.g., QRCode.js or similar API).
- Modifies `index.css` to add styles for the QR code overlay, column layouts for payment screens, and status badges for "Under Review" states.
- Modifies `app.js` to handle saving the UPI VPA configuration in LocalStorage, rendering QR codes dynamically on payment triggers, saving student UPI transaction reference logs, and processing admin validation triggers.
