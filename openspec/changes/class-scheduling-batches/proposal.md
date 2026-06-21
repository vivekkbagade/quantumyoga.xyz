## Why

Currently, Quantum Yoga lacks any organizational structure for scheduling yoga classes or grouping students into cohort-based groups. Introducing class scheduling and batch management allows administrators to organize students into specific batches (e.g., Morning Batch, Weekend Advanced) and assign class timetables, giving students structured learning schedules and visual countdowns to their next session.

## What Changes

- **Admin Console Batch Control**: Add a "Batches & Scheduling" sub-tab in the Admin panel to let instructors create, edit, or delete student batches.
- **Student Enrollment**: Provide search and assign controls in the Admin panel to associate registered students with created batches.
- **Timetable Scheduler**: Enable instructors to define class events for each batch, selecting a day of the week, class time, and target routine.
- **My Schedule View**: Provide regular users with a "My Batch & Schedule" view in their Profile tab, including a countdown to their next class and quick links to open the scheduled routine.

## Capabilities

### New Capabilities
- `class-scheduling-batches`: Allows instructors to organize users into named batches, schedule weekly timetables, and displays personalized countdowns and routine schedules to enrolled students.

### Modified Capabilities

## Impact

- Modifies `index.html` to include the batch creation controls, enrollment panels, and student weekly schedule cards.
- Modifies `app.js` to manage batch states, user assignment, timetables scheduling, and profile calendar rendering.
