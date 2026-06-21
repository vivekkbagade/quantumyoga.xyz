## ADDED Requirements

### Requirement: Forgot Password Modal Display
The system SHALL provide a "Forgot Password" link on the login screen that opens a dedicated modal containing an email input field and submit button.

#### Scenario: Open forgot password modal
- **WHEN** the guest visitor clicks the "Forgot Password" link on the auth screen
- **THEN** the system SHALL display the forgot password modal.

### Requirement: Self-Service Temporary Password Generation
The system SHALL generate an 8-character random temporary password and update the user record in persistent storage when a valid registered email address is submitted.

#### Scenario: Successful temporary password reset
- **WHEN** the user submits a valid registered email address in the forgot password form
- **THEN** the system SHALL generate a random 8-character temporary password, update the corresponding user account password, save the consolidated database to the server, and display the new temporary password within the modal's success feedback message.

#### Scenario: Password reset request for unregistered email
- **WHEN** the user submits an email address that is not found in the users database
- **THEN** the system SHALL display an error message stating that the email address is not registered and make no modifications to any data.
