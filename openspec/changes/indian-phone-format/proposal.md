## Why

Currently, phone numbers in the system are inconsistent; seeded mock leads use US-style placeholders (e.g., "555-0199"), while input validations expect Indian phone numbers. Standardizing on the Indian mobile phone format (+91 XXXXX XXXXX) ensures consistency, conforms to the India locale, and improves readability across student directories, admin Kanban boards, and lead details.

## What Changes

- **Indian Format Seed Data**: Update the default mock leads' phone numbers in `app.js` to standard Indian mobile formats.
- **Unified Validation & Formatting**: Introduce a helper function in `app.js` to sanitize, validate, and format any valid Indian mobile number input (e.g. `9876543210`, `09876543210`, or `+919876543210`) into the standard display format: `+91 XXXXX XXXXX`.
- **Kanban & Inspect View Updates**: Format phone numbers displayed on Kanban swimlane cards and the Lead Inspection profile modal to follow this standard.

## Capabilities

### New Capabilities
- `indian-phone-format`: Validation, formatting, and display logic for Indian phone numbers across forms, data layers, and dashboards.

### Modified Capabilities
<!-- None -->

## Impact

- **app.js**: Update seed data records, insert standard phone formatting helper, modify inquire form submission logic, and update render methods for lead cards and modals.
- **index.html**: Ensure input placeholders and patterns align with the standard Indian phone number format.
