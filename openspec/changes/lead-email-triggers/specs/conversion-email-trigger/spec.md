## ADDED Requirements

### Requirement: Lead conversion welcome email
When an admin converts a lead into a member account, the system SHALL send a transactional welcome email to the new member's email address. The email SHALL include their temporary password and a prompt to log in and change it immediately. The email SHALL be sent via `sendTransactionalEmail("lead-converted", { name, tempPassword }, email)`. If no email provider is configured, the send SHALL be silently skipped without affecting the conversion flow or the success notification shown in the modal.

#### Scenario: Provider configured — welcome email sent on conversion
- **WHEN** admin clicks "Convert to Member" for a lead that has not yet been converted
- **THEN** the new user account is created with `mustChangePassword: true`
- **THEN** `sendTransactionalEmail("lead-converted", { name: lead.name, tempPassword: generatedPassword }, lead.email)` is called
- **THEN** the conversion success message (including the generated password) is shown in the modal regardless of email send outcome

#### Scenario: Provider not configured — conversion still succeeds
- **WHEN** admin converts a lead and no email provider is configured
- **THEN** the user account is still created and the modal still shows the generated password
- **THEN** `sendTransactionalEmail` logs a console warning and returns without sending

#### Scenario: Conversion email body contains credentials and login prompt
- **WHEN** `buildTransactionalEmailBody("lead-converted", { name, tempPassword })` is called
- **THEN** the returned HTML includes: the Quantum Yoga header, a welcome greeting with the member's name, their temporary password displayed clearly, a strong prompt to change the password on first login, and a call-to-action to visit the studio website

#### Scenario: Already-converted lead does not trigger email
- **WHEN** the convert button is hidden (lead status is already "Converted")
- **THEN** the click handler does not fire and no email is sent
