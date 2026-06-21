# Billing, Invoices & Payments Spec

## Overview
This capability handles the issuance of member invoices, overdue payments notification banners, unified UPI QR code generation, transaction tracking via UTR (Unique Transaction Reference) codes, automatic UPI payment reconciliation against an uploaded bank statement ledger, and PDF/HTML receipt generation.

## Data Structures

### Payments Schema (`payments`)
Each payment record contains:
- `id` (string): Unique invoice ID prefixed with `INV-` (e.g., `"INV-10029"`).
- `userEmail` (string): Email of the member assigned to the invoice.
- `description` (string): Purpose of charge (e.g., `"Monthly subscription fee"`).
- `amount` (string): Invoice cost in Rupees (INR).
- `dueDate` (string): YYYY-MM-DD due date.
- `status` (string): `pending`, `paid`, `review` (Under Review), `discrepancy`, or `overdue`.
- `paymentDate` (string, optional): Date payment was processed.
- `lastReminderSent` (string, optional): Timestamp of last automated warning.
- `utr` (string, optional): User-submitted UPI Unique Transaction Reference.
- `verifiedAt` (string, optional): Timestamp of reconciliation.
- `verificationSource` (string, optional): Reconciliation method (e.g., `"ledger"`).
- `verificationError` (string, optional): Error details if reconciliation is flagged as discrepancy.

### UPI Settings Schema (`upi_settings`)
Admin-configured receiver credentials:
- `vpa` (string): Virtual Payment Address (e.g., `merchant@okicici`).
- `name` (string): Merchant Name (e.g., `Quantum Yoga Ltd.`).

### UPI Ledger Schema (`upi_ledger`)
Trusted bank transaction entries loaded via admin statement uploads:
- `utr` (string): Cleaned transaction reference code.
- `amount` (string): Received transaction amount.
- `date` (string): Transaction timestamp or date from statement.
- `senderName` (string): Name of sender / payer.
- `details` (string): Transaction descriptions/remarks.
- `importedAt` (string): Timestamp of the CSV import.

---

## Workflows & Interfaces

### 1. Overdue Payment Warning Banner
- Displays an alert banner at the top of the client dashboard if the logged-in user has *any* invoices marked as `overdue`.
- The banner displays the overdue invoice ID and description, and includes a **"Pay Now"** shortcut link.

### 2. Member Invoice Table
- Listed under the member's Profile Billing tab.
- Categorizes payments into status-colored rows.
- Paid invoices show a **"View Receipt"** action.
- Pending or Overdue invoices show a **"Pay via UPI"** action.

### 3. UPI QR Code Modal & Submission
- Initiated when clicking "Pay via UPI".
- Displays recipient details (Merchant Name and UPI VPA).
- Generates a **live UPI QR Code** using the standard scheme:
  `upi://pay?pa={vpa}&pn={name}&am={amount}&tn={description}`
- Displays a form to input the **UTR (Unique Transaction Reference)** after scanning and paying.
- Submitting the UTR triggers the auto-verification check.

### 4. Receipt Modal
- Populated dynamically with invoice metadata.
- Renders a clean printable receipt format featuring:
  - Yoga studio branding logo.
  - Payment details (Invoice ID, Date, Amount).
  - Payer and Payee details.
  - Transaction confirmation checkmark and reference logs.

### 5. Admin Invoicing Tool
- Admin-facing panel to issue new invoices manually.
- Fields: Member Email, Description, Amount (INR), and Due Date.
- Updates the payment list and triggers notification streams.

### 6. Automated UPI Reconciliation & Ledger Upload
- **Admin Statement Upload:** Admins can upload CSV bank statement ledgers via the Admin Settings panel. The system parses headers to extract UTR, amount, date, and sender details, filter duplicates, and append new transactions to the database's `upi_ledger` cache.
- **Auto-Verification Matching:** When a UTR is submitted by a student:
  - Exact Match (UTR + Amount): Automatically approves payment to `paid`, logs UTR, and triggers confirmation notifications.
  - UTR Match + Amount Mismatch: Flags payment status as `discrepancy` for administrative action.
  - UTR Not Found: Puts status under `review` (Under Review) to await manual reconcile or statement sync.

