## 1. Project Setup & Google Cloud Configuration

- [x] 1.1 Document steps to create a Google Cloud project, enable Gmail API, and set up an OAuth2 Client ID (Web Application type) with `http://localhost:5173` as authorized origin
- [x] 1.2 Add Google Identity Services CDN script tag to `index.html` (`accounts.google.com/gsi/client`)
- [x] 1.3 Add `emails` array and `gmailSettings` object schema to `db.json` (with empty defaults: `{ "emails": [], "gmailSettings": { "clientId": "", "connectedEmail": "", "accessToken": "", "tokenExpiry": 0 } }`)

## 2. Gmail OAuth2 Connect Module (app.js)

- [x] 2.1 Implement `initGmailClient()` function that loads GIS `tokenClient` with `gmail.modify` scope using the stored `clientId` from `db.json.gmailSettings`
- [x] 2.2 Implement `connectGmail()` function that calls `tokenClient.requestAccessToken()`, handles the callback, saves token + expiry to `db.json.gmailSettings`, and updates UI connection status
- [x] 2.3 Implement `disconnectGmail()` function that clears `db.json.gmailSettings` (token, expiry, connectedEmail) and hides Email tabs
- [x] 2.4 Implement `isGmailConnected()` helper that checks if a valid (non-expired) access token exists in `db.json.gmailSettings`
- [x] 2.5 Implement `getGmailAccessToken()` function that returns the current token or attempts silent re-auth; displays "Reconnect Gmail" banner if token is expired

## 3. Gmail API Service Layer (app.js)

- [x] 3.1 Implement `gmailFetchInbox(maxResults = 20)` — calls `GET /gmail/v1/users/me/messages?maxResults=N`, then fetches metadata (headers: From, To, Subject, Date) for each message ID, maps to the `db.json.emails` schema, and merges into the local cache
- [x] 3.2 Implement `gmailGetMessageBody(messageId)` — calls `GET /gmail/v1/users/me/messages/{id}?format=full`, decodes base64url body, returns HTML/plain text
- [x] 3.3 Implement `gmailSendEmail(to, subject, body, threadId = null)` — constructs RFC 2822 message, base64url encodes it, calls `POST /gmail/v1/users/me/messages/send`, saves sent record to `db.json.emails`
- [x] 3.4 Implement `gmailMarkAsRead(messageId)` — calls `POST /gmail/v1/users/me/messages/{id}/modify` with `removeLabelIds: ["UNREAD"]` and updates `isRead` in `db.json.emails`
- [x] 3.5 Add `refreshEmailCache()` orchestrator that calls `gmailFetchInbox()`, updates `db.json.emails`, and re-renders the email list UI

## 4. Admin System Settings – Gmail Connection Card (index.html + app.js)

- [x] 4.1 Add a "Gmail Integration" card to the System Settings sub-panel in `index.html` with: Client ID input field, "Connect Gmail Account" button, connection status badge ("Connected ✓" / "Not Connected"), connected email address display, and "Disconnect" button
- [x] 4.2 Wire the "Save Client ID" action to persist `clientId` to `db.json.gmailSettings` via `saveData()`
- [x] 4.3 Wire "Connect Gmail Account" button to call `connectGmail()`
- [x] 4.4 Wire "Disconnect" button to call `disconnectGmail()`
- [x] 4.5 On admin panel load, call `isGmailConnected()` and render the correct connection status in the Gmail settings card
- [x] 4.6 Pre-populate the Client ID input field from `db.json.gmailSettings.clientId` on settings panel open

## 5. Admin Email Tab UI (index.html)

- [x] 5.1 Add "Email" button to the admin sub-tabs bar (`admin-sub-tabs`) with ID `admin-email-tab-btn` and an unread count badge span
- [x] 5.2 Add admin email panel content div `admin-email-panel` with a two-column layout: left = compose + sent, right = inbox
- [x] 5.3 Build the inbox with search, filter buttons, and scrollable list container
- [x] 5.4 Build the email preview overlay: subject header, from/date fields, full body area, and "Reply" button
- [x] 5.5 Build the compose form: To field, Subject input, Template dropdown, Body textarea, Send button
- [x] 5.6 Add CSS styles for: email list item cards (with unread indicator dot), preview overlay, connection status badge, filter buttons, loading spinner

## 6. Admin Email Tab Logic (app.js)

- [x] 6.1 Implement `renderAdminInbox()` — reads `db.json.emails`, renders all received emails sorted by timestamp descending; shows empty state with context-aware messages
- [x] 6.2 Implement `openAdminEmailPreview(emailId)` — fetches full message body via `gmailGetMessageBody()`, renders in preview overlay, calls `gmailMarkAsRead()` and updates badge
- [x] 6.3 Wire "Refresh" button to call `refreshEmailCache()` then `renderAdminEmailTab()`
- [x] 6.4 Wire "Compose" button (template dropdown) to auto-fill subject
- [x] 6.5 Wire compose form "Send" button to call `gmailSendEmail()`, reset form, and refresh sent list
- [x] 6.6 Wire "Reply" button in preview overlay to pre-fill compose form with "Re: " subject and sender address
- [x] 6.7 Implement `updateAdminUnreadBadge()`: count unread received emails, update badge on `admin-email-tab-btn`
- [x] 6.8 On admin Email tab activation, call `renderAdminEmailTab()` which checks connection and renders inbox
- [x] 6.9 Show/hide Email tab button based on `clientId` presence; show/hide student tab based on `isGmailConnected()`

## 7. Student Email Tab UI (index.html)

- [x] 7.1 Add "Email" button to the student profile sub-tabs (`profile-sub-tabs`) with ID `profile-email-tab-btn`
- [x] 7.2 Add student email panel content div `profile-email-panel` with two-column layout
- [x] 7.3 Build student inbox list container with expandable inline detail view on click
- [x] 7.4 Build student compose form: Subject input, Body textarea, Send button
- [x] 7.5 Inline email detail expand on item click (toggle behavior)
- [x] 7.6 CSS reuses all admin email styles (`.email-list-item`, `.email-unread-dot`, etc.)

## 8. Student Email Tab Logic (app.js)

- [x] 8.1 Implement `renderStudentInbox()` — filters `db.json.emails` by `to` field matching current user email
- [x] 8.2 Inline detail expansion loads full body via `gmailGetMessageBody()` on click
- [x] 8.3 Click-to-expand toggles inline detail panel
- [x] 8.4 Wire student compose "Send Message" button to call `gmailSendEmail()` addressed to admin's connected email
- [x] 8.5 Handle Gmail-not-connected case: show informational empty state with disabled compose form
- [x] 8.6 Implement `updateStudentUnreadBadge()`: count unread emails addressed to current user
- [x] 8.7 On student Email tab activation, call `renderStudentEmailTab()`
- [x] 8.8 Show/hide student Email tab based on `isGmailConnected()` — checked on `updateGmailStatusUI()` call

## 9. Transactional Email Triggers (app.js)

- [x] 9.1 Add transactional email send call to the "Issue Manual Invoice" form submission handler
- [x] 9.2 Add transactional email send call to the appointment booking confirmation flow
- [x] 9.3 Add transactional email send call to the appointment cancellation flow — send cancellation email when appointment status changes to "Cancelled"
- [x] 9.4 Add transactional email send call to the batch enrollment flow — send enrollment email when admin assigns `batchId` to a student in User Management
- [x] 9.5 Implement `buildTransactionalEmailBody(type, data)` — returns HTML email body string for each trigger type with Quantum Yoga branding

## 10. Polish & Integration

- [x] 10.1 Email tabs are hidden on app init if `isGmailConnected()` returns false, and shown dynamically after connect
- [x] 10.2 Add "Email" option to admin sub-tab keyboard navigation and accessibility (aria-selected, role="tab")
- [x] 10.3 Loading spinners added to email list and detail view during API fetch operations
- [x] 10.4 Test the full flow: connect Gmail → compose email to student → student sees it in their Email tab → student replies → admin sees reply in inbox
- [x] 10.5 Test all transactional triggers: invoice, appointment confirm, appointment cancel, batch enrollment
- [x] 10.6 All new UI elements use existing CSS design tokens (glassmorphic styles, `--accent-primary`, `--glass-medium-bg`, etc.)
