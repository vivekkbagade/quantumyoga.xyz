## ADDED Requirements

### Requirement: Resend API send
The system SHALL be able to send emails via the Resend REST API (`https://api.resend.com/emails`) using a stored API key and a configured `from` address. The function SHALL return `{ success: true, messageId }` on success and `{ success: false, error }` on failure.

#### Scenario: Successful send via Resend
- **WHEN** Resend is the active provider, a valid API key and from-address are configured, and `resendSendEmail()` is called
- **THEN** a `POST` request is made to `https://api.resend.com/emails` with `Authorization: Bearer <apiKey>` and JSON body `{ from, to, subject, html }`
- **THEN** the function returns `{ success: true, messageId: <id from response> }`

#### Scenario: Send fails with invalid API key
- **WHEN** Resend is the active provider and the API key is invalid or expired
- **THEN** the Resend API responds with a non-2xx status
- **THEN** the function returns `{ success: false, error: <error message from response> }`

#### Scenario: Send skipped when API key is missing
- **WHEN** Resend is the active provider but `resendApiKey` is empty
- **THEN** `resendSendEmail()` returns `{ success: false, error: "Resend API key not configured." }` without making a network request

---

### Requirement: Provider-agnostic transactional routing
The `sendTransactionalEmail(template, data, toEmail)` function SHALL route to either `gmailSendEmail()` or `resendSendEmail()` based on the value of `emailSettings.provider`. If `provider` is `"gmail"` it routes to Gmail; if `"resend"` it routes to Resend. If neither provider is properly configured it SHALL log a warning and return without sending.

#### Scenario: Route to Gmail when provider is "gmail"
- **WHEN** `emailSettings.provider === "gmail"` and Gmail is connected
- **THEN** `sendTransactionalEmail()` calls `gmailSendEmail()` with the rendered body

#### Scenario: Route to Resend when provider is "resend"
- **WHEN** `emailSettings.provider === "resend"` and a Resend API key is configured
- **THEN** `sendTransactionalEmail()` calls `resendSendEmail()` with the rendered body

#### Scenario: Graceful skip when provider is unconfigured
- **WHEN** `emailSettings.provider === "resend"` but `resendApiKey` is empty, OR `provider === "gmail"` but Gmail is not connected
- **THEN** `sendTransactionalEmail()` logs a console warning and returns without attempting to send

---

### Requirement: Email settings data model extension
The `emailSettings` (persisted under the existing `gmailSettings` key in localStorage and `db.json`) SHALL include three new fields: `provider` (string, `"gmail"` | `"resend"`, default `"gmail"`), `resendApiKey` (string, default `""`), and `resendFromAddress` (string, default `""`). On first load, if existing settings lack these fields, defaults SHALL be applied transparently.

#### Scenario: Backward-compatible migration on first load
- **WHEN** the app loads and `gmailSettings` in localStorage has no `provider` field
- **THEN** `loadEmailSettings()` adds `provider: "gmail"`, `resendApiKey: ""`, `resendFromAddress: ""` to the returned object
- **THEN** existing Gmail-connected state is preserved unchanged

#### Scenario: Settings persist across page reloads
- **WHEN** admin saves provider settings (provider, API key, from address)
- **THEN** values are written to localStorage and synced to `db.json` via `saveToServer()`
- **THEN** the values are present after a full page reload
