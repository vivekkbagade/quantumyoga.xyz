## ADDED Requirements

### Requirement: Admin can configure a session fee per batch
When creating or editing a batch, the administrator SHALL be able to specify a numeric session fee (in INR) for that batch. The fee SHALL be stored as `sessionFee` on the batch object in `qy_batches`. If not set, it SHALL default to `0`.

#### Scenario: Admin sets a fee when creating a batch
- **WHEN** the admin fills in the "Create New Cohort Batch" form and enters a value in the "Session Fee (₹)" field
- **THEN** the created batch object SHALL include `sessionFee` equal to the entered value, persisted in `qy_batches`

#### Scenario: Admin creates a batch without entering a fee
- **WHEN** the admin submits the batch creation form without entering a session fee
- **THEN** the batch SHALL be created with `sessionFee: 0`

#### Scenario: Batch fee visible in Active Batch Cohorts table
- **WHEN** batches are listed in the Admin "Active Batch Cohorts" table
- **THEN** each row SHALL display a "Session Fee" column showing the fee as "₹&lt;amount&gt;" or "Not set" if zero

### Requirement: Batch session fee shown in User Management
The administrator's User Management table SHALL display the enrolled batch name AND its session fee for each user row that has a batch assigned.

#### Scenario: User enrolled in a batch with a fee
- **WHEN** the admin views the User Management table and a user is enrolled in a batch that has a `sessionFee > 0`
- **THEN** the Batch column SHALL display the batch name followed by the fee (e.g., "Morning Vinyasa Flow — ₹800/session")

#### Scenario: User enrolled in a batch with no fee set
- **WHEN** a user's enrolled batch has `sessionFee` of 0
- **THEN** the Batch column SHALL display the batch name followed by "— ₹0"

#### Scenario: User not enrolled in any batch
- **WHEN** a user has no `batchId`
- **THEN** the Batch column SHALL display "—"

### Requirement: Charge for Session quick-action in Payments panel
The admin SHALL be able to trigger a pre-filled invoice from the Appointments Management table row using a "Charge for Session" action, using the configured appointment default fee.

#### Scenario: Admin charges for a specific appointment
- **WHEN** the admin clicks "Charge for Session" on an appointment row in the Appointments Management table
- **THEN** the Issue Manual Invoice form SHALL open with the student's email and the configured `appointment_default_fee` pre-filled in the amount field

#### Scenario: Fee is zero when no default appointment fee is configured
- **WHEN** no appointment default fee has been configured and the admin clicks "Charge for Session"
- **THEN** the invoice form SHALL open pre-filled with the student email and amount "0", and a warning SHALL be displayed indicating the fee is not configured

---
*File: specs/batch-appointment-pricing/spec.md*
