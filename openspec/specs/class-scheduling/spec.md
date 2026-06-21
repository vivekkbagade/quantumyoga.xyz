# Class Scheduling & Batches Spec

## Overview
This capability handles class scheduling, weekly timetable displays, countdowns to upcoming sessions, and member appointments management (booking, rescheduling, cancellation, and scheduling fees).

## Data Structures

### Batches Schema (`batches`)
- `id` (string): Unique identifier (e.g., `"batch-vinyasa-mornings"`).
- `name` (string): Title of the batch.
- `instructor` (string): Assigned yoga instructor.
- `capacity` (number): Maximum student size.
- `sessionFee` (number): Price per private session.
- `timetable` (array of objects): Weekly class times. Each slot has:
  - `day` (string): Day of the week (e.g., `"Monday"`).
  - `time` (string): Session start time (e.g., `"08:00 AM"`).

### Appointments Schema (`appointments`)
- `id` (string): Unique booking ID.
- `studentEmail` (string): Email of the member.
- `selectedRoutine` (string): Selected yoga routine for the private session.
- `date` (string): Booking date (YYYY-MM-DD).
- `time` (string): Start time slot.
- `status` (string): `Scheduled`, `Completed`, or `Cancelled`.
- `fee` (number): Private class fee charged.

---

## Member Workflows

### 1. Batch Schedule & Countdown Timer
- Under the profile dashboard, the member sees their assigned batch name and timetable.
- A **live countdown timer** calculates the remaining days, hours, minutes, and seconds until the next scheduled batch class.
- The countdown updates every second. When a class is currently active, it displays a "Class in progress" status.

### 2. Appointment Booking
- Members click "Book Appointment" to open the scheduling modal.
- Input fields: Date, Time Slot, and Target Yoga Routine.
- Automatically calculates and charges the `appointment_fee` (defaulting to 800 INR), issuing a corresponding invoice.
- Validates that the appointment date is in the future.

### 3. Rescheduling & Cancellation
- Members can cancel or reschedule upcoming appointments.
- Cancellation updates status to `Cancelled` and refunds/adjusts associated invoice logs if applicable.

---

## Admin Workflows

### 1. Batch Creator
- Create new batches specifying Name, Instructor, and Capacity limits.
- Manage weekly timetables by adding weekday/time pairs.

### 2. Appointments Directory
- A master list of all student appointments.
- Supports search by student email.
- Admins can book appointments on behalf of any student, choose custom times, adjust pricing fees, and edit statuses directly.
