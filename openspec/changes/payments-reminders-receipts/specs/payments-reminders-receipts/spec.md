## ADDED Requirements

### Requirement: Student Billing Ledger
The system SHALL display the student's personal invoice ledger inside their Profile dashboard, showing invoice description, amount, due date, status (Paid, Pending, Overdue), and receipt actions.

#### Scenario: Student checks billing status
- **WHEN** the student is logged in and switches to the "Billing" tab in their profile
- **THEN** the system SHALL render a table of their personal invoices loaded from LocalStorage.

### Requirement: Overdue Invoice Dashboard Alert
Upon student login or dashboard load, if the student has any invoice marked as "Overdue", the system SHALL render a high-visibility warning banner at the top of the dashboard.

#### Scenario: Logged-in user has an outstanding balance
- **WHEN** a student with an overdue invoice of $50.00 logs in to the dashboard
- **THEN** the system SHALL display a persistent top banner saying "Action Required: You have an outstanding overdue payment of $50.00."

### Requirement: Mockup Receipt View
The system SHALL allow students and administrators to open and print a detailed receipt overlay for any invoice marked as "Paid".

#### Scenario: User requests invoice receipt
- **WHEN** the user clicks "Download Receipt" on a paid invoice in the billing list
- **THEN** the system SHALL open a modal dialog displaying a print-ready receipt mockup showing the transaction reference, date, user details, amount paid, and studio stamp.

### Requirement: Admin Studio Financial Console
The system SHALL provide administrators with a centralized billing panel to list all invoices, record client payments, send due reminders, and issue new manual invoices.

#### Scenario: Admin records payment for a pending invoice
- **WHEN** the administrator inspects the dashboard, clicks "Record Payment" on a pending $50.00 invoice for user "default_tester@quantumyoga.com"
- **THEN** the system SHALL update the status to "Paid", save the transaction timestamp, and generate a downloadable receipt for the student.

#### Scenario: Admin triggers a manual payment reminder
- **WHEN** the administrator clicks "Send Reminder" for a pending or overdue invoice
- **THEN** the system SHALL log the reminder date on the invoice and display a confirmation message indicating that a notification alert has been sent.
