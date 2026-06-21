## ADDED Requirements

### Requirement: Admin Batch Management
The system SHALL provide administrative controls within the Admin Panel to create, list, and delete named student batches.

#### Scenario: Creating a student batch
- **WHEN** the administrator enters "Sunrise Flow Batch" in the batch creation input and clicks "Create Batch"
- **THEN** the system SHALL save the batch, clear the input, and display the new batch in the list of active batches.

### Requirement: Admin Class Scheduling Timetable
The system SHALL allow administrators to schedule class sessions for any created batch by selecting a weekday, a start time, and a designated yoga routine.

#### Scenario: Adding a class session to a batch
- **WHEN** the administrator selects the batch "Sunrise Flow Batch", day "Monday", time "07:30", routine "Morning Sun Salutation", and clicks "Schedule Class"
- **THEN** the system SHALL add the session to the batch's weekly timetable.

### Requirement: User Batch Enrollment
The system SHALL enable administrators to enroll any registered user into a created batch, or remove them from a batch.

#### Scenario: Enrolling a user in a batch
- **WHEN** the administrator inspects a user profile from the user table, selects "Sunrise Flow Batch" from the enrollment dropdown, and clicks "Save Enrollment"
- **THEN** the system SHALL associate the user with the batch and save the assignment to LocalStorage.

### Requirement: Student Timetable and Next Class Countdown
The system SHALL display the active student's batch name, weekly timetable, and a real-time countdown clock showing the time remaining until their next scheduled class session in their Profile view.

#### Scenario: Student views their schedule
- **WHEN** an authenticated user enrolled in "Sunrise Flow Batch" clicks on their "Profile" tab
- **THEN** the system SHALL display the text "Sunrise Flow Batch", render the weekly class list, and display the countdown to their next upcoming class.
