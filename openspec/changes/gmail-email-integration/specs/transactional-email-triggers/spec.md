## ADDED Requirements

### Requirement: System sends email on invoice creation
The system SHALL automatically send an email notification to the student when an admin creates and issues a new invoice. The email SHALL include: invoice ID, description, amount (in INR), and due date. The email SHALL be sent via the connected Gmail account, and a record SHALL be added to `db.json.emails` with `type: "transactional"` and `triggerEvent: "invoice_issued"`.

#### Scenario: Admin creates an invoice with Gmail connected
- **WHEN** admin submits the "Issue Manual Invoice" form and a valid Gmail token exists
- **THEN** the system creates the invoice in `db.json.invoices`, sends an email to the student with invoice details, and adds the email record to `db.json.emails`

#### Scenario: Admin creates an invoice without Gmail connected
- **WHEN** admin submits the invoice form and no valid Gmail token exists
- **THEN** the system creates the invoice normally and shows a warning toast: "Invoice created. Email notification skipped – Gmail not connected."

### Requirement: System sends email on appointment confirmation
The system SHALL automatically send an email to the student when an appointment is booked or confirmed (status changed to "Confirmed"). The email SHALL include: appointment date, time slot, yoga routine name, and fee amount.

#### Scenario: Appointment booked with Gmail connected
- **WHEN** admin books a new appointment or updates status to "Confirmed" and Gmail is connected
- **THEN** the system sends a confirmation email to the student's registered email and saves the record to `db.json.emails` with `triggerEvent: "appointment_confirmed"`

#### Scenario: Appointment cancelled with Gmail connected
- **WHEN** admin cancels an appointment (status changed to "Cancelled") and Gmail is connected
- **THEN** the system sends a cancellation email to the student and saves the record with `triggerEvent: "appointment_cancelled"`

### Requirement: System sends email on batch enrollment
The system SHALL automatically send an email to a student when the admin assigns them to a batch (sets `batchId` on the user record). The email SHALL include: batch name, instructor name, timetable schedule, and session fee.

#### Scenario: Admin assigns student to a batch with Gmail connected
- **WHEN** admin assigns a student to a batch via the User Management panel and Gmail is connected
- **THEN** the system sends a batch enrollment email to the student and saves the record to `db.json.emails` with `triggerEvent: "batch_enrolled"`

#### Scenario: Admin assigns batch without Gmail connected
- **WHEN** admin assigns a batch and no valid Gmail token exists
- **THEN** the batch assignment proceeds normally and a warning toast: "Batch assigned. Email notification skipped – Gmail not connected." is shown

### Requirement: Transactional emails are visible in both admin and student Email inboxes
All transactional emails (invoice, appointment, batch) saved to `db.json.emails` SHALL appear in:
- The admin's Email tab (in the sent emails view)
- The student's Email tab (filtered by their email address)

#### Scenario: Transactional email appears in student inbox
- **WHEN** a transactional email is sent to a student
- **THEN** the email record is immediately visible in the student's Email tab list with `type: "transactional"` label/badge
