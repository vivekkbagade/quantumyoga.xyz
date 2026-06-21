## Context

Quantum Yoga's batch scheduling and appointment booking systems currently have no cost model. Batches are created with only a name, instructor, and capacity; appointments have no price field at all. The Payments & Billing panel is completely disconnected from these services — admins must manually craft every invoice from scratch, guessing at the correct fee. This change introduces a pricing layer that ties into the existing LocalStorage-backed invoice system (`qy_payments`) and surfaces fees in the relevant screens.

## Goals / Non-Goals

**Goals:**
- Add a `sessionFee` (INR) field to the batch data model (`qy_batches`), settable at batch creation and editable thereafter.
- Add a global `appointment_default_fee` setting (INR) in System Settings, stored under `qy_appointment_fee` in LocalStorage, defaulting to 0 if unset.
- Surface these fees on the student's "My Appointments" panel and within the User Management batch column.
- Add a "Charge for Session" quick-action in Payments & Billing that auto-populates the invoice form with the student email and the configured fee for the session type.
- Pre-populate the amount field in the invoice modal when triggered from appointment or batch contexts.

**Non-Goals:**
- Automated recurring billing or subscription logic (outside scope of this change).
- Dynamic per-student fee overrides at the individual appointment level.
- Integration with external payment gateways.
- Retroactively re-pricing or re-issuing historical invoices.

## Decisions

### 1. Where to Store the Appointment Default Fee
- **Decision**: Store as a single scalar value in LocalStorage under `qy_appointment_fee` (e.g., `"1500"`), separate from `qy_upi_settings`.
- **Rationale**: Keeps it independent and easily readable without deserializing the UPI object. Consistent with how `site_default_theme` is a separate key in the db.json seed and LocalStorage.
- **Alternative considered**: Nesting inside `qy_upi_settings` — rejected because UPI settings are payment-gateway config, not session pricing.

### 2. Where to Show the "Charge for Session" Action
- **Decision**: Add the action as a button in the Admin Appointments Management table row (per appointment) and in the batch cohorts table row (per batch student). When clicked, it opens the existing Issue Manual Invoice form pre-filled with the student's email and the configured fee.
- **Rationale**: Reuses the existing invoice form and flow rather than building a new billing UI; minimal surface area change.
- **Alternative considered**: A dedicated "Batch Billing" sub-panel — too heavyweight for the current scope.

### 3. Batch Session Fee — Per-Session or Per-Month
- **Decision**: The fee is a flat per-session amount. The admin decides how frequently to invoice. No automatic scheduling.
- **Rationale**: Keeps the model simple and consistent with how the existing manual invoice system works (amount, description, due date are admin-controlled).

### 4. Backward Compatibility for Existing Batch Records
- **Decision**: Treat missing `sessionFee` as `0` (zero / not set) in all display and invoice contexts. Existing records remain valid without a migration step.
- **Rationale**: LocalStorage data cannot be migrated with a guarantee across browser sessions; defaulting to 0 is safe and non-breaking.

## Risks / Trade-offs

- **[Risk]** Admins forget to set the fee when creating a batch, leading to ₹0 invoices being auto-issued.
  - *Mitigation*: Show a visible "₹0 — not set" placeholder in the batch table fee column; warn in the "Charge for Session" flow if fee is 0.
- **[Risk]** The Invoice form prefill is overridden by the user before submitting, causing an incorrect charge.
  - *Mitigation*: This is acceptable — the prefill is a convenience, not an enforcement. Admins retain full control.
