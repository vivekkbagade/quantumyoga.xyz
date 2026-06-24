## ADDED Requirements

### Requirement: Interactive Live Class Room Viewport
The system SHALL display an interactive video streaming frame directly in the client dashboard using a low-latency WebRTC IFrame overlay.

#### Scenario: User joins active live streaming room
- **WHEN** a logged-in student visits the "Live Class" tab and the instructor is actively broadcasting
- **THEN** the system overlays the live video session player inside the dashboard frame

### Requirement: Instructor Broadcast Panel
The system SHALL provide administrators/instructors with room controls to launch a new streaming session.

#### Scenario: Instructor starts streaming
- **WHEN** an administrator logs in, clicks the "Live Class" tab, and clicks "Launch Live Video Session"
- **THEN** the system prompts for a room name, initializes the WebRTC media container, grants broadcast access to camera/microphone, and saves the active room name to the server database.

#### Scenario: Instructor ends streaming
- **WHEN** an administrator clicks "End Live Video Session"
- **THEN** the system disposes of the active WebRTC instance and clears the active room name from the server database, terminating connection access for students.

### Requirement: Real-Time Active Room Synchronization
The system SHALL synchronize the active manually started WebRTC room name from the server to students' local clients in real-time.

#### Scenario: Student dashboard displays active stream join button
- **WHEN** the instructor launches a live session
- **THEN** the student's dashboard countdown container periodically checks the database state and shows a "🔴 Live Session Active!" banner with a glowing "🎥 Join Live Room Now" action button.
