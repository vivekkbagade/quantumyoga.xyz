## ADDED Requirements

### Requirement: Exclude Header Profile Link
The system SHALL hide the "Profile" navigation link in the application header for the administrator user account (`admin@quantumyoga.com`).

#### Scenario: Admin logs in and header is rendered
- **WHEN** the administrative user logs in successfully
- **THEN** the system SHALL hide the "Profile" tab navigation link in the header actions, while keeping the "Admin Panel" and "Log Out" links visible.

### Requirement: Exclude Student Sub-panels
The system SHALL prevent rendering or displaying client-facing sub-panels (My Practice Log, Wellness Center, Appointments) in any views when the logged-in user is the administrator.

#### Scenario: Admin attempts to navigate to student panels
- **WHEN** the logged-in user is `admin@quantumyoga.com`
- **THEN** the system SHALL hide or disable access to the client-only profile panels and default the admin view strictly to the administrative panels (Overview, Settings, Payments, Leads, Scheduling).

### Requirement: Restrict Student Enrollments and Favorites
The system SHALL NOT allow scheduling appointments, enrolling in batches, or registering favorites for the administrative user account.

#### Scenario: Admin attempts to book an appointment
- **WHEN** the active user is `admin@quantumyoga.com`
- **THEN** the system SHALL restrict the user from executing any booking/enrollment requests and ensure the administrative email address is excluded from client activity logs.
