## ADDED Requirements

### Requirement: Student Profile Membership Info View
The system SHALL display the authenticated user's membership tier (Basic, Premium, Unlimited VIP), status (Active, Paused, Expired), and expiration date in their Profile view.

#### Scenario: Student views profile membership details
- **WHEN** the student is logged in and navigates to the Profile tab
- **THEN** the system SHALL display their membership tier, status, and expiration details in a stylized card.

### Requirement: Student Health and Goals Customization
The system SHALL provide text fields inside the student Profile view to enter, save, and update personal yoga goals and health/injury logs.

#### Scenario: Student updates personal yoga goals
- **WHEN** the student writes "Increase core strength and hamstring flexibility" in the goals textarea and clicks "Save Personal Details"
- **THEN** the system SHALL save the text in LocalStorage under the user's details and show a success confirmation message.

### Requirement: Admin Membership Editor
The system SHALL provide fields in the admin user inspection modal to modify a user's membership tier, status, expiration date, and add coaching notes.

#### Scenario: Administrator modifies user membership level
- **WHEN** the administrator inspects the user "john@example.com", selects membership tier "Unlimited VIP", status "Active", sets expiration date to "2027-06-30", writes a note "Referred by trainer", and clicks "Save Membership Settings"
- **THEN** the system SHALL update the user's membership parameters in LocalStorage, updating their profile instantly.
