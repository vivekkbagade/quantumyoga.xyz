## ADDED Requirements

### Requirement: Persist session based on Remember Me checkbox
The login form SHALL feature a "Remember Me" checkbox. The system SHALL store the active session token in `localStorage` if the checkbox is checked upon login, and in `sessionStorage` if it is unchecked.

#### Scenario: Login with Remember Me checked
- **WHEN** the user checks the "Remember Me" checkbox and logs in successfully
- **THEN** the system SHALL save the session token in `localStorage` under `qy_session` and clear `sessionStorage`.

#### Scenario: Login with Remember Me unchecked
- **WHEN** the user leaves the "Remember Me" checkbox unchecked and logs in successfully
- **THEN** the system SHALL save the session token in `sessionStorage` under `qy_session` and clear `localStorage`.

### Requirement: Active Session Initialization Check
On startup, the system SHALL verify if there is an active session token in either `localStorage` or `sessionStorage` and restore the user's logged-in session accordingly.

#### Scenario: Startup with active session in localStorage
- **WHEN** the page is loaded and `localStorage` contains a valid session token
- **THEN** the system SHALL automatically restore the logged-in session.

#### Scenario: Startup with active session in sessionStorage
- **WHEN** the page is loaded and `sessionStorage` contains a valid session token
- **THEN** the system SHALL automatically restore the logged-in session.

#### Scenario: Startup with no session token
- **WHEN** the page is loaded and no session token exists in either `localStorage` or `sessionStorage`
- **THEN** the system SHALL display the fullscreen auth gate.
