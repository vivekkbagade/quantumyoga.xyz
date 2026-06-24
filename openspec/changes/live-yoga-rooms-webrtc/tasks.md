Created At: 2026-06-24T20:34:53Z
Completed At: 2026-06-24T20:34:56Z
File Path: `file:///D:/QuantumYogaWebsite/openspec/changes/live-yoga-rooms-webrtc/tasks.md`

## 1. Frontend Interface & Script Setup

- [x] 1.1 Include the Jitsi Meet IFrame API external script in `index.html`
- [x] 1.2 Add the "Live Class" navigation tab link in the top navigation panel of `index.html`
- [x] 1.3 Create `#live-class-section` content panel containing `#live-class-room-container` inside `index.html`

## 2. WebRTC Client Integration

- [x] 2.1 Map selectors and set up tab navigation router logic in `app.js` to initialize WebRTC when active
- [x] 2.2 Write instantiation code in `app.js` using `JitsiMeetExternalAPI` to mount the interactive video room
- [x] 2.3 Write cleanup and teardown logic to dispose of the active Jitsi IFrame room on tab switch (to stop camera/microphone feed)

## 3. Scheduling & Room Linking

- [x] 3.1 Implement active room calculation based on user's current timetabled batch ID
- [x] 3.2 Display a glowing "Join Live Room" CTA button next to active schedule entries in the profile dashboard
- [x] 3.3 Add click event listeners to join the active streaming session from the dashboard timetable
