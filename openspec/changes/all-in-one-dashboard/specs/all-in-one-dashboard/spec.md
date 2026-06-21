## ADDED Requirements

### Requirement: Administrative Overview Dashboard Landing
The system SHALL provide a central overview dashboard inside the Admin Panel that serves as the default landing view.

#### Scenario: Admin accesses overview dashboard
- **WHEN** the admin user navigates to the Admin Panel
- **THEN** the system SHALL load and display the "Overview Dashboard" sub-tab and its associated statistics widgets by default.

### Requirement: Real-time Studio Performance KPIs
The system SHALL calculate and render real-time summary widgets showing key metrics representing the studio's health.

#### Scenario: Admin reviews studio statistics
- **WHEN** the admin views the Overview Dashboard
- **THEN** the system SHALL query local storage databases (users, batches, appointments, payments) and output numerical counters for total active members, monthly studio revenue, scheduled sessions today, and unpaid dues.

### Requirement: Dynamic Studio Insights Recommendations
The system SHALL generate and display business insights based on current cohort, schedule, or financial logs.

#### Scenario: Dashboard flags overdue payments reminder prompt
- **WHEN** there are unpaid invoices that have passed their due dates in the database
- **THEN** the system SHALL generate an insight card suggesting the administrator send payment reminders to the affected users.

### Requirement: Consolidated Operational Timelines
The system SHALL aggregate and display chronological feeds of upcoming class timetables and recent payment records.

#### Scenario: Admin checks studio schedules and billing logs
- **WHEN** the admin checks the dashboard feeds
- **THEN** the system SHALL query, sort, and display a list of all upcoming member appointments and a list of recently updated subscription invoice actions.
