# Class Scheduling & Batches Delta Spec

## ADDED Requirements

### Requirement: WhatsApp Appointment Alert Triggers
The system SHALL dispatch a WhatsApp notification to the member when their private coaching session is booked, rescheduled, or cancelled.

#### Scenario: Dispatch alert on booking appointment
- **WHEN** an appointment is successfully scheduled and WhatsApp notifications are enabled
- **THEN** the system SHALL send a WhatsApp message to the member confirming the date, time, and target routine

#### Scenario: Dispatch alert on rescheduling appointment
- **WHEN** an appointment is rescheduled and WhatsApp notifications are enabled
- **THEN** the system SHALL send a WhatsApp message to the member confirming the updated appointment details
