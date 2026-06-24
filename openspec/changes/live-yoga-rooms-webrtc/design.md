## Context

Currently, the Quantum Yoga platform manages scheduling and asynchronous guided video routines, but does not support live video sessions. This design introduces interactive virtual rooms inside the platform dashboard using the Jitsi Meet IFrame API. This integrates low-latency video streaming without adding high-cost WebRTC infrastructure.

## Goals / Non-Goals

**Goals:**
*   Implement a virtual WebRTC video classroom directly inside a glassmorphic dashboard pane (`#live-class-section`).
*   Allow administrators (instructors) to spin up and control active video streams.
*   Allow students to join active classes directly from their assigned timetables.
*   Ensure full responsiveness across desktop and mobile screens.

**Non-Goals:**
*   Hosting custom WebRTC media servers (like Kurento, Janus, or Mediasoup) on the studio server.
*   Recording or archiving live streams.
*   Private 1-on-1 calls.

## Decisions

### 1. WebRTC Provider Selection
*   **Decision:** Jitsi Meet IFrame API over daily.co or a custom WebRTC server.
*   **Rationale:** Jitsi Meet is fully open-source and free to embed. The `external_api.js` library allows full control over room events, participant layouts, and audio/video settings directly from our frontend client. This avoids hosting costly and complex TURN/STUN or SFU/MCU video servers.
*   **Alternative Considered:** Daily.co (requires account creation and API limits) or custom WebSocket WebRTC signaling (too complex to scale for multi-user classrooms).

### 2. Frontend Embedding
*   **Decision:** Load the Jitsi API script dynamically or declare it in `index.html`, and instantiate `JitsiMeetExternalAPI` on an empty container (`#live-class-room-container`) inside the new chat/live section.
*   **Rationale:** Dynamic instantiation inside a container allows us to mount and unmount the iframe room cleanly when switching tabs to prevent background audio leaks.

### 3. Timetable Sync
*   **Decision:** When a timetable slot is active, calculate the Jitsi room name dynamically based on the batch ID (e.g., `qy-room-vinyasa-mornings`) and display a "Join Class" button on the client dashboard.
*   **Rationale:** Avoids storing active meeting URLs in the database, keeping scheduling state fully automatic and calculated from current time.

## Risks / Trade-offs

*   **Risk:** Jitsi public server (`meet.jit.si`) capacity or rate limits.
    *   *Mitigation:* Jitsi Meet allows using custom instances or low-cost Jitsi-as-a-Service (JaaS) domains. We will define the domain as a variable so it can be pointed to a dedicated server easily.
*   **Risk:** Camera/mic permissions blocking.
    *   *Mitigation:* Check for browser capability (`navigator.mediaDevices.getUserMedia`) and display clean instructions if permissions are denied.
