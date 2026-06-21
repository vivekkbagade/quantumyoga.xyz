## ADDED Requirements

### Requirement: Administrative UPI Configuration
The system SHALL provide configuration input fields in the administrator's System Settings sub-panel to specify and save the merchant UPI ID (VPA) and payee name, persisting them in LocalStorage.

#### Scenario: Admin configures studio UPI details
- **WHEN** the administrator enters "quantumyoga@upi" in the UPI VPA field, "Quantum Yoga Studio" in the Payee Name field, and clicks "Save Settings"
- **THEN** the system SHALL save these configurations in LocalStorage and display a settings saved confirmation message.

### Requirement: Dynamic UPI QR Code Generation
The system SHALL dynamically render a scan-to-pay QR code for pending invoices in the student's billing profile. The QR code SHALL encode a valid UPI payment deep-link schema (`upi://pay?pa=<vpa>&pn=<payee>&am=<amount>&tn=<invoice_id>`) using the configured administrator VPA details.

#### Scenario: Student triggers payment modal for invoice
- **WHEN** a logged-in student clicks "Pay via UPI" on a pending invoice of ₹2499 (Invoice #INV-10029)
- **THEN** the system SHALL show an overlay containing a dynamically generated QR code representing the UPI pay URL for ₹2499 to the configured studio UPI address.

### Requirement: Transaction Reference Submission
The system SHALL allow students to enter a 12-digit transaction reference number (UTR/UPI Ref) after scanning the QR code, updating the invoice status to "Under Review".

#### Scenario: Student submits payment confirmation reference
- **WHEN** the student enters transaction ID "612345678901" in the reference field and clicks "Confirm Payment"
- **THEN** the system SHALL save the UTR reference, transition the invoice status to "Under Review", and refresh the client billing history table.

### Requirement: Admin Verification Ledger
The system SHALL display all "Under Review" invoices inside the administrator's Payments ledger, showing the student-submitted transaction reference number and buttons to approve or reject the payment.

#### Scenario: Admin verifies and approves payment
- **WHEN** the administrator checks the pending verification lists, locates Invoice #INV-10029 with UTR "612345678901", and clicks "Approve Payment"
- **THEN** the system SHALL transition the invoice status to "Paid", record the current timestamp as the paymentDate, and refresh the administrator KPI widgets.
