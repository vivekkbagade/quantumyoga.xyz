# Billing & Payments

Quantum Yoga incorporates a transparent invoicing and transactions manager tailored for standard Indian merchant configurations.

---

## 🧾 Invoice Ledger Schema (`payments`)

Every student payment transaction maps to the following record structure:

*   `id`: Unique invoice identifier prefixed with `INV-` (e.g. `INV-10029`).
*   `userEmail`: Linked studio member email.
*   `description` / `amount`: Purpose of charge and value in INR (₹).
*   `dueDate` / `paymentDate`: Timeline dates.
*   `status`: Current state, transitioning between `pending`, `paid`, and `overdue`.
*   `utr`: User-submitted UPI Unique Transaction Reference.

---

## 📲 UPI QR Code Gateway Flow

To keep transaction processing cost-free, the platform leverages direct peer-to-peer UPI payments:

```
[Member clicks "Pay via UPI"]
               │
               ▼
[Generate standard UPI URI]
"upi://pay?pa={vpa}&pn={name}&am={amount}&tn={description}"
               │
               ▼
[Render live QR Code on Modal]
               │
               ▼
[Member scans & transfers on UPI App]
               │
               ▼
[Member inputs 12-digit UTR code on form]
               │
               ▼
[Status updates to 'paid', logs UTR reference]
```

---

## 🏢 System Notifications & Receipts

1.  **Overdue Banners:** If a logged-in member has *any* invoices past their due dates, a sticky global banner warns them of overdue fees and links directly to the invoice page.
2.  **Dynamic Receipts:** Fully responsive HTML invoice receipt layouts are generated on-demand with options to save or print. Contains transactional audit checkmarks, payment logs, and company branding.
3.  **Manual Invoices:** Administrators can quickly generate ad-hoc fee demands against any student account via the admin control panel.
