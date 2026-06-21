## ADDED Requirements

### Requirement: Kanban Swimlane Board Visualisation
The system SHALL display the inquiry leads pipeline inside the Admin Console as a Kanban board containing four distinct columns: `New`, `Contacted`, `Converted`, and `Closed`, replacing the flat tabular format.

#### Scenario: Admin opens leads pipeline
- **WHEN** the administrator logs in and clicks on the "Leads Pipeline" panel tab
- **THEN** the system SHALL render four columns representing pipeline status stages side-by-side, sorting active leads chronologically by date descending within each column.

### Requirement: Interactive Lead Cards
The system SHALL render each lead as a visual card within its designated status swimlane column, displaying the lead's name, email, phone number, formatted inquiry date, and message excerpt.

#### Scenario: Admin views lead details on card
- **WHEN** the leads pipeline board loads
- **THEN** the system SHALL show cards displaying prospective client name, contact details, DD-MM-YYYY formatted date, and a snippet of their query.

### Requirement: Status Transition Actions
The system SHALL provide interactive controls on each lead card to allow moving the lead to adjacent swimlane columns, updating the lead's status in LocalStorage and dynamically refreshing the UI.

#### Scenario: Admin shifts lead status
- **WHEN** the administrator clicks the status transition control on a lead card to update its status from "New" to "Contacted"
- **THEN** the system SHALL persist the status change in LocalStorage and immediately move the card to the "Contacted" swimlane column without page reload.

### Requirement: Lead Details Overlay Integration
The system SHALL display the detailed inquiry logs and inspection actions inside the Lead Inspection Modal when a lead card is clicked.

#### Scenario: Admin inspects lead card
- **WHEN** the administrator clicks on a lead card's inspect action or body area
- **THEN** the system SHALL open the Lead Inspection Modal pre-populated with the lead's logs, message, and conversion options.
