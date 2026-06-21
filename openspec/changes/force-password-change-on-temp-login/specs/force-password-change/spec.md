## ADDED Requirements

### Requirement: Mandatory Password Change Gate
The system SHALL intercept user login or session restoration if the user account has `mustChangePassword` set to `true`, presenting a fullscreen "Force Change Password" screen and blocking all other application views.

#### Scenario: First login redirect to Change Password screen
- **WHEN** a user logs in (or their page loads with an active session) and their user object has `mustChangePassword` set to `true`
- **THEN** the system SHALL display the fullscreen "Force Change Password" overlay, disable background scrolling, hide the dashboard, and block access to the rest of the application.

### Requirement: Password Update Enforcement
The system SHALL require the user to input a new password (minimum 6 characters), update their password in the database, set `mustChangePassword` to `false`, commit changes to the server, and load their dashboard.

#### Scenario: Successful password change
- **WHEN** the user submits a new password of at least 6 characters in the change password form
- **THEN** the system SHALL update the password, set `mustChangePassword` to `false` in their user profile, save updates to the server via `saveToServer()`, hide the change password screen, and load the student dashboard view.

#### Scenario: Password change attempt with short password
- **WHEN** the user attempts to submit a new password that is shorter than 6 characters
- **THEN** the system SHALL display a validation error message "Password must be at least 6 characters" and prevent form submission.
