## ADDED Requirements

### Requirement: Admin Account Seeding
The system SHALL check LocalStorage on startup and automatically seed a default administrator account if it does not already exist.
- Email: `admin@quantumyoga.com`
- Password: `adminpass`
- Name: `Administrator`

#### Scenario: First-time application load
- **WHEN** the user opens the application for the first time
- **THEN** the system SHALL create the default administrator user entry inside the LocalStorage database.

### Requirement: Admin Header Navigation Visibility
The system SHALL show the "Admin Panel" navigation link and tab pill only when the logged-in user is the seeded administrator (`admin@quantumyoga.com`).
- For regular users or guests, these navigation controls MUST remain hidden.

#### Scenario: Admin logging in
- **WHEN** the user logs in as `admin@quantumyoga.com` with `adminpass`
- **THEN** the system SHALL display the "Admin Panel" nav link in the header and the "Admin Panel" tab pill in the SPA layout.

#### Scenario: Non-admin logging in
- **WHEN** the user logs in with a regular client account
- **THEN** the system SHALL NOT display the "Admin Panel" navigation links.

### Requirement: Admin Panel Main View
The system SHALL render a dedicated Admin dashboard when the "Admin Panel" tab is active. The Admin dashboard SHALL contain sub-tabs to switch between "User Management" and "Reports & Analytics".

#### Scenario: Selecting Admin Panel tab
- **WHEN** the logged-in admin clicks the "Admin Panel" nav link or tab pill
- **THEN** the system SHALL display the `#admin-section` container and activate the User Management sub-panel by default.

### Requirement: User Management oversight
The system SHALL display a tabular list of all registered user accounts (except the active admin user themselves) with administrative actions.
- Action "View Profile": SHALL display a modal detail overlay rendering the selected user's name, email, favorited poses list, and completed routines list.
- Action "Delete": SHALL remove the selected user from the LocalStorage database and refresh the table view.

#### Scenario: Inspecting regular user profile
- **WHEN** the administrator clicks the "View Profile" button on a user row
- **THEN** the system SHALL open a read-only modal showing that user's specific stats, favorites, and completions.

#### Scenario: Deleting regular user
- **WHEN** the administrator clicks the "Delete" button on a user row and confirms the deletion
- **THEN** the system SHALL delete the user record from LocalStorage and refresh the user management table.

### Requirement: Reports & Analytics Generation
The system SHALL compile and display aggregate analytics metrics and a unified completion log across all registered users.
- Aggregate metrics cards: Total Users, Total Completions, Most Completed Routine, and Most Favorited Pose.
- Engagement log: A chronological table listing all completions (User Name, Routine Name, Timestamp).

#### Scenario: Viewing analytics dashboard
- **WHEN** the administrator clicks the "Reports & Analytics" sub-tab in the Admin Panel
- **THEN** the system SHALL calculate the aggregate statistics from all user objects in LocalStorage and populate the metrics cards and completions history table.
