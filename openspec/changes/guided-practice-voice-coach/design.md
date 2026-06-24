## Context

Yoga practitioners struggle to maintain visual contact with dashboard screens during balances, forward folds, or inversions. Implementing client-side Text-to-Speech (TTS) using the browser's Web Speech API solves this problem without external backend voice api costs.

## Goals / Non-Goals

**Goals:**
*   Implement a Toggle Voice Coach UI switch inside the routine preview and play viewport modals.
*   Hook transition timers to synthesize `SpeechSynthesisUtterance` cues.
*   Enable voice choice settings (allowing users to pick their preferred voice or set pitch/rate).

**Non-Goals:**
*   Voice recognition (speech-to-text) for command controls (e.g. telling the app to "pause" or "stop").
*   Custom hosted voice audio files (synthesis runs 100% locally on the device).

## Decisions

### 1. Web Speech Synthesis (TTS) Engine
*   **Decision**: Leverage standard `window.speechSynthesis`.
*   **Rationale**: Supported out of the box in all modern browsers (Safari, Chrome, Firefox, Edge) without network request latency or pricing concerns.

### 2. Multi-Voice Settings Panel
*   **Decision**: Populate a drop-down selection list using `speechSynthesis.getVoices()` so users can switch speaking options.
*   **Rationale**: Ensures a customized experience (gender/accent options) depending on user preferences.

## Risks / Trade-offs

*   **Risk**: Voice synthesis can overlap if triggers fire too close together.
    *   *Mitigation*: Execute `window.speechSynthesis.cancel()` before speaking any new transition or breath phrase.
*   **Risk**: Speech synthesis requires user interaction before it can play on page load (browser autoplay restrictions).
    *   *Mitigation*: The toggle is inside the routine modals, which are clicked by the user, satisfying the user gesture requirement.
