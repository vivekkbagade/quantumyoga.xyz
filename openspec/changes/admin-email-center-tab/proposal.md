## Why

The administrator wants to have both email views accessible directly within the admin portal: the original simplified inline "Email Inbox" tab (featuring simple quick-compose, sent list, and inbox list with Gmail connection status check) and a brand new "Email Center" tab which hosts the full-featured standalone glassmorphic email client dashboard.

## What Changes

- Restore the original inline Compose Form, Sent Items, and Inbox list UI inside `#admin-email-panel` in `index.html`.
- Add a new admin sub-navigation tab button labeled **✉️ Email Center** and a corresponding panel `#admin-email-center-panel` that hosts the iframe pointing to `admin-emails.html`.
- Add backing state handlers, DOM queries, and click listeners in `app.js` to support both the restored Email Inbox sub-tab and the new Email Center sub-tab.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `email-communication`: Expose two distinct messaging interfaces to the administrator dashboard (Email Inbox for quick communications/status, and Email Center for advanced folder filters/previewing/replies).

## Impact

- **`index.html`**: Restores the inline quick-compose layout in `#admin-email-panel` and adds the new `admin-email-center-panel` iframe tab.
- **`app.js`**: Adds `adminEmailCenterTabBtn` definitions, sub-tab switching triggers, and restores the quick-compose email form click/submit handlers.
