## Context

Quantum Yoga students currently have a timetable but no direct gamified habit trackers. Adding a practice contribution chart (similar to GitHub's contribution heat map), streak counter, and unlocked badges will provide visual rewards and encourage regular application interaction.

## Goals / Non-Goals

**Goals:**
*   Implement a contribution chart (GitHub-style calendar grid) displaying the last 365 days of user practices.
*   Implement current vs longest practice streak counters.
*   Award milestone badges for key streak accomplishments (e.g. 3-day, 7-day, 14-day, 30-day).
*   Add a checkbox or trigger on the student dashboard allowing them to check off today's class/practice manually.

**Non-Goals:**
*   Integrating external fitness trackers (Apple Health, Google Fit) for automatic logging.
*   Synchronizing peer grids in real-time (grids are shown on user profiles individually).

## Decisions

### 1. Client-Side Rendering of the Contribution Chart
*   **Decision**: Render the 365-day grid using pure CSS Grid and Vanilla Javascript dynamically (a container filled with 365 pixel divs styled according to state).
*   **Rationale**: Avoids bloated graphing libraries. CSS grid provides complete glassmorphic control, color density styling, and easy tooltip/hover effects.

### 2. State Storage in User Database
*   **Decision**: Store a list of completed practice timestamps (ISO strings or YYYY-MM-DD strings) in `state.currentUser.practice_logs` and serialize it to the server state database.
*   **Rationale**: Keeps logging persistent across browser sessions and VM deployments. Allows easy backend calculations if needed.

## Risks / Trade-offs

*   **Risk**: Rendering 365 divs per user could impact loading performance.
    *   *Mitigation*: Pre-generate the divs once during dashboard load and update cell colors on checking/unchecking practices.
*   **Risk**: Manual logging can be manipulated or backdated.
    *   *Mitigation*: Only allow users to check off the current date (no backdating or future logging).
