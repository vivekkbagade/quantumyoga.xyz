## ADDED Requirements

### Requirement: Interactive Live Class Room Viewport
The system SHALL display an interactive video streaming frame directly in the client dashboard using a low-latency WebRTC IFrame overlay.

#### Scenario: User joins active live streaming room
- **WHEN** a logged-in student visits the "Live Class" tab and the instructor is actively broadcasting
- **THEN** the system overlays the live video session player inside the dashboard frame

### Requirement: Instructor Broadcast Panel
The system SHALL provide administrators/instructors with room controls to launch a new streaming session.

#### Scenario: Instructor starts streaming
- **WHEN** an administrator logs in, clicks the "Live Class" tab, and clicks "Launch Streaming Session"
- **THEN** the system initializes the WebRTC media container and grants broadcast access to camera/microphone
