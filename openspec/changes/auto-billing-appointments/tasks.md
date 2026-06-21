## 1. Core Logic Integration

- [x] 1.1 Update `appointmentForm` submit listener in `app.js` to construct a new pending invoice of ₹1500 when booking a new appointment
- [x] 1.2 Generate unique invoice ID using `"INV-" + Date.now()` and set `dueDate` matching the appointment date
- [x] 1.3 Save the newly created invoice into the `qy_payments` array in LocalStorage using `savePayments`

## 2. UI Updates and Dashboard Synchronization

- [x] 2.1 Trigger refresh functions for client billing history (`renderClientBillingHistory()`) and client dashboard (`renderClientDashboard()`) upon successful booking
- [x] 2.2 Trigger refresh functions for administrator dashboard overview metrics (`renderAdminOverview()`) upon successful booking

## 3. Verification

- [x] 3.1 Verify that booking a new private coaching session as a student generates a pending invoice of ₹1500 and updates student billing history
- [x] 3.2 Verify that booking a new private coaching session as an admin for a student generates a pending invoice and immediately updates admin billing KPIs
