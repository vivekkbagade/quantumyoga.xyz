## 1. Frontend Interface & Script Setup

- [ ] 1.1 Include the Jitsi Meet IFrame API external script in `index.html`
- [ ] 1.2 Add the "Live Class" navigation tab link in the top navigation panel of `index.html`
- [ ] 1.3 Create `#live-class-section` content panel containing `#live-class-room-container` inside `index.html`

## 2. WebRTC Client Integration

- [ ] 2.1 Map selectors and set up tab navigation router logic in `app.js` to initialize WebRTC when active
- [ ] 2.2 Write instantiation code in `app.js` using `JitsiMeetExternalAPI` to mount the interactive video room
- [ ] 2.3 Write cleanup and teardown logic to dispose of the active Jitsi IFrame room on tab switch (to stop camera/microphone feed)

## 3. Scheduling & Room Linking

- [ ] 3.1 Implement active room calculation based on user's current timetabled batch ID
- [ ] 3.2 Display a glowing "Join Live Room" CTA button next to active schedule entries in the profile dashboard
- [ ] 3.3 Add click event listeners to join the active streaming session from the dashboard timetable
