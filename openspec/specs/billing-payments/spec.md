# Billing, Invoices & Payments Spec

## Overview
This capability handles the issuance of member invoices, overdue payments notification banners, unified UPI QR code generation, transaction tracking via UTR (Unique Transaction Reference) codes, and PDF/HTML receipt generation.

## Data Structures

### Payments Schema (`payments`)
Each payment record contains:
- `id` (string): Unique invoice ID prefixed with `INV-` (e.g., `"INV-10029"`).
- `userEmail` (string): Email of the member assigned to the invoice.
- `description` (string): Purpose of charge (e.g., `"Monthly subscription fee"`).
- `amount` (string): Invoice cost in Rupees (INR).
- `dueDate` (string): YYYY-MM-DD due date.
- `status` (string): `pending`, `paid`, or `overdue`.
- `paymentDate` (string, optional): Date payment was processed.
- `lastReminderSent` (string, optional): Timestamp of last automated warning.
- `utr` (string, optional): User-submitted UPI Unique Transaction Reference.

### UPI Settings Schema (`upi_settings`)
Admin-configured receiver credentials:
- `vpa` (string): Virtual Payment Address (e.g., `merchant@okicici`).
- `name` (string): Merchant Name (e.g., `Quantum Yoga Ltd.`).

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

### 3. UPI QR Code Modal
- Initiated when clicking "Pay via UPI".
- Displays recipient details (Merchant Name and UPI VPA).
- Generates a **live UPI QR Code** using the standard scheme:
  `upi://pay?pa={vpa}&pn={name}&am={amount}&tn={description}`
- Displays a form to input the **UTR (Unique Transaction Reference)** after scanning and paying.
- Submitting the UTR marks the payment status as `paid` and assigns the UTR code to the database record.

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
