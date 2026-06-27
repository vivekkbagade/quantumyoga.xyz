## MODIFIED Requirements

### Requirement: Student Inbox Message Filtering
The student-side portal SHALL list all messages where the recipient (`to` field) matches the logged-in student's email address, regardless of whether the database record is flagged as sent or received.

#### Scenario: Display Incoming Admin Correspondence in Student Portal
- **WHEN** a student logs into their portal and visits the Email section
- **THEN** the system SHALL display all email records addressed to them, including emails sent by the studio administrator
