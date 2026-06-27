## Context

Currently, the admin portal displays an "Email Provider" settings card to configure Gmail OAuth and Resend API integrations. This design moves the configuration purely to the server-side environment variables (.env file) to prevent storing sensitive keys in the client's local storage.

## Goals / Non-Goals

**Goals:**
- Remove the Gmail and Resend settings UI from the admin portal configuration interface.
- Force the application client-side to assume Resend is configured and active (`resendConfigured = true`).
- Ensure all API-based mail sends pass empty configuration fields so the backend defaults to the environment variables (`RESEND_API_KEY`, `RESEND_FROM_ADDRESS`).

**Non-Goals:**
- Implementing a database-based configuration mechanism.
- Modifying email delivery engines beyond utilizing existing environment variables.

## Decisions

- **Client-side configuration mock**: Instead of looking up `localStorage` settings for Resend configuration status, `app.js` and `admin-emails.html` will hardcode or bypass configuration verification, assuming `resendConfigured` is `true`.
- **Environment fallback routing**: When sending emails, the client leaves `apiKey` and `from` empty, causing the server proxy `/api/send-email` to use `process.env.RESEND_API_KEY` and `process.env.RESEND_FROM_ADDRESS` respectively.

## Risks / Trade-offs

- **[Risk]**: If the server environment variables are not set up or configured improperly, mail sends will fail silently or return a 500 without prior client-side validation.
  - *Mitigation*: Ensure the backend proxy returns descriptive errors and prints clear warnings in PM2 logs if environment variables are missing during startup or execution.
