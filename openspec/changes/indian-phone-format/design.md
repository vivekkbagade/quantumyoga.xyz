## Context

Currently, the Quantum Yoga platform seeds mock leads with US-style phone numbers ("555-0199"), but performs Indian phone validation on the inquiry form submission. When displaying leads in the administrative panels (Kanban boards and Inspection modals), the raw inputted strings are printed without formatting.

## Goals / Non-Goals

**Goals:**
- Update mock seed data in `app.js` to conform to Indian phone number formats.
- Implement a helper function `formatIndianPhone(phoneStr)` to format phone number inputs into `+91 XXXXX XXXXX`.
- Standardize phone displays in the Leads Swimlane board and Lead Inspection modals.
- Align `index.html` input placeholders, titles, and patterns with this formatting standard.

**Non-Goals:**
- Storing international (non-Indian) phone numbers.
- Automated SMS notifications or verification services (only UI validation/formatting is in scope).

## Decisions

### 1. Unified Phone Formatting Helper
- **Decision**: Define `formatIndianPhone(phoneStr)` in `app.js` to sanitize the string (strip spaces/hyphens), verify it contains a valid 10-digit mobile number starting with 6-9, and output a formatted string: `+91 XXXXX XXXXX`.
- **Rationale**: Standardizes formatting rules for display, storage, and validation in one place.
- **Alternatives considered**: Format on render only. Rejected because formatting during form submission allows storing standardized data, reducing performance overhead during grid rendering.

### 2. Update Seed Data Records
- **Decision**: Replace `555-0199` with `+91 98765 00199` and `555-0144` with `+91 98765 00144` in `seedMockData()` within `app.js`.
- **Rationale**: Prevents layout inconsistencies and rendering issues with pre-existing or seeded data on first load.

## Risks / Trade-offs

- **[Risk]** Legacy browser support for HTML5 `pattern` regex validation in `index.html`.
  - *Mitigation*: Combined HTML5 validation with JavaScript validation on form submit as a fallback.
- **[Risk]** Parsing existing invalid phone numbers in LocalStorage.
  - *Mitigation*: `formatIndianPhone` returns the input string unmodified as a fallback if it doesn't match the standard 10-digit Indian mobile layout, preventing runtime errors for legacy items.
