## Why

Batches and private coaching appointments currently have no associated cost defined in the system, making it impossible for administrators to automatically issue billing invoices tied to these services. Admins must manually issue invoices with no reference to a standard price, which is error-prone and inconsistent. Adding configurable pricing per batch and per appointment type lets the platform automatically pre-fill or auto-generate invoices on the Payments screen, and display costs to students on relevant screens.

## What Changes

- **Batch Pricing Field**: Add a "Session Fee (₹)" field to the batch creation form and batch data model, allowing admins to define how much each batch session costs per student.
- **Appointment Pricing Field**: Add a configurable "Default Session Fee (₹)" setting in System Settings for private coaching appointments, so all new appointments carry a default cost.
- **Auto-fill Invoice on Appointment Booking**: When an admin books or a student books a private coaching appointment, automatically pre-populate the invoice amount field using the configured appointment session fee.
- **Batch Fee on User Management**: When viewing enrolled users, surface the applicable batch session fee alongside the batch name so admins can see cost context at a glance.
- **Appointment Cost on Student Profile**: Display the fee for each upcoming appointment on the student's "My Appointments" panel so students know what they owe.
- **Payments Screen Quick-Issue**: In the Payments & Billing panel, add a "Charge for Session" quick-action button next to batch and appointment entries that auto-populates and issues an invoice using the configured cost.

## Capabilities

### New Capabilities
- `batch-appointment-pricing`: Allows administrators to define a session fee per batch and a global default fee for private appointments, and surfaces those costs across booking, billing, and profile screens.

### Modified Capabilities
- `class-scheduling-batches`: Batch data model gains a `sessionFee` field; batch creation and editing forms gain a price input; User Management table shows fee alongside batch name.
- `appointment-scheduling`: Appointment booking modal pre-fills a cost field using the configured default appointment fee; student profile displays the fee per appointment card.

## Impact

- **`index.html`**: Add "Session Fee" input to `#admin-create-batch-form`; add appointment default fee setting to `#admin-settings-panel`; add fee display to appointment cards in `#profile-upcoming-appointments`; add "Charge for Session" quick-action in `#admin-payments-panel`.
- **`app.js`**: Update batch save/load logic to persist `sessionFee`; add `qy_appointment_fee` setting to LocalStorage; update appointment booking to record and display cost; update user management render to include batch fee column; add quick-charge invoice helper.
- **`db.json`**: Update the seed batch record to include `sessionFee`; add `appointment_fee` default to seed data.
