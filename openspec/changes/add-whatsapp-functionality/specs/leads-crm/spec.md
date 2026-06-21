# Lead Management & CRM Delta Spec

## ADDED Requirements

### Requirement: CRM WhatsApp Quick Action
The system SHALL display a WhatsApp chat button on lead cards within the Kanban swimlane board and inside the Lead details modal to allow administrators to directly interact with prospects.

#### Scenario: Admin starts chat from Kanban card
- **WHEN** an admin clicks the WhatsApp icon on a lead card in the CRM swimlane board
- **THEN** the system SHALL launch the WhatsApp Web interface with the lead's phone number prepopulated with an introductory greeting template
