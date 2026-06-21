## Context

The system allows both students and administrators to book private coaching sessions via a unified booking modal (`appointmentForm`). Invoices/payments are stored as JSON in LocalStorage under the key `qy_payments` and are loaded via `loadPayments()` and saved via `savePayments()`. Currently, invoicing is a manual process. This design describes how we will automate invoice generation during the booking submission flow.

## Goals / Non-Goals

**Goals:**
- Automatically generate a pending invoice of ₹1500 when booking a new private coaching appointment.
- Leverage the existing `qy_payments` schema and billing UI to list and display the auto-generated invoices.
- Dynamically refresh the student's dashboard billing tables and the administrator's KPI numbers immediately post-booking.

**Non-Goals:**
- Changing payment states automatically when appointments are rescheduled or cancelled.
- Integration with external payment gateways (invoices remain in "pending" status, requiring manual UPI UTR submission as per current flow).
- Variable pricing for coaching sessions (coaching sessions are billed at a flat rate of ₹1500).

## Decisions

### 1. Unified Event Trigger
- **Decision**: Embed the auto-billing creation logic directly inside the `appointmentForm` submit listener function, specifically when a new appointment is created (non-rescheduled path).
- **Rationale**: Since both client-side and admin-side bookings utilize the `appointmentForm` and trigger the same submission listener, this represents a single, DRY integration point.
- **Alternatives considered**: Injecting the logic inside `saveAppointments()`. Rejected because `saveAppointments()` is also called on cancellations and reschedules, which should not trigger new invoices.

### 2. Invoice Fields Definition
- **Decision**: Populate invoice fields as follows:
  - `id`: `"INV-" + Date.now()` (matching the prefix standard and guaranteeing uniqueness).
  - `userEmail`: Selected student's email address.
  - `description`: `"Private coaching class fee"`.
  - `amount`: `"1500"`.
  - `dueDate`: Date of the appointment (YYYY-MM-DD format).
  - `status`: `"pending"`.
- **Rationale**: Reuses the exact schema layout expected by the `loadPayments()`, `savePayments()`, and billing UI tables, ensuring seamless integration.

## Risks / Trade-offs

- **[Risk]**: Booking a session for a date in the past could lead to an immediate "overdue" state.
  - *Mitigation*: The UI already prevents booking appointments in the past (e.g., checks `date < todayStr` and throws an alert).
- **[Risk]**: Out-of-sync invoice if booking is cancelled.
  - *Mitigation*: Invoices generated will remain as a record of commitment. Cancellation does not automatically delete the pending invoice, which is standard billing practice unless waived manually by the administrator.
