## ADDED Requirements

### Requirement: Profile Integration in Chat
The system SHALL retrieve and display the authenticated user's name and role (Student or Admin) from their profile when they send messages or appear online in the chat room.

#### Scenario: Display profile name in sent messages
- **WHEN** a logged-in user sends a message to the chat room
- **THEN** the system SHALL attach their authenticated profile name and membership role to the message payload before broadcasting it
