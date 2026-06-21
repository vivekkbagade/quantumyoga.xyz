## 1. Data Model & Seed Updates

- [x] 1.1 Add `sessionFee` field (default `0`) to the seed batch record in `db.json` under `batches`
- [x] 1.2 Add `appointment_fee` default value (e.g., `1500`) to `db.json` as a top-level key for seeding

## 2. Batch Pricing — Admin Batches & Scheduling Panel

- [x] 2.1 Add a "Session Fee (₹)" number input (`id="admin-batch-fee-input"`) to the `#admin-create-batch-form` in `index.html`
- [x] 2.2 Update the batch creation handler in `app.js` to read the fee input and include `sessionFee` in the new batch object saved to `qy_batches`
- [x] 2.3 Add a "Session Fee" column header to the Active Batch Cohorts table (`#admin-batches-table`) in `index.html`
- [x] 2.4 Update the batch table render function in `app.js` to display `₹<sessionFee>` (or `₹0`) in the new column for each batch row

## 3. Appointment Default Fee — System Settings

- [x] 3.1 Add an "Appointment Default Session Fee (₹)" number input (`id="admin-appointment-fee-input"`) and save button inside `#admin-settings-panel` in `index.html`
- [x] 3.2 Add `loadAppointmentFee()` and `saveAppointmentFee()` helpers in `app.js` that read/write `qy_appointment_fee` in LocalStorage; seed from `db.json` on first load
- [x] 3.3 Wire the save button listener in `app.js` to call `saveAppointmentFee()` with the input value and show a success confirmation message

## 4. Fee Display — Student Profile Appointment Cards

- [x] 4.1 Update the appointment card render function in `app.js` to include a "Fee: ₹&lt;amount&gt;" line for each upcoming appointment card (use the `fee` field stored on the appointment, falling back to the current `qy_appointment_fee` default)
- [x] 4.2 Update the appointment save logic in `app.js` to snapshot the current `qy_appointment_fee` value onto each new appointment object as `fee` at booking time

## 5. Fee Display — User Management Batch Column

- [x] 5.1 Update the User Management table render in `app.js` to show the enrolled batch name plus its `sessionFee` (e.g., "Morning Vinyasa Flow — ₹800/session") or "—" if no batch is assigned

## 6. "Charge for Session" Quick-Action — Payments Panel

- [x] 6.1 Add a "Charge for Session" button to each appointment row in the `#admin-appointments-table` in `index.html` (action column)
- [x] 6.2 Implement a `chargeForAppointment(appointmentId)` helper in `app.js` that reads the appointment's stored `fee` (or falls back to `qy_appointment_fee`), pre-fills `#admin-invoice-email` and `#admin-invoice-amount` in the invoice form, scrolls to / highlights the Payments panel, and displays a warning if the fee is `0`

## 7. Verification

- [x] 7.1 Verify a batch created with a session fee of ₹1000 shows "₹1000" in the Active Batch Cohorts table and "Morning Vinyasa Flow — ₹1000/session" in User Management for enrolled users
- [x] 7.2 Verify saving the appointment default fee in System Settings persists across page refresh
- [x] 7.3 Verify that a newly booked appointment card on the student profile displays the correct "Fee: ₹&lt;amount&gt;" value
- [x] 7.4 Verify clicking "Charge for Session" on an appointment pre-fills the invoice form with the correct student email and fee amount
- [x] 7.5 Verify that when no appointment fee is configured, clicking "Charge for Session" shows a visible warning that the fee is not set
