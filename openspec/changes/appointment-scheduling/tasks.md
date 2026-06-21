## 1. UI Implementation

- [x] 1.1 Add the student "Appointments" dashboard section `#profile-appointments-section` (including placeholders for upcoming/past sessions and request buttons) under the Profile section in `index.html`.
- [x] 1.2 Inject the appointment booking and rescheduling dialog modal form `#appointment-modal` to `index.html`.
- [x] 1.3 Add the "Appointments Management" sub-tab button `#admin-appointments-tab-btn` and panel `#admin-appointments-panel` to the admin section of `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind DOM variables for student appointment list cards, booking buttons, admin tabs, and scheduler overlay fields in `app.js`.
- [x] 2.2 Extend `setAdminSubTab(panelName)` in `app.js` to support tab-switching for the `"appointments"` panel and render active schedule tables.
- [x] 2.3 Implement LocalStorage appointment storage functions (`loadAppointments()`, `saveAppointments()`) and booking handlers to create new student sessions.
- [x] 2.4 Implement student-facing rescheduling dialog views and cancellation handlers in `app.js`.
- [x] 2.5 Integrate administrator scheduler tools in `app.js` to book, reschedule, or cancel appointments for any student user.

## 3. Verification

- [x] 3.1 Verify student appointments list, self-service rescheduling, and cancellation updates display and persist correctly in the browser.
- [x] 3.2 Verify admin appointments pipeline controls (rescheduling, booking for users, canceling sessions) function and synchronize in the browser.
