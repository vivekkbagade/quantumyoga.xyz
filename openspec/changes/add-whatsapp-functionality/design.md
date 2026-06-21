## Context

Quantum Yoga manages student records, billing schedules, and communication through its central database state. The app currently supports email notifications (via Resend) and admin-student messaging (via Gmail OAuth). This design details the integration of WhatsApp as a primary notification channel for alerts, billing links, and booking confirmations.

## Goals / Non-Goals

**Goals:**
- Provide direct WhatsApp Web action shortcuts (`https://wa.me/`) from the Admin CRM board, lead details modal, and student lists to start chats with pre-filled templates.
- Dispatch automatic WhatsApp reminders upon class booking, rescheduling, and new/overdue invoice creation.
- Add system settings in the admin panel to toggle WhatsApp globally, specify API keys, and custom templates.

**Non-Goals:**
- A custom interactive WhatsApp inbox in the application dashboard (we will redirect admins to WhatsApp Web/Desktop instead).
- Verification of phone number delivery status within the platform.

## Decisions

### 1. Integration Method
- **Decision:** Use a lightweight WhatsApp API proxy endpoint `/api/send-whatsapp` in `server.js`. The proxy will send HTTP requests to a configurable service provider (e.g. Twilio API or custom REST gateway).
- **Rationale:** Keeps configuration details (API keys) secure on the backend and allows flexible provider replacement without client-side modifications.

### 2. Live Chat Redirection
- **Decision:** Implement client-side redirection using `https://wa.me/<phone>?text=<message>` for custom admin-initiated messages.
- **Rationale:** Zero cost, requires no API credits, and works seamlessly on both mobile (WhatsApp App) and desktop (WhatsApp Web or Desktop Client).

### 3. Settings Schema Extension
- **Decision:** Save configuration in the global DB state under a new `whatsappSettings` object:
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

## Risks / Trade-offs

- **[Risk] Invalid or Unformatted Phone Numbers** → **Mitigation:** Sanitize phone numbers on the frontend/backend by stripping spaces, dashes, and letters, ensuring the country code prefix is added (e.g., `+91` for Indian locale).
- **[Risk] High API Cost for Automated WhatsApp Gateways** → **Mitigation:** Provide a global toggle in settings to enable/disable automated WhatsApp alerts, falling back to free standard email alerts.
