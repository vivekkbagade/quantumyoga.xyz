## Why

Currently, when students or admins book a private coaching session, there is no automated trigger to bill the student. Automating invoice generation immediately upon booking a private coaching session ensures that coaching fees are tracked consistently, reduces administrative overhead, and ensures students receive payment links instantly.

## What Changes

- **Auto Invoicing**: Automatically create a new pending invoice of ₹1500 when a private coaching appointment is successfully booked by either a student or an administrator.
- **Billing History Sync**: Ensure the automatically generated invoice immediately displays in the student's invoice history/billing panel.
- **KPI Updates**: Automatically update the administrative billing metrics (Total Invoiced, Pending Dues, etc.) and dashboards once an appointment is booked and the corresponding invoice is generated.

## Capabilities

### New Capabilities
- `appointment-billing`: Handles the automatic creation of pending invoices for private coaching appointments, updates local ledger arrays, and refreshes the student and admin billing interfaces.

### Modified Capabilities
<!-- None -->

## Impact

- **app.js**: Modification in the appointment booking form submission event listener to trigger invoice creation.
- **LocalStorage**: `qy_payments` array will receive newly appended invoice objects when a private coaching appointment is created.
- **UI Elements**: Student's Billing panel and Admin's KPI panels will dynamically update without requiring manual page reload.
