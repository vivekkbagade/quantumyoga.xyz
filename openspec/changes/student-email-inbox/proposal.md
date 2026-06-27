## Why

Currently, when administrators send transactional or manual emails to students, these emails are stored in the database with `direction: 'sent'` and `folder: 'sent'`. Because the student inbox rendering logic restricts visible emails to those marked with `folder: 'inbox'` or `direction: 'received'`, students are unable to see any emails sent to them by the admin, resulting in a blank student inbox.

## What Changes

- Refactor the student inbox filter in `app.js` (`renderStudentInbox`) to display all emails addressed to the logged-in student, regardless of the folder/direction flag.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `email-communication`: Update the student inbox filter criteria to correctly display all messages where the student's email is the recipient.

## Impact

- **`app.js`**: Refactor `renderStudentInbox` filter criteria.
