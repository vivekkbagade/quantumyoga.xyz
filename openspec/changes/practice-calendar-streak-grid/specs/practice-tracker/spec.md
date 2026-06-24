## ADDED Requirements

### Requirement: Interactive Practice Contribution Grid
The system SHALL display a pixelated contribution chart showing the student's yoga practice density over the past 365 days.

#### Scenario: Displaying contribution calendar density on load
- **WHEN** the student views their profile page
- **THEN** the system renders a contribution grid with days of the year, color-coded by practice intensity (0 for none, 1-4 for logged sessions), and hover tooltips showing date and logged count.

### Requirement: Streak Counting and Milestones
The system SHALL compute current daily practice streaks and longest practice streaks, displaying them alongside visual badges.

#### Scenario: Dynamic calculation of practice streaks
- **WHEN** a student checks off a yoga class or pose session completion
- **THEN** the system increments their daily practice log, updates their current and longest streak values in real-time, and plays a subtle check-off animation.

#### Scenario: Displaying milestone achievements
- **WHEN** the student's current streak reaches milestone counts (e.g., 5 days, 15 days, 30 days)
- **THEN** the system unlocks and illuminates a glowing milestone badge in the milestone section.
