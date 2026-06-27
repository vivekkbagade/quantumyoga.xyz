## Context

When administrators send emails to students (using the Resend API provider), the emails are logged in the unified database (`db.json`) under the `emails` array with `direction: 'sent'` (from the admin outbox perspective). The student inbox tab utilizes `renderStudentInbox()` in `app.js` to view their incoming messages, but its filtering logic is restricted to messages marked as incoming (`folder: 'inbox'` or `direction: 'received'`). Consequently, emails sent directly from the admin to the student are omitted from the student's view.

## Goals / Non-Goals

**Goals:**
- Update `renderStudentInbox` in `app.js` to filter emails based on the recipient's address (`e.to`) rather than the folder/direction metadata.

**Non-Goals:**
- Modifying how the database logs email entries.
- Creating secondary inbox tabs for students.

## Decisions

- **Recipient-based filtering**: Modify the `emails.filter` block inside `renderStudentInbox()` to match any email where the `to` field contains the logged-in student's email address. Since all emails sent *to* the student are by definition incoming messages for that student, this accurately retrieves their entire correspondence history.

## Risks / Trade-offs

- **[Risk]**: If emails are sent to multiple students or in CC/BCC, the filter must check correctly.
  - *Mitigation*: The `includes(userEmail.toLowerCase())` query resolves this by finding the student's email anywhere inside the recipient string.
