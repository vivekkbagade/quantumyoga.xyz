## ADDED Requirements

### Requirement: Student Self-Service Appointment Booking
The system SHALL provide authenticated users with controls inside their Profile dashboard to schedule new private coaching appointments.

#### Scenario: User books a routine review session
- **WHEN** the student selects "Vinyasa flow routine", date "2026-07-15", time "09:00 AM", and clicks "Schedule Appointment"
- **THEN** the system SHALL validate the details, create the appointment in LocalStorage under the user's name, and display the booking in their upcoming sessions list.

### Requirement: Appointment Cancellation and Rescheduling
The system SHALL enable users to cancel or reschedule any upcoming appointment directly from their schedule list.

#### Scenario: Student cancels a scheduled appointment
- **WHEN** the student selects an upcoming appointment and clicks "Cancel Appointment"
- **THEN** the system SHALL transition the appointment status to "Cancelled" and update the active timetable displays.

#### Scenario: Student reschedules a scheduled appointment
- **WHEN** the student selects an upcoming appointment, inputs a new date "2026-07-16", a new time "10:30 AM", and confirms the change
- **THEN** the system SHALL update the date, time, and set the status to "Rescheduled" in LocalStorage.

### Requirement: Admin Dashboard Session Control
The system SHALL provide administrators with a dedicated appointment dashboard to view, reschedule, cancel, or book unlimited appointments for any registered student.

#### Scenario: Admin reschedules a student session
- **WHEN** the administrator logs into the Admin Console, opens "Appointments", locates the scheduled session for "sarah@inquiry.com", changes the date to "2026-07-20", and clicks "Save Schedule"
- **THEN** the system SHALL update the appointment details, syncing the updated schedule back to Sarah's user profile.
