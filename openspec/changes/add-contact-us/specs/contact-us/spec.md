## ADDED Requirements

### Requirement: Studio Contact Details Display
The system SHALL present a public Contact Us modal overlay displaying the studio's physical address, telephone number, and official email ID.

#### Scenario: User views contact details
- **WHEN** a user clicks the "Contact Us" link/button
- **THEN** the system SHALL display the `#contact-us-modal` modal containing the studio's physical address, contact phone number, and support email ID.

#### Scenario: Non-logged-in visitor views contact details
- **WHEN** a visitor who is not logged in clicks the "Contact Us" link/button
- **THEN** the system SHALL display the `#contact-us-modal` overlay directly on the landing page, bypassing any login or registration gates.

### Requirement: Interactive Call/Email Triggers
The system SHALL support interactive protocol links to initiate contact instantly.

#### Scenario: User clicks contact options
- **WHEN** a user clicks the telephone or email ID links inside the contact modal
- **THEN** the system SHALL launch the client's default telephone handler (using `tel:`) or email composer (using `mailto:`).
