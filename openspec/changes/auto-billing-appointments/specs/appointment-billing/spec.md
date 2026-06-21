## ADDED Requirements

### Requirement: Automated Private Coaching Invoicing
The system SHALL automatically generate a pending billing invoice for a student when a private coaching appointment is booked.

#### Scenario: Student books a private coaching session
- **WHEN** a logged-in student submits the private coaching appointment booking form
- **THEN** the system SHALL automatically create a new pending invoice of ₹1500 with a description "Private coaching class fee" and due date equal to the selected appointment date
- **AND** the system SHALL add this invoice to the student's list of payments in LocalStorage
- **AND** the system SHALL render the new invoice on the student's billing dashboard

#### Scenario: Administrator books a private coaching session for a student
- **WHEN** the administrator submits the appointment booking form for a selected student
- **THEN** the system SHALL automatically create a new pending invoice of ₹1500 with a description "Private coaching class fee" and due date equal to the selected appointment date
- **AND** the system SHALL add this invoice to the student's list of payments in LocalStorage
- **AND** the system SHALL update the admin dashboard billing KPIs immediately
