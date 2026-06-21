## 1. UI Implementation

- [x] 1.1 Add the "Batches & Scheduling" sub-tab button `#admin-batches-tab-btn` and settings sub-panel `#admin-batches-panel` to the admin section of `index.html`.
- [x] 1.2 Implement the batch creation form, active batch list, and class scheduling controls (weekday, start time, routine select) in `#admin-batches-panel` of `index.html`.
- [x] 1.3 Add the batch enrollment selector control to the administrative user inspection modal (`#admin-inspect-modal`) in `index.html`.
- [x] 1.4 Add a "My Batch & Schedule" dashboard card (including placeholders for batch title, timetable list, and live countdown timer) inside `#profile-section` in `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind new DOM references for admin batch sub-tabs, dropdown fields, profile schedule card, and countdown displays in `app.js`.
- [x] 2.2 Extend `setAdminSubTab(panelName)` in `app.js` to support tab-switching for the `"batches"` panel and reload batch details.
- [x] 2.3 Implement LocalStorage batch storage functions (`loadBatches()`, `saveBatches()`) and admin handlers to create named batches, delete batches, and schedule classes in `app.js`.
- [x] 2.4 Integrate user enrollment dropdown render and update save logic inside the admin user inspection modal functions of `app.js`.
- [x] 2.5 Implement the user profile timetable renderer, scheduled routine link bindings, and class countdown calculation timer intervals in `app.js`.

## 3. Verification

- [x] 3.1 Verify admin tools for batch creation, class scheduling, and student enrollment save correctly in LocalStorage.
- [x] 3.2 Verify student-facing schedule lists, countdown calculations, and routine quick-links update and persist in the browser.
