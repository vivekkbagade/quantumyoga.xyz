## Context

Currently, the Quantum Yoga dashboard operates with a fixed USD ($) currency format, US-standard YYYY-MM-DD date presentation for text displays, and basic phone format validation. To scale operations in India, these visual markers, formats, and validators must be converted to the Indian local standard (₹ currency, DD-MM-YYYY dates, and 10-digit mobile phone numbers).

## Goals / Non-Goals

**Goals:**
- Convert currency displays to INR (₹) across the student profile billing history, admin invoice ledgers, and dashboard metrics.
- Display dates for check-ins, invoices, and scheduling feeds in the standard Indian layout (`DD-MM-YYYY`).
- Validate phone numbers in inquiry capture forms to match standard 10-digit Indian mobile formats.

**Non-Goals:**
- Converting the internal LocalStorage database values (we will keep date values stored in standard YYYY-MM-DD to preserve comparisons, but display them localized).
- Real-time timezone conversions of live stream times (live countdown times will remain localized to the system clock).

## Decisions

### 1. Currency Presentation Layout
- **Decision**: Update all DOM bindings of `$` in `index.html` and logic templates in `app.js` to use `₹` directly.
- **Rationale**: Direct string formatting replacement provides immediate localization with zero overhead or dependency additions.

### 2. Localization Date Helper
- **Decision**: Introduce a `formatDateToIndian(dateStr)` helper function in `app.js` to parse `YYYY-MM-DD` dates and return `DD-MM-YYYY` string representations for UI rendering.
- **Rationale**: Preserves the native `YYYY-MM-DD` ISO format inside LocalStorage databases for easy date calculations (e.g. `date < todayStr`), while displaying localized dates to the user.

### 3. Indian Mobile Validation RegEx
- **Decision**: Utilize the regular expression `/^(?:\+91|0)?[6-9]\d{9}$/` inside the inquiry form validation check.
- **Rationale**: Covers standard Indian mobile carrier prefixes (starting with 6, 7, 8, or 9) and accounts for optional country prefixes (`+91` or `0`).

## Risks / Trade-offs

- **[Risk]** HTML5 `<input type="date">` displays a native date selector that expects values in `YYYY-MM-DD` format. Setting its value in `DD-MM-YYYY` format will cause browser errors or fail to select dates.
  - *Mitigation*: Only apply the `formatDateToIndian` helper for text rendering (like table columns and history feeds). Keep date inputs (like appointment booking and invoice due dates) using the browser's native date format `YYYY-MM-DD` for values.
