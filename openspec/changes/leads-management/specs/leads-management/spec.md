## ADDED Requirements

### Requirement: Public Inquiry Form
The system SHALL display an inquiry capture form on the landing gate for prospective students to submit contact information and messages.

#### Scenario: Successful inquiry submission
- **WHEN** a guest user fills in name "Sarah Lead", email "sarah@inquiry.com", phone "123-456-7890", message "Interested in Zen Sunset theme routines", and clicks "Submit Inquiry"
- **THEN** the system SHALL save the submission, display a success confirmation message, and clear the inquiry form inputs.

### Requirement: Admin Leads Pipeline Table
The system SHALL provide an administrative leads dashboard sub-panel listing all submitted inquiries, displaying email, date, and current pipeline status.

#### Scenario: Listing leads in the dashboard
- **WHEN** the administrator logs in and opens the "Leads Management" sub-tab in the Admin Console
- **THEN** the system SHALL render a table listing all leads dynamically loaded from LocalStorage.

### Requirement: Pipeline Status and Follow-up Notes
The system SHALL allow administrators to update a lead's pipeline status (New, Contacted, Converted, Closed) and append dated follow-up logs.

#### Scenario: Logging a follow-up conversation
- **WHEN** the administrator opens the lead inspection panel, changes status to "Contacted", writes a follow-up note "Sent Ethereal Light details", and clicks "Save Follow-up"
- **THEN** the system SHALL persist the updated status and prepend the follow-up note with a timestamp to the lead's log history.

### Requirement: Lead Account Conversion
The system SHALL provide a button to convert a lead into a registered member, auto-creating a standard user account with pre-filled details.

#### Scenario: Auto-registering a converted user
- **WHEN** the administrator inspects a lead with email "sarah@inquiry.com" and clicks "Convert to Member"
- **THEN** the system SHALL register "Sarah Lead" as a standard user in the users database with password "welcome123", update the lead's pipeline status to "Converted", and refresh the tables.
