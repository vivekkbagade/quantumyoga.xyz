## 1. Core Verification and Helper Setup

- [x] 1.1 Update default mock lead seed data in `app.js` to use standard Indian phone formats
- [x] 1.2 Implement the helper function `formatIndianPhone(phoneStr)` in `app.js` to standardize phone numbers to "+91 XXXXX XXXXX"

## 2. Inquire Form and Validation Integration

- [x] 2.1 Update validation checks in `app.js` inquire form submit listener to leverage sanitized validation logic
- [x] 2.2 Format the phone number string using `formatIndianPhone` before saving a new lead to LocalStorage
- [x] 2.3 Align patterns, placeholders, and tooltips in `index.html` for the `#inquire-phone` input field

## 3. UI Display Standardization

- [x] 3.1 Update the lead card DOM rendering in `app.js` (`renderLeadsTable`) to format phone numbers via `formatIndianPhone` before rendering
- [x] 3.2 Update the Lead Inspection profile modal rendering in `app.js` (`openInspectLeadModal`) to format phone numbers via `formatIndianPhone` before rendering

## 4. Verification

- [x] 4.1 Verify form validation rejects invalid numbers and formats valid ones correctly on submit
- [x] 4.2 Verify formatted phone numbers display correctly in Leads Kanban columns and Inspect Lead details modal
