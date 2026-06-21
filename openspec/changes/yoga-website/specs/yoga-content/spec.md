## ADDED Requirements

### Requirement: Yoga Pose Directory
The system SHALL display a directory of yoga poses featuring structural details, descriptions, benefits, step-by-step execution guides, and difficulty levels.

#### Scenario: Filtering Poses by Difficulty
- **WHEN** the user selects "Intermediate" from the difficulty filter dropdown
- **THEN** the system SHALL update the displayed list to show only poses labeled as "Intermediate"

#### Scenario: Filtering Poses by Category
- **WHEN** the user selects "Vinyasa" from the category filter dropdown
- **THEN** the system SHALL update the displayed list to show only poses labeled as "Vinyasa"

#### Scenario: Searching for Poses
- **WHEN** the user types "Warrior" in the search input field
- **THEN** the system SHALL display poses that contain "Warrior" in their name or description

### Requirement: Yoga Routines
The system SHALL present structured yoga routines containing sequence info, estimated durations, and step-by-step guides.

#### Scenario: Selecting a Guided Routine
- **WHEN** the user clicks on a specific routine (e.g., "Morning Energizing Flow")
- **THEN** the system SHALL display the routine details, estimated duration, sequence of poses, and button to begin the flow
