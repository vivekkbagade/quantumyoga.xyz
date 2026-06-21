## Context

Quantum Yoga needs to provide scheduling options for personalized training sessions and class routines. We will implement an appointment manager allowing students to book, reschedule, and cancel yoga appointments, and giving instructors a central view to track all scheduled sessions.

## Goals / Non-Goals

**Goals:**
- Add an "Appointments" sub-section inside the student's Profile section.
- Persist booking records in LocalStorage under the key `qy_appointments`.
- Support new session booking, rescheduling, and cancellation options for both students and admins.
- Add an "Appointments" sub-tab and panel inside the Admin dashboard.

**Non-Goals:**
- Integrating with external calendar platforms (Google Calendar, Outlook) or payment gateways.

## Decisions

### 1. Data Schema & Model
- **Decision**: Store appointments under `qy_appointments` in LocalStorage as objects containing appointment ID, student email, selected routine, date (YYYY-MM-DD), time (HH:MM), and status (`scheduled`, `rescheduled`, `cancelled`).
- **Rationale**: Keeps database transactions simple and client-side filtering straightforward.

### 2. Dialog Modal Booking UI
- **Decision**: Create an appointment dialog modal (`#appointment-modal`) in the UI that is reused for both booking new sessions and rescheduling existing ones.
- **Rationale**: Standardizes interface rendering, minimizes CSS bloat, and guarantees a consistent layout.

## Risks / Trade-offs

- **[Risk]** Users booking slots that overlap or conflict.
  - *Mitigation*: Implement client-side validation that checks for duplicate bookings matching the same student email, date, and time.
