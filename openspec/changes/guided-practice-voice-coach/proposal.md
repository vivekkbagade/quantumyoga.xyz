## Why

During guided routines, users must look at their screens to check posture changes, alignment tips, and breathing counts. This screen dependency compromises balance and flow. Incorporating a dynamic voice guide using the browser's native Web Speech API (Text-to-Speech) will create a hands-free, auditory guided practice environment, allowing students to maintain focus and alignment.

## What Changes

*   **Voice Coach Toggle Button**: An overlay or setting inside the routine player modal allowing users to enable/disable the interactive audio guide.
*   **Speech Trigger Dispatchers**: Hook Speech Synthesis triggers to routine step transitions and breathing ticker ticks.
*   **Alignment Speech Engine**: Read pose names, step durations, and specific posture alignment notes out loud as steps change.
*   **Breathing Cadence Audio Guides**: Read breathing cues ("Inhale... Exhale...") dynamically aligned with the routine's pacing.

## Capabilities

### New Capabilities
- `voice-coach`: Implements client-side Text-to-Speech guides using Web Speech API synthesis to read alignment and breathing cues hands-free.

### Modified Capabilities
<!-- None -->

## Impact

*   **Frontend**: Adds UI toggles to the routine video player modals and inserts speech dispatches in step transition routines (`app.js`).
*   **Aesthetics**: Glassmorphic sound toggles, volume sliders, and animations when the voice coach is active.
