## 1. Clean Up Admin Settings UI

- [x] 1.1 Remove the Email Provider card from the Settings tab inside `index.html`.
- [x] 1.2 Disable client-side event listeners and saving handlers for Resend and Gmail credentials in `app.js`.

## 2. Hardcode Configuration Check Logic

- [x] 2.1 Update status checking inside `app.js` (`updateEmailProviderStatusUI`, inbox renderers) to hardcode `resendConfigured = true`.
- [x] 2.2 Update student email tab checking in `app.js` (`renderStudentEmailTab`) to assume `resendConfigured = true` is active.

## 3. Fallback Send Configuration

- [x] 3.1 Modify compose/reply email submit handlers in `admin-emails.html` to transmit empty string credential fields (`apiKey: ""` and `from: ""`) to leverage server environment defaults.
- [x] 3.2 Run local production compilation using `npm run build` and verify that the app compiles and is ready for remote deployment.
