## ADDED Requirements

### Requirement: Fullscreen Login Gate Visibility
If the user session is unauthenticated, the system SHALL hide the main layout (header, hero, controls, toggle tab pills, content panels, footer) and display ONLY a centered, fullscreen login/registration card.

#### Scenario: Guest opens the website
- **WHEN** the guest user visits the homepage and there is no active session
- **THEN** the system SHALL display only the fullscreen login/registration card and hide all other dashboard page elements.

### Requirement: Fullscreen Authentication Controls
The fullscreen authentication card SHALL allow users to toggle between Login and Registration forms.

#### Scenario: Toggling authentication forms
- **WHEN** the guest user clicks on the "Register" tab in the fullscreen gate
- **THEN** the system SHALL hide the login form and reveal the registration form inputs.

### Requirement: Post-Authentication Dashboard Disclosure
Upon successful login or registration, the system SHALL immediately close the authentication gate and render all normal dashboard content.

#### Scenario: Successful guest login
- **WHEN** the guest user inputs valid credentials and submits the login form
- **THEN** the system SHALL hide the fullscreen gate, show the navigation header and active pose directory, and greet the logged-in user.

### Requirement: Unauthenticated Redirect on Logout
When the logged-in user clicks "Log Out", the system SHALL clear the active user session and transition back to show ONLY the fullscreen login gate.

#### Scenario: User logging out
- **WHEN** the authenticated user clicks the "Log Out" button in the header
- **THEN** the system SHALL destroy the session, hide all dashboard views, and present only the login/registration card.
