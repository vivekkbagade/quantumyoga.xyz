## ADDED Requirements

### Requirement: Theme Customization Controls
The system SHALL display a visual theme selector dropdown (Midnight Aura, Ethereal Light, Zen Sunset) inside the user's Profile tab panel for logged-in users.

#### Scenario: Navigating to Profile to change theme
- **WHEN** the user switches to the "Profile" tab
- **THEN** the system SHALL render a dropdown selector populated with the available theme options.

### Requirement: Active Theme Swapping
When the user selects an alternative theme from the selector, the system SHALL dynamically update the CSS variables on the root document element and persist the selection inside the user's data object in LocalStorage.

#### Scenario: Swapping to Ethereal Light theme
- **WHEN** the user selects "Ethereal Light" from the dropdown list
- **THEN** the system SHALL add the `theme-light` class to the HTML/body element and update the color variable mapping.

### Requirement: Session Theme Initialization
Upon successful user login or page refresh with an active session, the system SHALL read the user's saved theme option from LocalStorage and automatically apply the corresponding CSS variables on page load.
- If no selection is found (e.g. guest or new user), the system SHALL default to Midnight Aura.

#### Scenario: Application startup with Ethereal Light selection
- **WHEN** the user starts the application with a saved session whose theme preference is "Ethereal Light"
- **THEN** the system SHALL immediately apply the Ethereal Light styles on startup.
