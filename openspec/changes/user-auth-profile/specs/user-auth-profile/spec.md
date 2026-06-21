## ADDED Requirements

### Requirement: User Authentication Forms
The system SHALL provide a modal view containing login and registration forms for users to authenticate.
- **Registration**: Accepts name, email, and password. It SHALL save credentials in LocalStorage.
- **Login**: Authenticates email and password against stored LocalStorage data. It SHALL set active user session state.
- **Logout**: Clears the active session state.

#### Scenario: Registering a New Account
- **WHEN** the user inputs a name, email, and password in the registration form and clicks "Register"
- **THEN** the system SHALL create the user account in LocalStorage, log them in automatically, and close the modal.

#### Scenario: Successful Login
- **WHEN** the user inputs correct credentials in the login form and clicks "Log In"
- **THEN** the system SHALL initialize an active session and update the header navigation to display "Log Out".

### Requirement: Navigation Header Profile Integration
The system SHALL display the authenticated user's name in the header navigation, along with a "Profile" tab to switch views to the user dashboard. If the user is unauthenticated, a "Log In" button SHALL be displayed.

#### Scenario: Displaying Header for Authenticated User
- **WHEN** there is an active logged-in user session
- **THEN** the system SHALL display the user's name and a "Profile" nav-link in the header.

### Requirement: Personal Profile View
The system SHALL display a personal Profile panel when the "Profile" tab is active. The Profile view SHALL contain:
- User details (name, email).
- Routine history (a list of completed routines with timestamps).
- Favorited Poses list.

#### Scenario: Viewing Profile Dashboard
- **WHEN** the user clicks on the "Profile" tab
- **THEN** the system SHALL render the user's profile info, routine completions count, and custom favorites list.

### Requirement: Interactive Pose Favoriting
The system SHALL display a "Favorite" button (e.g., a heart icon) on every pose card. Clicking the button SHALL toggle the pose's favorited state for the authenticated user and sync it with LocalStorage.

#### Scenario: Toggling Pose Favorite
- **WHEN** an authenticated user clicks the heart icon on a pose card
- **THEN** the system SHALL toggle the favorite state and update the list of favorited poses in the profile.
