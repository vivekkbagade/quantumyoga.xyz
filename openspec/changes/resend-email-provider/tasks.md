## 1. Data Model Extension (db.json + app.js)

- [x] 1.1 Add `provider` (default `"gmail"`), `resendApiKey` (default `""`), and `resendFromAddress` (default `""`) fields to `gmailSettings` in `db.json`
- [x] 1.2 Update `loadEmailSettings()` (alias of `loadGmailSettings()`) to apply defaults for the three new fields if missing, ensuring backward compatibility with existing Gmail-connected installs
- [x] 1.3 Update `saveEmailSettings()` (alias of `saveGmailSettings()`) to persist the three new fields alongside existing Gmail fields; update `saveToServer()` payload to include them in `db.json`

## 2. Resend API Service Layer (app.js)

- [x] 2.1 Implement `resendSendEmail({ to, subject, bodyHtml, bodyText })` — reads `resendApiKey` and `resendFromAddress` from `loadEmailSettings()`; if either is empty returns `{ success: false, error: "Resend API key not configured." }`; otherwise POSTs to `https://api.resend.com/emails` with `Authorization: Bearer <apiKey>` and body `{ from, to, subject, html: bodyHtml }`; returns `{ success: true, messageId }` on HTTP 2xx or `{ success: false, error }` on failure
- [x] 2.2 Update `sendTransactionalEmail(template, data, toEmail)` to route to `resendSendEmail()` when `emailSettings.provider === "resend"` and to `gmailSendEmail()` when `"gmail"`; log a console warning and return if the active provider is unconfigured

## 3. Admin Settings UI — Email Provider Card (index.html + CSS)

- [x] 3.1 Add an "Email Provider" card to the Admin System Settings panel with a two-button toggle: `Gmail` button (id `email-provider-gmail-btn`) and `Resend` button (id `email-provider-resend-btn`); active button gets `.active` class
- [x] 3.2 Add a Gmail configuration section (id `gmail-config-section`) containing the existing Gmail Client ID input and connect/disconnect controls — visible when Gmail is the active provider
- [x] 3.3 Add a Resend configuration section (id `resend-config-section`) containing: API key input (id `resend-api-key-input`, type password, placeholder `re_…`), from-address input (id `resend-from-address-input`, placeholder `Quantum Yoga <studio@yourdomain.com>`), Save button (id `resend-settings-save-btn`), success/error message span (id `resend-settings-msg`) — hidden when Gmail is the active provider
- [x] 3.4 Add CSS for the provider toggle (`.email-provider-toggle`, `.email-provider-btn`, `.email-provider-btn.active`), the Resend status badge (`.resend-active-badge`), and the Resend warning badge (`.resend-unconfigured-badge`)

## 4. Admin Settings Logic — Email Provider Card (app.js)

- [x] 4.1 Declare DOM variables for all new provider-selector elements: `emailProviderGmailBtn`, `emailProviderResendBtn`, `gmailConfigSection`, `resendConfigSection`, `resendApiKeyInput`, `resendFromAddressInput`, `resendSettingsSaveBtn`, `resendSettingsMsg`
- [x] 4.2 Implement `renderEmailProviderSettings()` — reads active provider from `loadEmailSettings()`, sets `.active` on the correct toggle button, shows/hides `gmailConfigSection` and `resendConfigSection`, pre-populates `resendApiKeyInput` and `resendFromAddressInput` with stored values
- [x] 4.3 Wire `email-provider-gmail-btn` click → set `provider: "gmail"` in settings, call `renderEmailProviderSettings()` and `updateEmailProviderStatusUI()`
- [x] 4.4 Wire `email-provider-resend-btn` click → set `provider: "resend"` in settings, call `renderEmailProviderSettings()` and `updateEmailProviderStatusUI()`
- [x] 4.5 Wire `resend-settings-save-btn` click → validate API key non-empty; if empty show error; otherwise save `resendApiKey` and `resendFromAddress` to settings, show success message for 3 s, call `updateEmailProviderStatusUI()`
- [x] 4.6 Call `renderEmailProviderSettings()` when the Settings sub-tab is activated (inside `setAdminSubTab("settings")`)

## 5. Admin Email Tab — Provider-Agnostic Status Card (index.html + app.js)

- [x] 5.1 Add a Resend status row to the admin Email panel connection card: a `.resend-active-badge` span (id `admin-resend-active-label`) and a `.resend-unconfigured-badge` span (id `admin-resend-unconfigured-label`); both hidden by default
- [x] 5.2 Declare DOM variables for the two new Resend status elements: `adminResendActiveLabel`, `adminResendUnconfiguredLabel`
- [x] 5.3 Refactor `updateGmailStatusUI()` → `updateEmailProviderStatusUI()`: when `provider === "gmail"` keep existing logic; when `provider === "resend"` hide Gmail controls and show the correct Resend badge based on whether `resendApiKey` is set
- [x] 5.4 Update all call sites of `updateGmailStatusUI()` in `app.js` to call `updateEmailProviderStatusUI()` instead
- [x] 5.5 When Resend is the active provider, render an informational notice inside `adminInboxEmailList`: "Inbox is not available with the Resend provider (send-only). Switch to Gmail in Settings to view inbox."

## 6. Admin Compose Form — Provider-Aware Send (app.js)

- [x] 6.1 Update the admin compose form submit handler to route through `sendTransactionalEmail()` (or call the correct send function directly) when Resend is the active provider, using `resendFromAddress` as the sender; keep existing Gmail path unchanged
- [x] 6.2 Update the "Gmail not connected" error message in the compose submit handler to be provider-aware: if `provider === "resend"` and `resendApiKey` is empty, show "Resend API key not configured. Go to Settings to add it."

## 7. Polish & Integration

- [x] 7.1 Verify end-to-end Resend send: set provider to Resend, enter a valid API key and from address, compose an email, confirm `resendSendEmail()` is called and returns success
- [x] 7.2 Verify backward compatibility: with provider set to Gmail and an existing Gmail connection, all existing transactional triggers still route to `gmailSendEmail()`
- [x] 7.3 Verify provider persists across page reload: set provider to Resend, reload, confirm Resend is still selected and the API key is pre-populated in the settings form
