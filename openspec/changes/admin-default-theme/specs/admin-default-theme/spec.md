## ADDED Requirements

### Requirement: Admin Dashboard Default Theme Customization Control
The system SHALL display a visual theme selector dropdown (Midnight Aura, Ethereal Light, Zen Sunset) inside the admin dashboard panel for authenticated administrators.

#### Scenario: Admin views the dashboard to manage system defaults
- **WHEN** the user is logged in as the administrator and views the Admin Dashboard
- **THEN** the system SHALL render a dropdown selector labeled "System Default Theme" populated with the visual theme options.

### Requirement: System Default Theme Storage Persistence
When the administrator selects an alternative theme from the system default theme selector, the system SHALL save this setting persistently inside LocalStorage under the key `qy_site_default_theme`.

#### Scenario: Admin updates the system default theme
- **WHEN** the administrator selects "Zen Sunset" from the default theme dropdown
- **THEN** the system SHALL save the value "sunset" to LocalStorage under the key `qy_site_default_theme`.

### Requirement: Guest Theme Initialization using System Default
Upon page load or logout, the system SHALL check for the admin-configured default theme in LocalStorage under the key `qy_site_default_theme` and apply it immediately. If no setting is found, the system SHALL default to Midnight Aura.

#### Scenario: Guest user lands on website with light default configuration
- **WHEN** a guest user loads the landing page and the value of `qy_site_default_theme` in LocalStorage is "light"
- **THEN** the system SHALL immediately apply the Ethereal Light styles by adding the `theme-light` class to the root HTML element.

### Requirement: User Preference Fallback to System Default
Upon user registration or user login, if the user profile does not contain a custom overriding theme choice, the system SHALL fall back to and apply the current admin-configured default theme.

#### Scenario: Registering a new user with an active system default theme
- **WHEN** a new user account is registered and the current admin default theme is set to "sunset"
- **THEN** the system SHALL apply the Zen Sunset visual theme on startup while preserving their choice to customize it later.
