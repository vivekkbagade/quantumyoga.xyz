## Why

Quantum Yoga Studio currently sends emails exclusively through Gmail OAuth2, which requires the admin to connect a personal Gmail account and keep it authenticated. This creates friction for studios that want programmatic, reliable transactional email delivery (invoices, appointment confirmations, enrollment notices) without OAuth re-authentication headaches. [Resend](https://resend.com) is a modern developer-focused email API that uses a simple API key — no OAuth flow needed — and provides delivery analytics and a generous free tier, making it a natural complement to Gmail for transactional sends. Admins should be able to choose whichever provider fits their workflow.

## What Changes

- **New**: `emailSettings` configuration in `db.json` / `gmailSettings` extended with `provider` field (`"gmail"` | `"resend"`) and `resendApiKey` field
- **New**: `resendSendEmail(to, subject, bodyHtml, bodyText)` service function that calls the Resend REST API (`https://api.resend.com/emails`) using a stored API key
- **New**: Admin Settings card — **Email Provider** — lets admin choose between Gmail and Resend and configure the Resend API key
- **Modified**: `sendTransactionalEmail()` routes to either `gmailSendEmail()` or `resendSendEmail()` based on the configured provider
- **Modified**: Admin Email Inbox tab connection status card shows the active provider and its configuration state
- **Modified**: `updateGmailStatusUI()` → renamed/refactored to `updateEmailProviderStatusUI()` to reflect provider-agnostic logic

## Capabilities

### New Capabilities
- `resend-provider`: Resend API integration — API key storage, `resendSendEmail()` service function, transactional email routing
- `email-provider-selector`: Admin UI card that lets admin select the active email provider (Gmail or Resend) and configure provider-specific settings (Resend API key); shows active provider badge on the Email tab

### Modified Capabilities
- `admin-email-inbox`: Connection/status card updated to reflect active provider instead of always showing Gmail status; connect/disconnect controls shown conditionally

## Impact

- **`app.js`**: New `resendSendEmail()` function; `sendTransactionalEmail()` routing logic; extended `loadGmailSettings()` / `saveGmailSettings()` (or new `loadEmailSettings()` / `saveEmailSettings()`) to include `provider` + `resendApiKey`; `updateGmailStatusUI()` refactored
- **`db.json`**: `gmailSettings` extended with `provider: "gmail"` and `resendApiKey: ""`
- **`index.html`**: New "Email Provider" settings card in Admin Settings panel; new Resend API key input field; provider selector radio/toggle
- **`index.css`**: Minor additions for provider selector toggle and Resend status badge
- **No new npm dependencies** — Resend is called via the browser's native `fetch()` against `https://api.resend.com`
