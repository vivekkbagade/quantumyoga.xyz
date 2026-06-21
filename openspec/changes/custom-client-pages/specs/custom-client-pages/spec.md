## ADDED Requirements

### Requirement: Personalized Student Dashboard Hub
The system SHALL provide logged-in members with a unified, personalized dashboard within their Profile view, acting as a dedicated client hub.

#### Scenario: Member views their personalized hub
- **WHEN** a logged-in user navigates to the "Profile" section
- **THEN** the system SHALL dynamically load and render their personalized client hub containing upcoming classes, active batch overviews, and billing history in addition to their favorites and routine history.

### Requirement: Upcoming Class Previews
The system SHALL query and show previews of the member's upcoming scheduled classes and private sessions.

#### Scenario: Member reviews upcoming sessions
- **WHEN** a member views their client hub
- **THEN** the system SHALL display a chronological list of their upcoming classes or private sessions, showing the session name, date, time, and instructor.

### Requirement: Batch Overviews
The system SHALL display detailed overview metrics about the member's assigned yoga batch.

#### Scenario: Member checks batch schedule details
- **WHEN** a member views their client hub and inspects the batch card
- **THEN** the system SHALL display their active batch name, schedule timings, instructor name, and current batch capacity.

### Requirement: Unified Billing History
The system SHALL aggregate and display the member's billing, invoice history, and payment status.

#### Scenario: Member views invoice list and receipts
- **WHEN** a member checks the billing section in their client hub
- **THEN** the system SHALL render a list of invoices showing invoice number, billing period, amount, status (Paid/Pending/Overdue), and a download receipt trigger.
