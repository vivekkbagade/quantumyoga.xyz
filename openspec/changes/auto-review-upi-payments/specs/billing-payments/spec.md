## ADDED Requirements

### Requirement: Automated UPI Payment Verification
The system SHALL verify student-submitted UTR and transaction amount values against a trusted bank transaction ledger.

#### Scenario: Transaction matches ledger exactly
- **WHEN** a student submits a 12-digit UTR and amount for an invoice
- **AND** the UTR and amount match an unlinked entry in the trusted bank transaction ledger
- **THEN** the system SHALL update the payment status to "paid" and link the UTR record automatically

#### Scenario: Transaction matches UTR but amount differs
- **WHEN** a student submits a UTR and amount for an invoice
- **AND** the UTR matches an entry in the ledger but the amount differs
- **THEN** the system SHALL mark the payment status as "discrepancy" and notify administrators

#### Scenario: Transaction UTR not found in ledger
- **WHEN** a student submits a UTR for an invoice
- **AND** the UTR does not exist in the trusted ledger
- **THEN** the system SHALL update the payment status to "review" and flag it for manual review

### Requirement: Bank Statement Ledger Import
The system SHALL support manual file uploads (CSV, XLS, XLSX) to import received transaction rows into the internal trusted ledger pool.

#### Scenario: Admin uploads a valid CSV bank statement
- **WHEN** an admin uploads a CSV bank statement containing transaction columns
- **THEN** the system SHALL parse the document, extract valid UTRs, amounts, transaction dates, and descriptions, and insert new records into the database ledger without creating duplicates

### Requirement: Planned Reconciliation Enhancements

#### Scenario: Configurable fuzzy matching for rounding differences
- **WHEN** reconciling a UTR entry
- **AND** the ledger amount matches the invoice amount within a configurable tolerance margin (e.g. ±₹0.05)
- **THEN** the system SHALL treat it as an exact match and approve the payment automatically

#### Scenario: UTR date window verification
- **WHEN** a student submits a UTR for reconciliation
- **AND** the matched ledger transaction date falls outside a 30-day window of the invoice date
- **THEN** the system SHALL block auto-approval and flag the invoice as a discrepancy to prevent reuse of old transaction references

#### Scenario: Dynamic statement schema configuration
- **WHEN** an administrator uploads a CSV statement
- **THEN** the system SHALL permit mapping target columns dynamically to the required fields (UTR, amount, date) from the UI settings panel

#### Scenario: Reconciliation audit log recording
- **WHEN** any automatic verification or manual reconciliation action is performed
- **THEN** the system SHALL write a date-stamped activity log record recording the match status, invoice ID, reference UTR, and user ID for auditing purposes

