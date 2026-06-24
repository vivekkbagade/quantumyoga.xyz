## Why

Currently, students can view static yoga postures, follow guided routines, and discuss wellness in the community chat, but there is no way to participate in live virtual streaming sessions directly on the platform. Adding integrated virtual classrooms enables students to join interactive live stream rooms hosted by instructors without leaving their premium glassmorphic dashboard, increasing engagement and community bonding.

## What Changes

*   **Live Stream Container**: Integrate a WebRTC-based live streaming viewport directly inside the dashboard structure.
*   **Instructor Room controls**: Provide administrators/instructors with the ability to launch interactive video rooms.
*   **Student Stream Viewport**: Allow students to join the classroom video feed as viewing participants.
*   **Navigation Integration**: Add a dedicated "Live Class" portal linked to the active weekly timetables.

## Capabilities

### New Capabilities
- `live-yoga-rooms`: Virtual classroom streaming portal that overlays a WebRTC interactive live feed (via Jitsi Meet IFrame API integration) directly on the student and instructor dashboards.

### Modified Capabilities
- `class-scheduling`: Update active schedules to support launching/joining active video links for live timetabled classes.

## Impact

*   **Frontend UI (`index.html`, `app.js`, `index.css`)**: New navigation portal (`#nav-live-class`), streaming viewport container (`#live-class-section`), and interactive overlay components.
*   **Backend Server (`server.js`)**: Extend database state to track room status (active, offline) and session credentials.
*   **Dependencies**: Integrate Jitsi Meet IFrame API library (`https://8x8.vc/external_api.js` or standard Jitsi Meet client script) on the frontend.
