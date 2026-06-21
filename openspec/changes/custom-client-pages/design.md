## Context

With multiple pending features (class batch scheduling, private coaching appointments, and payment invoices) entering the system, the user profile section needs to be transformed into a unified, personalized client dashboard. This dashboard will serve as the single source of truth for members to view their batch details, track upcoming classes, manage appointments, and review their billing histories.

## Goals / Non-Goals

**Goals:**
- Redesign the student profile tab (`#profile-section`) into a multi-panel personalized client page.
- Display the member's assigned yoga batch details (schedule, timing, coach).
- Consolidate scheduled batch classes and private appointments into a chronological "Upcoming Classes & Sessions" timeline.
- Integrate the client's invoice logs and receipt history with print features.
- Provide inline actions for session check-ins, cancellations, or rescheduling directly from the client feed.

**Non-Goals:**
- Creating a separate login section or portal; the dashboard resides directly within the existing authenticated profile page.
- Processing real-time electronic payments or card processing (simulated invoice updates only).

## Decisions

### 1. Multi-Tab Profile Navigation
- **Decision**: Divide the profile section into two tabs:
  1. **My Studio Dashboard**: Home to batch overviews, upcoming classes, and billing/payment history.
  2. **My Practice Log**: Displays favorited yoga poses and completed routine history.
- **Rationale**: Prevents vertical page bloating and keeps administrative studio info separate from practice statistics.

### 2. Live Chronological Session Timeline
- **Decision**: Query the user's batch timetable (`qy_batches` mapped via `user.batchId`) and their individual appointments (`qy_appointments` matched by user email). Merge these sources, sort them chronologically, and render them as a unified upcoming timetable feed.
- **Rationale**: Simplifies client planning by avoiding separate schedules for classes and private sessions.

### 3. Integrated Action Triggers
- **Decision**: Connect "Cancel" and "Reschedule" buttons in the upcoming classes list to the existing appointment/booking data functions, modifying `qy_appointments` or user batch status and refreshing the UI.
- **Rationale**: Ensures the dashboard is highly interactive, self-contained, and matches the premium look of modern SaaS portals.

## Risks / Trade-offs

- **[Risk]** Empty states if a user is not enrolled in a batch or has no invoices.
  - *Mitigation*: Render elegant placeholder cards with call-to-action buttons (e.g., "Join a Batch" or "Book your first session").
- **[Risk]** Heavy DOM redraws on state changes.
  - *Mitigation*: Use modular rendering functions (`renderClientDashboard()`, `renderClientBilling()`, `renderClientSchedule()`) to redraw only modified panels.
