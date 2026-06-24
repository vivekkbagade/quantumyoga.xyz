# Guided Practice Voice Coach (Interactive Audio Guides)

The Guided Practice Voice Coach integrates client-side Text-to-Speech (TTS) alignment cues and breathing cadence prompts directly into the guided routines overlay player. This allows students to practice yoga hands-free without constantly checking their device screens.

## ⚙️ Technical Architecture

The Voice Coach relies entirely on the client's web browser using native browser APIs:

1. **Text-To-Speech Synthesis**: Powered by `window.speechSynthesis`.
2. **Audio Queue Management**: Uses `SpeechSynthesisUtterance` to speak phrases. To prevent overlapping speech, the app invokes `window.speechSynthesis.cancel()` immediately before dispatching any new alignment or breathing cue.
3. **Autoplay Policy Bypass**: Browser autoplay policies restrict audio until a user interaction (like clicking a button) is performed. Since the Voice Coach controls are embedded directly in the routine detail modal overlay, the user's initial interaction satisfies this restriction.

## 🎛️ Settings & Controls

Inside the Custom HTML5 video player overlay, the user has access to a glassmorphic Voice Coach settings panel:

* **Voice Selection Dropdown**: Dynamically queries the browser device for all available voices using `speechSynthesis.getVoices()`, allowing users to select accents and genders.
* **Volume Slider**: Controls speech synthesis output volume.
* **Speech Rate Slider**: Speeds up or slows down the narration cadence.
* **Speech Pitch Slider**: Adjusts the tone of the speaking voice.

## ⏱️ Playback Integration

When the Voice Coach is active:
1. **Pose Transitions**: On transition to a new pose, the coach reads out the pose number, name, Sanskrit translation, and the first instruction/alignment tip.
2. **Breathing Cadence Prompts**: During pose holds, the coach schedules periodic reminders (e.g., "Inhale for 4 seconds... Exhale for 4 seconds...") matching the pose hold pace.
3. **Cancellation**: Toggling the Voice Coach off or closing the video modal cancels all pending speech dispatches immediately.
