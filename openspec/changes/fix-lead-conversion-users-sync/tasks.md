## 1. Core Implementation

- [x] 1.1 Implement concurrency lock queue variables (`isSaving`, `hasPendingSave`) and sequential execution queue in `saveToServer()` in `app.js`
- [x] 1.2 Modify lead conversion click event handler (`convertLeadBtn`) in `app.js` to commit both updates to `localStorage` before calling `saveToServer()` once
- [x] 1.3 Modify private coaching appointment scheduling logic in `app.js` to commit both updates to `localStorage` before calling `saveToServer()` once

## 2. Verification

- [x] 2.1 Verify lead conversion updates are successfully saved to `db.json` and new member account can successfully log in
- [x] 2.2 Verify private coaching session scheduling successfully saves both the new appointment and the billing payment records to `db.json`
