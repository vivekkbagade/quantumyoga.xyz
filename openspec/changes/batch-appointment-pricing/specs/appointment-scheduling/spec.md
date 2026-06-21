## ADDED Requirements

### Requirement: Admin can set appointment default session fee in System Settings
The System Settings panel SHALL include an "Appointment Default Session Fee (₹)" input field. The entered value SHALL be persisted in LocalStorage under the key `qy_appointment_fee`. This fee SHALL be used as the default cost for all new private coaching appointments.

#### Scenario: Admin saves a default appointment fee
- **WHEN** the admin navigates to System Settings, enters a value in "Appointment Default Session Fee (₹)", and saves
- **THEN** the value SHALL be persisted to LocalStorage as `qy_appointment_fee` and reflected in the input on next load

#### Scenario: No appointment fee set
- **WHEN** `qy_appointment_fee` is absent or zero in LocalStorage
- **THEN** the settings field SHALL display "0" as a placeholder

### Requirement: Appointment fee displayed on student profile appointment cards
Each upcoming appointment card in the student's "My Appointments" panel SHALL display the session fee associated with that appointment at time of booking (or the current default fee if none was recorded at booking time).

#### Scenario: Student views upcoming appointment with a fee
- **WHEN** a student views their "My Appointments" section and has an upcoming appointment
- **THEN** each appointment card SHALL show a "Fee: ₹&lt;amount&gt;" line

#### Scenario: Appointment fee is zero or unset
- **WHEN** an appointment has no fee recorded and no default fee is configured
- **THEN** the appointment card SHALL display "Fee: ₹0"
