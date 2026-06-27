## Why

Following the removal of the client-side configuration UI for email integrations, the Email tab button in the admin portal is being hidden because the check condition `(es.clientId || (isResend && resendConfigured))` resolves to `false` when local settings are empty. Since email configuration now relies purely on server-side environment variables, the Email tab should always be displayed to the administrator and student profiles.

## What Changes

- Modify `app.js` to ensure `adminEmailTabBtn` (for admin) and `profileEmailTabBtn` (for students) are always visible and displayed, rather than conditionally hidden based on client local storage configuration.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `email-communication`: Update tab visibility criteria to ensure the Email tab is permanently visible on both administrator and student dashboards.

## Impact

- **`app.js`**: Remove the conditional display style toggling of the Email tabs.
