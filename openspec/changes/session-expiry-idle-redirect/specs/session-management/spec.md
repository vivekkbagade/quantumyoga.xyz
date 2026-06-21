## ADDED Requirements

### Requirement: Idle Session Expiration
The system SHALL automatically expire a user's active session and log them out if they remain inactive (no mouse movement, key press, scroll, click, or touch action) for 15 minutes.

#### Scenario: Idle timeout triggers automatic logout
- **WHEN** the user is logged in and performs no interactions for 15 minutes
- **THEN** the system SHALL delete the active session token from local storage, clear the URL hash, redirect them to the fullscreen auth gate, and show a notification alert that the session has expired due to inactivity.

#### Scenario: User activity resets the idle timer
- **WHEN** the user is logged in and performs any interaction (such as mouse move, click, keydown, scroll, or touchstart) before the 15-minute idle limit is reached
- **THEN** the system SHALL reset the idle timer countdown.

### Requirement: Protected Route Direct Access Guard
The system SHALL prevent direct access to protected views (such as the admin panel or user profile dashboard) if the visitor does not have an active authenticated session.

#### Scenario: Direct page access without active session redirects to login
- **WHEN** a visitor navigates directly to a URL with a protected hash (such as `#admin-section` or `#profile-section`) and there is no active session stored in `localStorage`
- **THEN** the system SHALL redirect the user to the fullscreen auth gate, display the login form, and clear the protected hash from the URL.

### Requirement: Redirect on Explicit Logout
The system SHALL redirect the user and clear the URL hash upon explicit logout.

#### Scenario: Logout clears state and redirects
- **WHEN** a logged-in user clicks the logout button
- **THEN** the system SHALL delete the session token from local storage, clear the URL hash, and display the fullscreen auth gate.
