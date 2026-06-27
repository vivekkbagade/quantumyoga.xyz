## 1. Modify HTML Layout

- [x] 1.1 Restore the original inline split layout (Compose card, Sent card, Inbox card, and Preview overlay) inside `#admin-email-panel` in `index.html`.
- [x] 1.2 Add the new navigation sub-tab button (`admin-email-center-tab-btn`) and the new iframe-based content panel (`admin-email-center-panel`) in `index.html`.

## 2. Wire Tab Navigation and Event Handlers

- [x] 2.1 Add event listeners and panel controls for the new `email-center` sub-tab inside `setAdminSubTab` in `app.js`.
- [x] 2.2 Re-enable the event handlers and DOM listeners for the restored inline quick-compose email form in `app.js`.

## 3. Rebuild and Verification

- [x] 3.1 Compile the production bundle using `npm run build`.
