## ADDED Requirements

### Requirement: Interactive Picture Gallery
The system SHALL provide high-resolution images representing correct yoga pose alignments and postures, structured as a responsive gallery.

#### Scenario: Displaying Pose Alignment Image
- **WHEN** the user opens the detail view for a specific pose (e.g., "Downward-Facing Dog")
- **THEN** the system SHALL render a high-quality, responsive image showing the correct alignment for that posture

### Requirement: Integrated Video Player
The system SHALL support instructional video playbacks for both individual poses and full routines via an overlay custom video player.

#### Scenario: Playing Pose Video Tutorial
- **WHEN** the user clicks the "Play Guide" button on a pose detail modal
- **THEN** the system SHALL open a custom modal overlay containing a video player and begin playing the tutorial video

#### Scenario: Controllable Routine Video Playback
- **WHEN** the user is watching a routine video in the overlay player
- **THEN** the system SHALL allow the user to play, pause, seek, and toggle fullscreen mode
