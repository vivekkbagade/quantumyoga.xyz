## ADDED Requirements

### Requirement: Batch creation form includes a session fee field
The "Create New Cohort Batch" admin form SHALL include a numeric "Session Fee (₹)" input field. The entered amount SHALL be saved as `sessionFee` on the batch object in the `qy_batches` LocalStorage array.

#### Scenario: Fee field present in create form
- **WHEN** the admin navigates to the Batches & Scheduling tab and views the Create New Cohort Batch form
- **THEN** a "Session Fee (₹)" number input SHALL be visible in the form

#### Scenario: Fee persisted on batch creation
- **WHEN** the admin submits the batch creation form with a session fee value of 1200
- **THEN** the new batch object in `qy_batches` SHALL contain `sessionFee: 1200`

### Requirement: Active Batch Cohorts table shows session fee column
The "Active Batch Cohorts" table in the Admin Batches & Scheduling panel SHALL include a "Session Fee" column displaying each batch's `sessionFee` in INR format.

#### Scenario: Table displays fee for batch with fee set
- **WHEN** a batch with `sessionFee: 800` is listed in the Active Batch Cohorts table
- **THEN** the Session Fee column SHALL display "₹800"

#### Scenario: Table displays zero for batch without fee
- **WHEN** a batch has `sessionFee: 0` or the field is absent
- **THEN** the Session Fee column SHALL display "₹0"
