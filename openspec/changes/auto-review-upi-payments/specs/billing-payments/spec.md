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
The system SHALL support manual file uploads (CSV/Excel) to import received transaction rows into the internal trusted ledger pool.

#### Scenario: Admin uploads a valid CSV bank statement
- **WHEN** an admin uploads a CSV bank statement containing transaction columns
- **THEN** the system SHALL parse the document, extract valid UTRs and amounts, and insert new records into the database ledger without creating duplicates

### Requirement: Scheduled Bank Ledger Sync
The system SHALL run a recurring background sync process at regular intervals (hourly/daily) to fetch and import new ledger records from Setu's bank statement API.

#### Scenario: Hourly cron sync runs
- **WHEN** the hourly background cron trigger fires
- **THEN** the system SHALL query Setu's bank statement API using the configured client credentials (ID, Secret, and Product Key), fetch new transaction records, and merge them into the local ledger cache


