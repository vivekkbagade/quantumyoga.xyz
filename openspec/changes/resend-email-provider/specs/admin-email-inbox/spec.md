## MODIFIED Requirements

### Requirement: Admin email inbox status card
The admin Email tab's connection/status card SHALL display the active email provider (Gmail or Resend) rather than always showing Gmail-specific controls. When `emailSettings.provider === "gmail"`, behaviour is identical to before this change. When `emailSettings.provider === "resend"`, the Gmail-specific elements (connect button, disconnect button, refresh button, connected-email label) SHALL be hidden and replaced with a Resend status row.

#### Scenario: Gmail provider — connected state
- **WHEN** `provider === "gmail"` and `isGmailConnected()` returns true
- **THEN** the connected label, connected email address, disconnect button, and refresh button are shown
- **THEN** the connect button is hidden

#### Scenario: Gmail provider — disconnected state
- **WHEN** `provider === "gmail"` and `isGmailConnected()` returns false
- **THEN** the connect button is shown
- **THEN** the connected label, disconnect button, and refresh button are hidden

#### Scenario: Resend provider — configured
- **WHEN** `provider === "resend"` and `resendApiKey` is non-empty
- **THEN** a "Resend Active ✓" badge is shown with the configured from-address
- **THEN** Gmail controls (connect, disconnect, refresh) are hidden
- **THEN** the inbox list displays an informational notice that inbox is unavailable with Resend

#### Scenario: Resend provider — unconfigured
- **WHEN** `provider === "resend"` and `resendApiKey` is empty
- **THEN** a warning badge "Resend: API key not configured — go to Settings" is shown
- **THEN** Gmail controls are hidden
