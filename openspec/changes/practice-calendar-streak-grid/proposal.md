## Why

To encourage regular yoga practice, students need visual habit-building tools. Introducing a GitHub-style activity grid (practice calendar), active practice streaks, and milestones will provide visual validation, increase dashboard interactive engagement, and keep practitioners motivated.

## What Changes

*   **Practice Streak Grid Component**: A beautiful glassmorphic contribution chart showing the student's practice density (sessions/sessions checked off) over the year.
*   **Streak Tracker**: Computes and displays current daily streaks and longest streaks.
*   **Milestones & Badges**: Awards virtual milestone badges with glowing hover effects for streak achievements.
*   **Practice Logging**: Integrates practice completion logging (e.g. marking a scheduled routine or pose workout as completed for the day).

## Capabilities

### New Capabilities
- `practice-tracker`: Handles tracking practice logins/completions, computing current and longest streaks, showing the contribution grid, and awarding milestone badges.

### Modified Capabilities
<!-- None -->

## Impact

*   **Frontend**: Adds a new interactive sub-component or card in the student dashboard (Profile tab/section).
*   **Database/Storage**: Adds a `practice_logs` array to the user's database state to store completion timestamps.
