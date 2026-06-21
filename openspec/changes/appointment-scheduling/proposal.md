## Why

Yoga teachers and studio administrators need a central tool to schedule, reschedule, and track student sessions (e.g., private training, routines coaching). Introducing appointment scheduling keeps busy teachers organized, helps students view upcoming and past sessions in one place, and provides flexible booking, rescheduling, and cancellation options.

## What Changes

- **Student Appointment Dashboard**: Add an "Appointments" panel inside the user Profile dashboard to list upcoming and past booked sessions.
- **Self-Service Booking & Management**: Allow students to request new appointments (selecting date, time, and routine) and reschedule or cancel existing bookings.
- **Admin Appointments Panel**: Add a new "Appointments Management" sub-tab and panel inside the Admin section to list, search, reschedule, cancel, or book sessions for any student.

## Capabilities

### New Capabilities
- `appointment-scheduling`: Enables students and administrators to book, reschedule, cancel, and track upcoming and past yoga sessions, syncing schedules persistently.

### Modified Capabilities

## Impact

- Modifies `index.html` to add the student appointment card lists, booking modals, and the administrative appointments management panel.
- Modifies `app.js` to handle appointment scheduling operations, update booking statuses, and persist records in LocalStorage under the key `qy_appointments`.
