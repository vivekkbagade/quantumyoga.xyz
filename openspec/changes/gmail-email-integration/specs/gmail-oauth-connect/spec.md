## ADDED Requirements

### Requirement: Admin can connect a Gmail account via OAuth2
The system SHALL allow an admin to connect their studio Gmail account by entering a Google OAuth2 Client ID and initiating the Google Identity Services consent flow. Upon successful authorization, the access token, token expiry timestamp, and connected email address SHALL be stored in `db.json.gmailSettings`. The Gmail integration features (Email tab in admin and student views) SHALL become visible only after a valid token is stored.

#### Scenario: Admin connects Gmail successfully
- **WHEN** admin navigates to System Settings and enters a valid Google OAuth2 Client ID, then clicks "Connect Gmail Account"
- **THEN** the Google Identity Services consent popup appears, and upon granting consent, the system stores the access token in `db.json.gmailSettings` and displays the connected email address with a green "Connected" badge

#### Scenario: Admin disconnects Gmail
- **WHEN** admin clicks "Disconnect Gmail" in System Settings
- **THEN** the system clears `db.json.gmailSettings` (token, expiry, connectedEmail), hides the Email tabs from both admin and student panels, and displays a "Not Connected" status

#### Scenario: Access token is expired on app load
- **WHEN** the app loads and `db.json.gmailSettings.tokenExpiry` is in the past
- **THEN** the system displays a "Gmail session expired – Reconnect" banner in the Email tab and marks the connection as invalid; no API calls are made until the admin re-authorizes

#### Scenario: Admin saves Client ID without connecting
- **WHEN** admin saves a Client ID but has not yet clicked "Connect Gmail Account"
- **THEN** the system persists the Client ID in `db.json.gmailSettings.clientId` but does NOT show the Email tab yet; a "Not Connected" status is shown

### Requirement: Gmail settings persist across sessions
The system SHALL persist `gmailSettings` (clientId, connectedEmail, accessToken, tokenExpiry) in `db.json` so that admin does not need to reconnect on every page load, provided the access token has not expired.

#### Scenario: Page reload with valid token
- **WHEN** admin reloads the page within 1 hour of connecting Gmail
- **THEN** the Email tab is shown immediately without requiring re-authorization, using the cached access token
