## Why

Students often miss email notifications (invoices, class reminders, booking confirmations) due to cluttered inboxes. Integrating WhatsApp communication will significantly improve response rates for pending invoices, lower session cancellation rates through timely alerts, and streamline admin communication with CRM leads.

## What Changes

- Add **WhatsApp Notifications** capability to send automatic alerts (welcomes, class booking confirmations, payment reminders with payment links) directly to student phone numbers.
- Add **Admin WhatsApp Hub / Quick Link Actions** within the CRM and Invoices dashboard to initiate WhatsApp chats with students/leads.
- Add **WhatsApp Settings Panel** in Admin System Settings to configure WhatsApp integration credentials.

## Capabilities

### New Capabilities
- `whatsapp-communication`: Captures the configuration, template message schemas, and workflow triggers for sending automated notifications and launching chats with members and leads via WhatsApp.

### Modified Capabilities
- `billing-payments`: Integrating WhatsApp automated reminders for invoice generation and overdue alerts.
- `class-scheduling`: Integrating WhatsApp notifications for booking confirmations, rescheduling, and cancellations.
- `leads-crm`: Integrating WhatsApp chat shortcut links inside the swimlane Kanban board and CRM logs to easily communicate with prospects.

## Impact

- **Backend (server.js):** Additional endpoint proxies for WhatsApp messaging providers (e.g., Twilio API or custom gateway API), template storage, and webhooks.
- **Frontend (index.html, index.css):** Configuration controls under Admin > Settings, new WhatsApp action buttons (with icons) next to invoice listings, lead cards, and appointment schedules.
- **State Schema:** Integration keys (VPA details, active WhatsApp toggle, API key, template strings) in the DB state.
