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

1. **Instantiation**: Loaded when the user enters the `Live Class` tab or clicks the timetable shortcut.
2. **Teardown**: When the active tab shifts away from `#live-class-section`, the client calls `disposeLiveClassRoom()`:
   ```javascript
   if (jitsiApiInstance) {
     jitsiApiInstance.dispose();
     jitsiApiInstance = null;
   }
   ```
   This terminates the iframe connection and completely stops camera/microphone hardware usage.

---

## ⏱️ Dynamic Timetable Integration

The client tracks scheduled class slots in the student's active batch timetable:
1. **Active Checking**: Checks if the current local time falls within a scheduled timetable window (e.g., class start time up to 1 hour in the future).
2. **UI Injection**: If active, the countdown timer displays `🔴 Class in Progress!` in red.
3. **CTA Button**: A glowing `🎥 Join Live Room Now` button is dynamically appended to the countdown box. Clicking it navigates the user to the streaming viewport and mounts the corresponding Jitsi room automatically.
