## ADDED Requirements

### Requirement: Inquiry confirmation email
When a visitor submits the landing-page inquiry form, the system SHALL send a transactional email to the submitter's email address confirming receipt of their inquiry. The email SHALL be sent using the active email provider (Gmail or Resend) via `sendTransactionalEmail("inquiry-received", data, email)`. If no email provider is configured, the send SHALL be silently skipped without affecting form submission or the success message shown to the user.

#### Scenario: Provider configured — email sent on valid inquiry submission
- **WHEN** a visitor submits the inquiry form with a valid name, email, phone, and message
- **THEN** the lead is saved to the leads list
- **THEN** `sendTransactionalEmail("inquiry-received", { name, message }, email)` is called with the submitter's email
- **THEN** the inquiry success message is shown to the visitor regardless of email send outcome

#### Scenario: Provider not configured — submission still succeeds
- **WHEN** a visitor submits the inquiry form and no email provider is configured
- **THEN** the lead is still saved and the success message is still shown
- **THEN** `sendTransactionalEmail` logs a console warning and returns without sending

#### Scenario: Inquiry email body contains studio branding and submitter name
- **WHEN** `buildTransactionalEmailBody("inquiry-received", { name, message })` is called
- **THEN** the returned HTML includes the Quantum Yoga logo/header, a greeting with the submitter's name, and confirmation that their inquiry was received
