## ADDED Requirements

### Requirement: Real-time Message Broadcasting
The system SHALL broadcast any user-sent chat messages in real time to all currently connected clients using WebSockets.

#### Scenario: Send message to chat
- **WHEN** an authenticated user sends a message in the chat input
- **THEN** the system broadcasts a JSON message containing the sender's name, role (Student or Admin), message body, and timestamp to all active sockets

### Requirement: Message History Retention
The system SHALL store the last 50 chat messages in the database and transmit this history to newly connected clients.

#### Scenario: Join chat room
- **WHEN** a client successfully establishes a WebSocket connection to the chat room
- **THEN** the system SHALL immediately send the last 50 stored chat messages to populate the client's message feed

### Requirement: Active User List
The system SHALL track and display the list of currently active (connected) users in the chat room.

#### Scenario: User online status updates
- **WHEN** a user opens or closes the chat tab (connecting or disconnecting from the socket)
- **THEN** the system SHALL broadcast an updated list of online user names to all connected clients
