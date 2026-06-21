## ADDED Requirements

### Requirement: Indian Mobile Phone Number Validation
The system SHALL validate and accept only valid Indian mobile phone numbers in the contact inquiry forms. A valid Indian mobile number starts with an optional "+91" or "0", followed by a digit from 6 to 9, and exactly 9 more digits. Optional spaces and hyphens SHALL be allowed in the input and stripped for validation.

#### Scenario: Valid phone number submission
- **WHEN** the user submits the inquiry form with a valid number like "9876543210", "+91 98765-43210", or "09876543210"
- **THEN** the system SHALL successfully validate the phone number

#### Scenario: Invalid phone number submission
- **WHEN** the user submits the inquiry form with an invalid number like "555-0199", "1234567890", or "98765"
- **THEN** the system SHALL reject the submission and show a validation alert specifying that a valid 10-digit Indian mobile number is required

### Requirement: Uniform Phone Number Display Format
The system SHALL format all displayed and stored phone numbers into a standard `+91 XXXXX XXXXX` format (e.g. `+91 98765 43210`).

#### Scenario: Formatting input for storage
- **WHEN** a valid number "+919876543210" or "09876543210" is submitted via the inquiry form
- **THEN** the system SHALL format it to "+91 98765 43210" and save it in the LocalStorage leads list

#### Scenario: Displaying formatted numbers in Admin Panels
- **WHEN** the administrator opens the Leads Swimlane board or the Lead Inspection modal
- **THEN** the system SHALL display the lead's phone number formatted as "+91 XXXXX XXXXX"
