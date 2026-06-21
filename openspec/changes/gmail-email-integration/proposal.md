## Why

Quantum Yoga studio currently has no in-app communication channel between the admin and students. Critical communications — such as payment receipts, appointment confirmations, batch enrollment notices, and personalized announcements — must be handled outside the app, breaking the studio management workflow. Integrating Gmail (via the Gmail API / OAuth2) gives the studio a first-class, authenticated email channel so that transactional emails can be sent and received directly from the dashboard for both admin and students.

## What Changes

- **New "Email" tab in the Admin panel**: Admins can compose, send, and read emails to/from students via a connected Gmail account. Supports inbox view, compose modal, and conversation threads.
- **New "Email" tab in the Student Profile section**: Students can view emails received from the studio and reply to them from within the app.
- **Gmail OAuth2 connection flow**: Admin can connect their studio Gmail account via OAuth2 (Google Sign-In consent screen). Access tokens are persisted in `db.json` / localStorage.
- **Email data model in `db.json`**: A new `emails` array stored locally mirrors sent/received email metadata (sender, recipient, subject, body snippet, timestamp, read status, thread ID).
- **Transactional email triggers**: System events (invoice issued, appointment booked/cancelled, batch enrollment) automatically compose and send notification emails via the connected Gmail account.
- **Email notification badge**: Unread email counts appear on the tab badge for both student and admin.

## Capabilities

### New Capabilities

- `gmail-oauth-connect`: Admin can authorize the app with their Gmail account using Google OAuth2, receive and persist access/refresh tokens, and disconnect at any time from System Settings.
- `admin-email-inbox`: Admin email tab showing inbox list of received messages, compose button for new emails to any student, and conversation thread view.
- `student-email-inbox`: Student email tab in Profile showing emails received from the studio admin, with ability to reply within the thread.
- `transactional-email-triggers`: Automated email sending on key system events: invoice created, appointment confirmed/cancelled, batch enrollment confirmation.

### Modified Capabilities

- (none — no existing spec-level behavior changes)

## Impact

- **`index.html`**: Add new "Email" sub-tab buttons in both the Admin panel (`admin-sub-tabs`) and the Student Profile panel (`profile-sub-tabs`), and corresponding panel content sections.
- **`app.js`**: New Gmail API integration module (OAuth flow, token management, send/read email functions); event listeners for transactional triggers; email tab UI rendering logic.
- **`index.css`**: Styles for email inbox list, compose modal, thread view, unread badge, and connection status card.
- **`db.json`**: New `emails` array and `gmailSettings` object (access token, refresh token, connected account).
- **External dependency**: Google Identity Services (`accounts.google.com/gsi/client`) and Gmail REST API (`https://gmail.googleapis.com`). Requires a Google Cloud project with Gmail API enabled and OAuth2 credentials (Client ID).
- **No backend required**: All OAuth and API calls are made from the browser using client-side JavaScript with the Gmail REST API. Refresh tokens are stored in `db.json` (local persistence).
