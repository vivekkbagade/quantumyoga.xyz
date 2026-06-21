## Context

Quantum Yoga currently has no cohort organization or session scheduling. We need to design a system allowing administrators to define student batches and associate class timetables (weekdays, times, and yoga routines) with them. Registered students will then see their batch schedule and a live countdown to their next class on their Profile page.

## Goals / Non-Goals

**Goals:**
- Implement a "Batches & Scheduling" sub-tab in the Admin Console.
- Support creation, deletion, and class scheduling for batches, stored in LocalStorage under the key `qy_batches`.
- Support enrollment by updating the user's data object in LocalStorage with a `batchId` property.
- Display batch details, weekly schedules, and a real-time countdown to the next class inside the student's Profile tab.

**Non-Goals:**
- Implementing actual video conferencing or streaming tools (class sessions are routine-guidance schedules).
- Handling payment or fee subscription processing for batches.

## Decisions

### 1. Data Schema & Persistence
- **Decision**: Store batches as a flat array under `qy_batches` in LocalStorage, containing IDs, names, and a list of timetable objects. Map users to batches via a `batchId` string property inside each user object in `qy_users`.
- **Rationale**: Keeps data retrieval fast, relational mapping simple, and fits perfectly within the client-side mockup architecture.

### 2. Next Class Countdown Logic
- **Decision**: Implement a timer in `app.js` that runs every minute (or second) when the user is on the Profile tab. Calculate the delta from the current date/time to the next occurring class slot based on the weekdays (Monday-Sunday) and times (HH:MM) defined in the batch timetable.
- **Rationale**: Provides a dynamic, interactive feel in the profile section without requiring complex backend scheduling jobs.

### 3. Integrated Admin Modal Assignment
- **Decision**: Add a batch selection dropdown directly into the existing "Inspect User" detail modal.
- **Rationale**: Reuses the existing administrative detail modal framework, avoiding screen clutter and UI overhead.

## Risks / Trade-offs

- **[Risk]** The countdown timer calculations might cause performance lag if updated too frequently.
  - *Mitigation*: Run the countdown interval check only when the active tab is "profile" and the user is enrolled in a batch.
