## ADDED Requirements

### Requirement: Interactive Audio Alignment Guides
The system SHALL narrate pose descriptions and transitions using the browser's native Web Speech API when the voice coach is enabled.

#### Scenario: Audio guide triggers on pose transition
- **WHEN** the user starts a guided routine and the step changes to a new posture
- **THEN** the system checks if the voice coach toggle is enabled, and if so, synthetically speaks the pose name and its core alignment tip.

### Requirement: Breathing Cadence Auditory Prompts
The system SHALL narrate breathing cycles ("Inhale" and "Exhale") at regular intervals matching the pose hold pacing.

#### Scenario: Breathing guides narration
- **WHEN** a pose step hold begins
- **THEN** the system triggers periodic audio announcements ("Inhale for 4 seconds... Exhale for 4 seconds...") matching the hold duration settings.
