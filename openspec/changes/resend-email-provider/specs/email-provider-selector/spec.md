## ADDED Requirements

### Requirement: Provider selector UI
The Admin System Settings panel SHALL include an "Email Provider" card with a two-option toggle (`Gmail` | `Resend`) that persists the selected provider to `emailSettings.provider`. Below the toggle, provider-specific configuration sections SHALL be shown conditionally: selecting Gmail shows the existing Gmail Client ID and connect/disconnect controls; selecting Resend shows the API key input and from-address input with a Save button.

#### Scenario: Default state shows Gmail selected
- **WHEN** admin opens System Settings and no provider has been previously chosen
- **THEN** the Gmail option is selected in the toggle
- **THEN** the Gmail configuration section is visible
- **THEN** the Resend configuration section is hidden

#### Scenario: Switching to Resend shows Resend config
- **WHEN** admin clicks the Resend toggle option
- **THEN** `emailSettings.provider` is set to `"resend"`
- **THEN** the Resend API key and from-address inputs become visible
- **THEN** the Gmail configuration section is hidden

#### Scenario: Switching back to Gmail restores Gmail config
- **WHEN** admin clicks the Gmail toggle option after Resend was selected
- **THEN** `emailSettings.provider` is set to `"gmail"`
- **THEN** the Gmail configuration section is visible again

---

### Requirement: Resend credentials save
The Resend configuration section SHALL include an API Key input (type password, placeholder `re_…`), a From Address input (placeholder `Quantum Yoga <studio@yourdomain.com>`), a Save button, and a success/error message area. Clicking Save SHALL persist both values to `emailSettings` and display a success message.

#### Scenario: Admin saves valid Resend credentials
- **WHEN** admin enters a non-empty API key and from address and clicks Save
- **THEN** `resendApiKey` and `resendFromAddress` are saved to `emailSettings`
- **THEN** a success message "Resend settings saved ✓" appears for 3 seconds

#### Scenario: Save is blocked when API key is empty
- **WHEN** admin clicks Save with an empty API key field
- **THEN** the save operation is prevented
- **THEN** an error message "API key is required" is shown

---

### Requirement: Active provider status on Email tab
The Admin Email Inbox panel's connection-status card SHALL display the currently active provider (`Gmail` or `Resend`) and its configuration state. When Resend is the active provider, the Gmail-specific connect/disconnect/refresh controls SHALL be hidden. When Resend is active and configured, the status SHALL show "Resend Active ✓" with the configured from-address. When Resend is active but unconfigured, it SHALL show "Resend: API key not set".

#### Scenario: Email tab shows Gmail status when Gmail is active
- **WHEN** `emailSettings.provider === "gmail"` and admin opens the Email tab
- **THEN** the Gmail connection card is shown (connect/disconnect/refresh buttons)
- **THEN** the Resend status indicator is hidden

#### Scenario: Email tab shows Resend status when Resend is active
- **WHEN** `emailSettings.provider === "resend"` and admin opens the Email tab
- **THEN** the Resend status indicator shows "Resend Active ✓" and the configured from-address
- **THEN** the Gmail connect/disconnect controls are hidden
- **THEN** the inbox list shows a notice "Inbox not available with Resend provider (send-only)"

#### Scenario: Resend active but unconfigured
- **WHEN** `emailSettings.provider === "resend"` but `resendApiKey` is empty
- **THEN** the status shows "Resend: API key not configured" in a warning style
