## ADDED Requirements

### Requirement: Interactive SVG Visualizations
The system SHALL display SVG-based interactive charts within the Studio Analytics panel representing payment collections and class bookings.

#### Scenario: Rendering interactive analytics charts
- **WHEN** the administrator navigates to the "Studio Analytics" sub-tab in the Admin Panel
- **THEN** the system generates clean SVG bar charts and line charts displaying monthly collections, class bookings, and posture popularity, with hover effects revealing precise values.

### Requirement: Export to CSV and PDF Reports
The system SHALL provide export options allowing administrators to download CSV financial ledgers or launch a print-friendly PDF receipt of bookings.

#### Scenario: Downloading CSV financial ledger
- **WHEN** the administrator clicks the "Export CSV Ledger" button
- **THEN** the browser triggers a file download containing a comma-separated list of all payment logs with dates, invoice IDs, and amounts.

#### Scenario: Print/PDF formatting of studio logs
- **WHEN** the administrator clicks the "Print Attendance Log" button
- **THEN** the system opens a browser print window displaying a clean, receipt-like table formatted for PDF generation or physical print.
