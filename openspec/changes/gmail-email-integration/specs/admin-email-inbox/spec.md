## ADDED Requirements

### Requirement: Admin can view inbox email list
The system SHALL provide an "Email" sub-tab in the Admin panel that displays a list of emails (both sent and received) associated with the connected Gmail account. Each list item SHALL show: sender/recipient name or email, subject line, snippet (first ~100 chars of body), timestamp, and an unread indicator dot. The list SHALL be sorted by timestamp descending (newest first). A manual "Refresh Inbox" button SHALL trigger a fresh fetch from the Gmail API and update the `db.json.emails` cache.

#### Scenario: Admin opens Email tab with connected account
- **WHEN** admin clicks the "Email" sub-tab and a valid Gmail token exists
- **THEN** the system displays the cached email list from `db.json.emails` immediately, then triggers a background refresh from the Gmail API and updates the list

#### Scenario: No emails cached
- **WHEN** admin opens the Email tab for the first time (empty cache)
- **THEN** the system shows a loading state while fetching from Gmail API, then renders the inbox list or an empty state message if no emails exist

#### Scenario: Admin clicks a message to open it
- **WHEN** admin clicks on an email list item
- **THEN** the system fetches the full message body from Gmail API, displays it in a side panel or modal, marks it as read in `db.json`, and removes the unread indicator

### Requirement: Admin can compose and send an email
The system SHALL provide a "Compose" button in the Email tab that opens a compose modal. The modal SHALL include: To (student email picker from the users list), Subject, and Body (textarea, plain text). On send, the system SHALL call the Gmail API to send the email, save the message metadata to `db.json.emails`, and close the modal.

#### Scenario: Admin sends an email to a student
- **WHEN** admin clicks "Compose", selects a student email, enters subject and body, and clicks "Send"
- **THEN** the system sends the email via Gmail API, adds the sent email record to `db.json.emails` with `direction: "sent"`, shows a success toast, and the compose modal closes

#### Scenario: Gmail API send fails
- **WHEN** sending fails due to network error or expired token
- **THEN** the system displays an error toast "Failed to send email. Please check your Gmail connection." and keeps the compose modal open with the drafted content

#### Scenario: Admin replies to a received email
- **WHEN** admin opens a received email and clicks "Reply"
- **THEN** a pre-filled compose modal opens with the subject prefixed with "Re: " and the "To" field set to the sender's address; on send, the reply is threaded via Gmail API

### Requirement: Unread email count badge on admin Email tab
The system SHALL display a numeric badge on the "Email" admin sub-tab button showing the count of emails in `db.json.emails` where `isRead === false` and `direction === "received"`. The badge SHALL update in real-time as emails are read.

#### Scenario: Admin has unread emails
- **WHEN** the Email tab is not active and `db.json.emails` contains unread received emails
- **THEN** the "Email" tab button shows a colored badge with the unread count (e.g., "3")

#### Scenario: All emails read
- **WHEN** all emails have `isRead === true`
- **THEN** no badge is shown on the Email tab button
