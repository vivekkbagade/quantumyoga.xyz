## Why

Quantum Yoga is expanding its services to students and studios in India. The current system is hardcoded to USD ($) and US-centric date and phone number formats, which creates confusion for local Indian members and administrators.

## What Changes

- **Currency Conversion**: Convert all pricing display symbols, invoice records, total revenue widgets, and invoice creation forms from USD ($) to INR (₹).
- **Date Format Localisation**: Standardise displays for session dates, invoices, and registration expirations to the Indian date format (`DD-MM-YYYY`).
- **Indian Phone Number Validation**: Update the public leads capture and inquiry forms to support and validate 10-digit Indian phone numbers (optionally starting with +91).
- **Default Timezone displays**: Ensure countdowns and schedules reflect Indian Standard Time (IST).

## Capabilities

### New Capabilities
- `india-locale-conversion`: Localises the entire website's user interface, input validation forms, database stores, and metrics counters to use Indian currency (₹), Indian date formats (DD-MM-YYYY), and Indian phone number formats.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Modifies `index.html` to update labels, forms, inputs, and tables (converting $ to ₹).
- Modifies `app.js` to process currency formatting, update date representation parsing, validate Indian phone formats, and update mock data seeding values to Rupees.
- Modifies `data.js` if necessary for routine currency representations.
