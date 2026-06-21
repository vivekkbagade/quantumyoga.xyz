# WhatsApp Integration & Alerts

Quantum Yoga supports automated notifications and direct admin-student communication links via WhatsApp.

---

## ⚙️ Administrative Configuration

Admins can configure settings under the **Admin > System Settings** panel:

- **Enable Automated Alerts:** A global toggle to switch auto-notifications on or off.
- **API Key / Token:** Auth credentials for your messaging provider.
- **Gateway URL:** The HTTP REST endpoint (e.g. `https://api.provider.com/send`) where message payloads are forwarded.
- **Custom Templates:** Editable message templates containing placeholder fields.

### Database Settings Structure (`whatsappSettings`)

Configuration is stored securely inside the global database state under the following schema:

```json
"whatsappSettings": {
  "enabled": false,
  "apiKey": "",
  "gatewayUrl": "",
  "templates": {
    "welcome": "Hello {{name}}, welcome to Quantum Yoga! Your temporary password is {{tempPass}}.",
    "invoice": "Hello {{name}}, a new invoice {{invoiceId}} for {{amount}} is due on {{dueDate}}. Pay here: {{link}}",
    "booking": "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}."
  }
}
```

---

## 🔔 Automated Notification Triggers

Whenever critical transactions or scheduling actions occur, the backend checks settings and dispatches HTTP requests via the `/api/send-whatsapp` endpoint:

1. **New Invoice Notices:** Sends invoice ID, amount, due date, and profile portal link upon invoice generation.
2. **Coaching Bookings:** Confirms session dates, times, and selected routines when scheduled.
3. **Rescheduling Alerts:** Informs the student of rescheduled class parameters.
4. **Cancellations:** Notifies the student if a private session is cancelled.

---

## 💬 WhatsApp Direct Chat Shortcuts

To enable zero-cost, manual communication between admins and users/leads, Quantum Yoga integrates custom redirect actions using the standard `https://wa.me/` protocol:

* **Trigger Actions:** Quick-chat buttons next to phone numbers in the CRM Kanban cards, Member profiles, Invoices table, and Appointment lists.
* **Auto-sanitization:** Phone strings are sanitized (stripping formatting spaces and prepending country code prefixes) to ensure redirection URLs parse successfully.
* **Pre-populated Templates:** Launches a WhatsApp Web browser tab pre-populated with customized greetings.
