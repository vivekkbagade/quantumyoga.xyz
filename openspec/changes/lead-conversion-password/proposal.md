## Why

Currently, when converting a lead into a member account, the system sets a static default password ("welcome123"). This represents a security vulnerability and lacks user specificity. Generating a random, high-entropy password for each converted member, presenting it directly to the administrator, and recording it in the lead history logs ensures security and provides a robust workflow for administrators to share credentials with new members.

## What Changes

- **Random Password Generation**: Replace the static default password with a dynamically generated random string (8-10 characters, mixed case and numbers) when a lead is converted.
- **Visual Credential Presentation**: Update the conversion success message in the Lead Inspection modal to display the newly generated password to the administrator.
- **Credential Log Archival**: Include the generated password in the lead's history log record so that it can be retrieved by an administrator if needed.

## Capabilities

### New Capabilities
- `lead-conversion-password`: Generates secure random credentials for converted leads, logs them in the lead history, and renders them in the conversion success UI.

### Modified Capabilities
<!-- None -->

## Impact

- **app.js**: Implement a random password generator function, modify the lead conversion event listener, update the success status message element, and log the generated password to the lead's log comments.
