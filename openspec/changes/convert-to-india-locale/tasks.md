## 1. UI Currency & Label Conversion

- [x] 1.1 Convert all currency placeholders and prefix labels from `$` to `₹` inside `index.html`.
- [x] 1.2 Update currency formatting symbols to `₹` inside the dynamically rendered template strings of `app.js` (including invoices, receipts, and KPI metrics).

## 2. Date Formatting & Parsing

- [x] 2.1 Implement the YYYY-MM-DD to DD-MM-YYYY date formatter helper function `formatDateToIndian(dateStr)` in `app.js`.
- [x] 2.2 Update chronological session timelines, administrative users tables, and profile billing table rows to use `formatDateToIndian` for display purposes.

## 3. Indian Phone Number Validation

- [x] 3.1 Implement a regular expression validator `/^(?:\+91|0)?[6-9]\d{9}$/` inside the public leads capture form handler in `app.js`.
- [x] 3.2 Update HTML validation attributes and error messages on the inquiry phone number input inside `index.html`.

## 4. Verification & Seeding Updates

- [x] 4.1 Update initial mock data seeding prices and invoice values to reflect Rupees (INR) values in `app.js`.
- [x] 4.2 Verify currency displays, date displays, and phone input validation function and persist correctly in the browser.
