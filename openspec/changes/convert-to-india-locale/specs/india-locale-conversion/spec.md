## ADDED Requirements

### Requirement: Currency Localization to INR
The system SHALL display all monetary values in Indian Rupees (INR) using the `₹` symbol instead of US Dollars (`$`), including user dashboard invoices, total revenue statistics, daily KPIs, and payment forms.

#### Scenario: User inspects invoice details
- **WHEN** the student logs in and navigates to the Billing section of their profile
- **THEN** the system SHALL render the invoice list with prices prefixed by `₹` (e.g., `₹79` instead of `$79`).

#### Scenario: Administrator issues a manual invoice
- **WHEN** the administrator fills in the amount `500` and submits the manual invoice form
- **THEN** the system SHALL save the invoice and display it with a value of `₹500` in the transaction ledger.

### Requirement: Date Format Localization
The system SHALL display dates in the Indian local standard format (`DD-MM-YYYY`) for invoices, check-ins, scheduled appointments, and cohort batch details.

#### Scenario: Student checks active batch timing
- **WHEN** the student checks their active batch countdown timer
- **THEN** the system SHALL calculate the next class date and display dates formatted as `DD-MM-YYYY`.

### Requirement: Indian Phone Number Validation
The public leads capture form SHALL validate that the entered phone number matches a valid 10-digit Indian mobile number (e.g., starting with digits 6, 7, 8, or 9, with optional `+91` or `0` prefix).

#### Scenario: Guest submits inquiry with valid Indian phone number
- **WHEN** a guest enters phone number `+91 9876543210` in the inquiry form and clicks "Submit Inquiry"
- **THEN** the system SHALL accept the submission, save the lead, and display a success validation message.
