## 1. Dashboard UI Settings

- [ ] 1.1 Add the glassmorphic Voice Coach toggle widget (`#voice-coach-toggle-wrapper`) and voice select elements inside the routine player modal in `index.html`
- [ ] 1.2 Add volume, speech rate, and speech pitch controls in the settings modal list in `index.html`

## 2. Core Speech Synthesis Engine

- [ ] 2.1 Implement `initVoiceCoachSettings()` in `app.js` to populate available voices using `speechSynthesis.getVoices()`
- [ ] 2.2 Implement `speakVoiceCue(text)` helper in `app.js` that handles canceling active queues, setting rates, pitch, and triggering TTS output
- [ ] 2.3 Store preferred voice selections in local settings state

## 3. Playback Integration

- [ ] 3.1 Hook `speakVoiceCue` into the routine step transition handler in `app.js` to announce step number, pose title, and details
- [ ] 3.2 Implement breathing cue scheduler to trigger periodic inhale/exhale speech prompts during pose holds

## 4. Verification and Build

- [ ] 4.1 Run `npm run build` to verify frontend compiling
- [ ] 4.2 Validate synthesis is cancelable and transitions play smoothly on mock routine start
