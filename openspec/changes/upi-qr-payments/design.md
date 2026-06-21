## Context

Currently, the Quantum Yoga platform has mock billing invoices but lacks an actual payment method. To localized payments for Indian students, we need to offer UPI payments. This change introduces administrator settings to configure the studio VPA and payee name, dynamic QR code generation inside client invoice rows, reference logging, and an admin validation interface.

## Goals / Non-Goals

**Goals:**
- Add VPA and payee name input configurations inside Admin Settings.
- Display a "Pay via UPI" trigger next to pending invoices in the student profile.
- Generate a dynamic QR code using the configured VPA, invoice amount, description, and invoice ID.
- Provide a payment confirmation step allowing the student to enter their UPI transaction reference (UTR) code, transitioning the invoice to an "Under Review" state.
- Add validation options inside the admin billing ledger to approve or reject pending validation requests.

**Non-Goals:**
- Real-time API integration with Indian bank settlement networks (we will use manual UTR/UPI Ref verification by administrators).

## Decisions

### 1. Dynamic QR Code Rendering Method
- **Decision**: Use the free QRServer API (`https://api.qrserver.com/v1/create-qr-code/`) to render the QR code inside an HTML `<img>` element instead of loading and parsing an external client-side QR JavaScript library.
- **Rationale**: Keeps the codebase lightweight and dependencies minimal. Utilizing a direct image URL containing the URL-encoded UPI deep-link schema (`upi://pay?...`) is fully responsive and loads immediately with zero JS library overhead.

### 2. State & Database Updates
- **Decision**: Introduce a new status state `"review"` for invoices that have been submitted by the student with a reference UTR number. Update `qy_payments` schema dynamically:
  - Add `utr` (string) for storing validation references.
- **Rationale**: Keeps database changes backward-compatible while tracking verification pipeline status transitions cleanly.

### 3. Payment UI Placement
- **Decision**: Create a dedicated payment modal overlay (`#upi-payment-modal`) in `index.html` styled with glassmorphism tokens.
- **Rationale**: Keeps the user focused on the active transaction step, listing the payee name, amount, generated QR code, and UTR input form clearly in a single view.

## Risks / Trade-offs

- **[Risk]** If the admin has not configured a UPI ID, dynamic QR code generation will fail.
  - *Mitigation*: Fall back to a default studio UPI address (e.g. `quantumyoga@upi`) if no custom configuration is found in LocalStorage, and print a warning console message.
