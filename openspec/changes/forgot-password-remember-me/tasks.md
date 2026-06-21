## 1. UI Implementation

- [x] 1.1 Add a "Forgot Password?" text link element in `index.html` within the login form
- [x] 1.2 Add the forgot password modal overlay (`#forgot-password-modal`) structure to `index.html` matching existing modal layouts
- [x] 1.3 Add a "Remember Me" checkbox input (`#login-remember`) inside the login form in `index.html`

## 2. Logical Core Implementation

- [x] 2.1 Bind modal toggling event listeners to control display and closure of the forgot password modal in `app.js`
- [x] 2.2 Implement the forgot password submission event listener in `app.js` to process email verification, generate temporary passwords, update database records, and call `saveToServer()`
- [x] 2.3 Modify the login form submit handler to verify the "Remember Me" checkbox and conditionally save the session to either `localStorage` or `sessionStorage`
- [x] 2.4 Update session initialization (`checkSession`) and logout (`updateUIForLogout`) to correctly check and clear session tokens from both storages

## 3. Verification

- [x] 3.1 Verify that the forgot password modal successfully resets registered user passwords, updates `db.json`, and allows logging in with the new credentials
- [x] 3.2 Verify that submitting an unregistered email address displays a proper "Email address not found" validation message
- [x] 3.3 Verify that logging in with "Remember Me" checked persists the session token in `localStorage`, whereas logging in with it unchecked stores it in `sessionStorage` only
