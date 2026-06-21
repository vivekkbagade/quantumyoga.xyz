## Context

When converting a lead to a member account in the Admin Panel Leads Kanban board, the system assigns a static default password ("welcome123") to the newly registered user. The user request asks to generate a unique random password for each converted member to make account access secure.

## Goals / Non-Goals

**Goals:**
- Replace the static password with a generated 8-character random alphanumeric password during lead conversion.
- Display the generated password clearly in the inspect modal's success notification.
- Save the generated password to the lead history logs for future reference.

**Non-Goals:**
- Setting up automated email delivery of credentials.
- Implementing cryptographic hashing for stored plain-text passwords (the application uses mock plain-text passwords in `db.json`/LocalStorage).

## Decisions

### 1. Password Generation Utility
- **Decision**: Define a helper function `generateRandomPassword(length = 8)` in `app.js` that selects random characters from an alphanumeric alphabet string (`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`).
- **Rationale**: Minimalist, requires no dependencies, and provides sufficient randomness for mock client access.

### 2. Success Message UI Formatting
- **Decision**: Change `inspectLeadSuccessMsg.textContent` to `inspectLeadSuccessMsg.innerHTML` inside the conversion event listener to display the generated password wrapped in a styled `<code>` block.
- **Rationale**: Enables the administrator to copy the password easily from the UI.
- **Alternatives considered**: Using `alert()`. Rejected because standard alerts are disruptive and detract from the premium dashboard experience.

### 3. Lead Log Audit Trail
- **Decision**: Prepend the generated password directly to the lead conversion log note: `"Lead converted to registered user account successfully. Temporary Password: [password]"`.
- **Rationale**: Ensures the administrator can retrieve the password if they close the inspect modal before copying it.

## Risks / Trade-offs

- **[Risk]** The success message text resets after 3 seconds, meaning the admin could lose the password if they don't look at it in time.
- **Mitigation**: Storing the credentials inside the lead's logs history solves this, as logs are persistent and display permanently in the Inspect modal timeline.
