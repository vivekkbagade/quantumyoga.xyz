## 1. Backend Integration & Routing

- [x] 1.1 Extend the database state schema to include the `whatsappSettings` configuration object (enabled state, API key, gateway URL, and template text strings).
- [x] 1.2 Implement the `/api/send-whatsapp` Express POST route in `server.js` to dispatch mock or production HTTP requests to the WhatsApp provider endpoint.

## 2. Admin System Settings

- [x] 2.1 Add the WhatsApp Integration Settings interface to the Admin Settings panel in `index.html` (global toggle, API credentials input, template editor).
- [x] 2.2 Bind DOM event handlers to save WhatsApp Settings changes to the database state on update.

## 3. Automated Notification Triggers

- [x] 3.1 Integrate a WhatsApp notification trigger inside the manual invoicing tool code when an invoice is issued or updated.
- [x] 3.2 Integrate WhatsApp triggers inside the appointment booking, rescheduling, and cancellation event handlers.

## 4. UI Dashboard WhatsApp Shortcut Actions

- [x] 4.1 Update the CRM Swimlane Kanban cards in `index.html`/JavaScript to include WhatsApp direct-chat launch icons next to prospect phone numbers.
- [x] 4.2 Add WhatsApp launch controls next to student profiles, appointment lists, and outstanding billing ledger items.
