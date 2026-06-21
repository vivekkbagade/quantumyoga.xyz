## Context

Quantum Yoga Studio is a vanilla JS / HTML / CSS single-page application backed by a Vite dev server that exposes a `db.json` persistence layer. Email sending was introduced via the `gmail-email-integration` change, which wired the Gmail OAuth2 (GIS `tokenClient`) flow into the app. The current implementation has a single send path: `gmailSendEmail()` → Gmail REST API. All transactional triggers (`sendTransactionalEmail()`) delegate to this function.

Resend is a transactional email API that accepts an HTTP `POST` to `https://api.resend.com/emails` with a `Bearer <api_key>` header and a JSON body `{ from, to, subject, html }`. It requires no OAuth flow — just a static API key that admins generate once in the Resend dashboard. The key is stored server-side (in `db.json` via the Vite middleware) and never exposed in client HTML.

Current storage shape:
```json
"gmailSettings": {
  "clientId": "",
  "connectedEmail": "",
  "accessToken": "",
  "tokenExpiry": 0
}
```

## Goals / Non-Goals

**Goals:**
- Add a `resendSendEmail()` function that calls the Resend REST API from the browser using a stored API key
- Extend `gmailSettings` → `emailSettings` with `provider` ("gmail" | "resend"), `resendApiKey`, and `resendFromAddress` fields
- Route `sendTransactionalEmail()` through the active provider automatically
- Give admins a UI card in System Settings to select the provider and configure Resend credentials
- Update the Email tab's connection-status card to display which provider is active
- Maintain full backward compatibility: existing Gmail-connected installations continue working unchanged

**Non-Goals:**
- Server-side email relay / proxy (all API calls remain browser → Resend/Gmail)
- Resend webhook ingestion or incoming email support (Resend sends only)
- Multi-provider fan-out (emails go through exactly one provider at a time)
- Email open/click tracking display in the inbox UI

## Decisions

### 1. Extend `gmailSettings` vs. create a new `emailSettings` key

**Decision**: Extend `gmailSettings` in place, renaming only the conceptual name in code to `emailSettings` (the localStorage key stays `qy_gmail_settings` for backward compat).

**Rationale**: Changing the localStorage key would break existing installs that already have Gmail connected. New fields (`provider`, `resendApiKey`, `resendFromAddress`) are added alongside the existing Gmail fields. Default `provider` is `"gmail"` so existing setups fall through unchanged.

**Alternative considered**: New `qy_email_settings` key with migration — rejected because it adds a migration step and risk of losing the connected Gmail state during the transition.

---

### 2. Provider routing in `sendTransactionalEmail()` vs. at each call site

**Decision**: Centralise routing inside `sendTransactionalEmail()`. Neither the invoice handler nor the appointment handler needs to know which provider is active.

**Rationale**: Single place to change routing logic. Keeps call sites clean.

---

### 3. Resend API called from browser vs. Vite proxy

**Decision**: Direct browser → `https://api.resend.com` fetch with the API key in the `Authorization` header.

**Rationale**: The app already makes direct browser calls to the Gmail REST API. The Vite middleware is only used for `db.json` persistence, not as a security proxy. Resend API keys are low-risk (send-only, can be scoped per domain in the Resend dashboard). Keeping calls client-side avoids adding any server-side Node code.

**Risk**: API key is visible in localStorage / memory. Mitigated by storing it only in `db.json` (served locally, not embedded in source) and instructing admins to use a domain-scoped key.

---

### 4. `resendFromAddress` field

**Decision**: Admins configure a `from` address (e.g., `Quantum Yoga <studio@yourdomain.com>`) that is included in every Resend send. This is required by Resend (unlike Gmail OAuth, which always uses the authenticated account's address).

---

### 5. UI: radio buttons vs. toggle vs. dropdown for provider selection

**Decision**: A styled two-option toggle (`Gmail` / `Resend`) that visually highlights the active provider. Below it, conditional configuration sections collapse/expand based on selection (Gmail section shows connect/disconnect; Resend section shows API key + from address inputs).

**Rationale**: Two options makes a toggle the clearest affordance. A dropdown would be overkill for two choices.

---

### 6. Status display on Admin Email tab

**Decision**: Replace the current `adminGmailConnectedLabel` / `adminGmailDisconnectedLabel` pair with a single `emailProviderStatusCard` that shows the active provider name and its connectivity state.

**Rationale**: The inbox tab should be provider-agnostic in its language. "Gmail Connected" is wrong when Resend is the active provider.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Resend API key stored in browser localStorage | Use a send-scoped, domain-restricted Resend API key; document this in the UI help text |
| Resend has no inbox — the "Inbox" tab only shows emails fetched via Gmail | When Resend is the active provider, the inbox is disabled with an explanatory message; the compose form remains active for sending |
| Breaking existing Gmail setups on upgrade | Default `provider = "gmail"`, new fields are optional — existing code paths unchanged |
| Admin enters wrong Resend API key | `resendSendEmail()` surfaces the API error in the compose form's send message area |
| CORS — Resend API must allow browser requests | Resend's public API supports CORS for browser sends; this is documented in their API reference |

## Migration Plan

1. On first load after update, `loadEmailSettings()` reads existing `gmailSettings` from localStorage, adds defaults for new fields (`provider: "gmail"`, `resendApiKey: ""`, `resendFromAddress: ""`), and writes back — transparent to the user.
2. No data migration needed in `db.json` — the new fields simply appear as empty strings on first `saveToServer()`.
3. Rollback: if the feature is reverted, Gmail-connected state is preserved because we never removed those fields.

## Open Questions

- None — implementation is straightforward given the existing Gmail integration as a pattern to follow.
