## Context

Quantum Yoga needs to display membership bills, send due alerts, and manage invoices centrally. We will introduce a payments tracking system that logs invoices in LocalStorage, warns users about overdue dues via landing headers, generates printable receipt modals, and adds a payment dashboard in the Admin Console.

## Goals / Non-Goals

**Goals:**
- Add a "Billing & Receipts" sub-section inside the student's Profile section.
- Persist invoice records under the LocalStorage key `qy_payments`.
- Support manual invoicing, reminder alerts, and payment recording in the Admin Console.
- Render warning banners on student dashboards for overdue invoices.
- Display a print-ready transaction receipt modal overlay.

**Non-Goals:**
- Performing real-time credit card processing or banking transfers (modeled as simulated records).

## Decisions

### 1. Data Schema & Model
- **Decision**: Store invoice objects under `qy_payments` containing invoice ID, user email, description (e.g. "Monthly Gold Membership"), amount (USD), due date (YYYY-MM-DD), status (`paid`, `pending`, `overdue`), lastReminderSent date, and paymentDate.
- **Rationale**: Relational linking via user email matches existing design structures.

### 2. Overdue Warning Banner Placement
- **Decision**: Position the overdue payment alert banner as a sticky layout block directly below the header navbar, inside the `#dashboard-app` container.
- **Rationale**: Ensures maximum visual urgency upon dashboard access while remaining clean and responsive.

### 3. Print-Ready CSS Overlay
- **Decision**: Implement a dedicated receipt modal overlay `#receipt-modal` with standard HTML structure, using print media queries (`@media print`) to hide headers and menus and print only the receipt block.
- **Rationale**: Reuses the browser's native print capabilities to save receipts as PDFs without third-party libraries.

## Risks / Trade-offs

- **[Risk]** Data model bloat from generating logs of past receipts.
  - *Mitigation*: Cap invoice histories to the last 12 entries per user.
