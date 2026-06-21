## 1. UI Implementation

- [x] 1.1 Add the `#force-change-password-overlay` fullscreen container with new password inputs, confirmation field, validation feedback block, and submit button in `index.html`

## 2. Core Implementation

- [x] 2.1 Update the lead conversion user registration logic in `app.js` to assign `mustChangePassword: true` to the created member account
- [x] 2.2 Update the `checkSession` and login form submission logic in `app.js` to intercept authentication, display the force change password overlay, and block standard dashboard visibility if `mustChangePassword === true`
- [x] 2.3 Implement the change password form submit listener in `app.js` to validate the new password (minimum 6 characters), update the password field in the user database, set `mustChangePassword: false`, execute `saveToServer()`, and proceed to the dashboard

## 3. Verification

- [x] 3.1 Verify that logging in with a newly converted lead's temporary password immediately triggers the fullscreen password change gate
- [x] 3.2 Verify that trying to save a password shorter than 6 characters yields a proper validation error message and keeps the gate active
- [x] 3.3 Verify that submitting a valid password correctly updates the user profile, updates the mock server (`db.json`), and redirects to the student dashboard
