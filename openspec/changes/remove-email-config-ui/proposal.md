## Why

Currently, the application allows administrators to configure the Resend API key and choose between email providers (Gmail and Resend) directly from the client settings panel. This introduces a security risk by storing sensitive API keys in the client's local storage and complicates administration when server environment variables are already configured with the correct Resend credentials. Removing this UI simplifies administration and improves security.

## What Changes

- Remove the **Email Provider** settings card (Gmail and Resend settings fields) from the Admin Settings tab.
- Update client-side checking so that email features (Email Tab, compose, reply) are considered always active/available (falling back directly to server environment variables if local configuration is empty).
- Update client email compose handlers to send empty `apiKey` and `from` fields, letting the server default to the environment configuration.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `admin-email-inbox`: Update configuration behavior to assume the Resend provider is always active and configured using server environment variables rather than client-entered local storage settings.

## Impact

- **`index.html`**: Removal of the Email Provider settings card inside the settings section.
- **`app.js`**: Update visibility and check helpers (`resendConfigured` set to `true`) and disable settings save listeners.
- **`admin-emails.html`**: Update client compose and reply handlers to pass empty strings as Resend settings, triggering server-side environment variables fallback.
