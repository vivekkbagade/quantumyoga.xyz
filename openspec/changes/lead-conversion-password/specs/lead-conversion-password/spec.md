## ADDED Requirements

### Requirement: Random Password Generation on Conversion
When converting a lead to a member account, the system SHALL dynamically generate a secure random password (containing 8 alphanumeric characters) rather than using a static default value.

#### Scenario: Lead conversion generates secure password
- **WHEN** an administrator clicks "Convert to Member" for a lead
- **THEN** the system SHALL generate a unique random password, assign it to the new user account, and save the record in the users database

### Requirement: Display Generated Password to Administrator
The system SHALL display the newly generated password to the administrator inside the success notification toast/message upon successful lead conversion.

#### Scenario: Display password in success modal notification
- **WHEN** the conversion process succeeds
- **THEN** the system SHALL display a success notification detailing the generated password (e.g., "Generated Password: XXXXXXXX")

### Requirement: Audit Log Recording of Generated Credentials
The system SHALL append the generated password details into the lead history logs for future reference.

#### Scenario: Log entries have generated password details
- **WHEN** a lead is successfully converted
- **THEN** the system SHALL write a log message to the lead log history specifying that the account was created and include the generated password
