# Live Interactive Yoga Rooms (WebRTC)

Quantum Yoga supports virtual classrooms directly inside the glassmorphic dashboard interface. This capability uses the Jitsi Meet IFrame API, providing low-latency WebRTC streams with zero media server overhead.

---

## 🛠️ WebRTC Integration Architecture

The platform embeds Jitsi Meet as a responsive iframe inside the `#live-class-room-container` DOM element. 

### External Script Include
To communicate with Jitsi rooms, the frontend loads the Jitsi external API library:
```html
<script src="https://meet.jit.si/external_api.js" defer></script>
```

### Instantiation
Jitsi is instantiated dynamically inside `app.js` using `JitsiMeetExternalAPI`:
```javascript
const domain = "meet.jit.si";
const options = {
  roomName: roomName,
  width: "100%",
  height: "100%",
  parentNode: container,
  userInfo: {
    displayName: state.currentUser ? state.currentUser.name : "Yoga Practitioner"
  },
  interfaceConfigOverwrite: {
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand'
    ]
  },
  configOverwrite: {
    startWithAudioMuted: !isInstructor,
    startWithVideoMuted: !isInstructor,
    prejoinPageEnabled: false
  }
};
jitsiApiInstance = new JitsiMeetExternalAPI(domain, options);
```

---

## 🔄 Lifecycle & Resource Management

WebRTC sessions require active camera and microphone hardware permissions. If a user switches to another tab (e.g. Routines, Poses, or Chat) while inside a live class, the platform **must** immediately release these hardware resources to preserve privacy and reduce battery overhead.

1. **Instantiation**: Loaded when the user enters the `Live Class` tab or clicks the timetable/active room shortcut.
2. **Teardown**: When the active tab shifts away from `#live-class-section`, the client calls `disposeLiveClassRoom()`:
   ```javascript
   if (jitsiApiInstance) {
     jitsiApiInstance.dispose();
     jitsiApiInstance = null;
   }
   ```
   This terminates the iframe connection and completely stops camera/microphone hardware usage.

---

## ⏱️ Dynamic Timetable & Active Session Integration

The client tracks both scheduled class slots and manual live sessions started by the instructor:
1. **Scheduled Checking**: Checks if the current local time falls within a scheduled timetable window (e.g., class start time up to 1 hour in the future).
2. **Instructor Live Session (Manual)**: When an instructor clicks "Launch Live Video Session", the custom room name is saved to the shared server state under `activeLiveRoom`.
3. **Background Sync**: Logged-in clients poll `/api/db` every 10 seconds to discover live rooms.
4. **UI Injection**: If either a manual live stream or scheduled class is active:
   * Displays `🔴 Live Session Active!` (or `🔴 Class in Progress!`).
   * Appends a glowing `🎥 Join Live Room Now` button to the dashboard countdown box.
   * Redirects the user to the active room name when clicked.
