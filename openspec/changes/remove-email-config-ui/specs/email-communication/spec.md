## MODIFIED Requirements

### Requirement: Client Email Authorization Configuration Check
The client-side application SHALL consider the Resend email service provider to be active and configured by default, enabling all compose, reply, and inbox tabs.

#### Scenario: Verify Email Capability Activation
- **WHEN** the dashboard application starts up
- **THEN** the system SHALL show the Email tabs for both admin and student profiles as available

## REMOVED Requirements

### Requirement: Client-side Email Provider Settings UI
**Reason**: Storing sensitive API keys and Client IDs in browser local storage poses security risks. Setting configurations at the server environment level is more secure.
**Migration**: Remove settings fields for Gmail Client ID, Resend API Key, and From Address. Fall back entirely to server environment configuration.
