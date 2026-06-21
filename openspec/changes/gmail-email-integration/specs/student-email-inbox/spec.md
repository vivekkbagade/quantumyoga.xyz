## ADDED Requirements

### Requirement: Student can view emails from the studio
The system SHALL provide an "Email" sub-tab in the student's Profile panel that displays a list of emails sent to that student's registered email address. The list SHALL be filtered from `db.json.emails` by `studentEmail === currentUser.email`. Each item SHALL show: subject, snippet, timestamp, and an unread indicator. The Email sub-tab SHALL only be visible to logged-in students when a Gmail connection is active (`db.json.gmailSettings.accessToken` is valid).

#### Scenario: Student opens Email tab
- **WHEN** a logged-in student clicks the "Email" tab in their Profile section
- **THEN** the system displays all emails in `db.json.emails` where `studentEmail` matches the student's registered email, sorted by timestamp descending

#### Scenario: No emails for student
- **WHEN** the student has no emails in `db.json.emails` matching their email
- **THEN** the system displays an empty state: "No messages from the studio yet."

#### Scenario: Student opens a specific email
- **WHEN** student clicks on an email list item
- **THEN** the system displays the full email body (fetched from Gmail API or from stored body if cached), marks the email as read in `db.json`, and removes the unread indicator

### Requirement: Student can reply to a studio email
The system SHALL allow a student to reply to an email received from the studio. Clicking "Reply" on an opened email SHALL open a compose panel pre-filled with the original subject (prefixed "Re: "). On submission, the system SHALL send the reply via the admin's connected Gmail account (from the studio email, with the reply-to set to the student's email for reference), and save the outgoing record to `db.json.emails`.

#### Scenario: Student sends a reply
- **WHEN** student opens an email, clicks "Reply", writes a response, and clicks "Send"
- **THEN** the system sends the reply via the admin's Gmail API connection, adds a record to `db.json.emails` with `direction: "sent"` and `studentEmail` set to the student's email, and shows a success message "Reply sent!"

#### Scenario: Student tries to reply without active Gmail connection
- **WHEN** the Gmail access token is expired or not set, and the student clicks "Reply"
- **THEN** the system displays an error: "Email service is currently unavailable. Please contact the admin."

### Requirement: Unread email count badge on student Email tab
The system SHALL display a numeric badge on the student "Email" profile sub-tab button showing the count of emails where `isRead === false` and `studentEmail === currentUser.email`.

#### Scenario: Student has unread emails
- **WHEN** student is logged in and has unread emails from the studio
- **THEN** the "Email" profile sub-tab button shows a badge with the unread count

#### Scenario: Student reads all emails
- **WHEN** student opens all unread emails
- **THEN** the badge disappears from the Email tab button
