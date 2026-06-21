## Why

Currently, users who forget their passwords have no self-service option to reset them or retrieve a temporary one, which creates a friction point requiring direct administrator intervention. Additionally, visitors must manually log in every time they visit the website because there is no "Remember Me" option to persist their session across browser restarts.

## What Changes

* **Forgot Password Link & Modal**: Add a "Forgot Password" link on the login form that opens a temporary password reset modal.
* **Temporary Password Reset**: Allow users to input their registered email in the forgot password modal to receive/display a new generated temporary password, updating the user record in `db.json` and logging the action.
* **Remember Me Checkbox**: Introduce a "Remember Me" checkbox in the login form. If checked, the session token will be saved in `localStorage` persistently. If unchecked, the session token will be stored in `sessionStorage` instead, meaning it expires when the browser tab/session is closed.

## Capabilities

### New Capabilities

- `forgot-password`: Allow self-service password reset with temporary password generation.
- `remember-me-session`: Allow users to persist their login session across browser restarts.

### Modified Capabilities

- None

## Impact

* `index.html`: Add a "Forgot Password" link, a "Forgot Password" modal overlay with email input and success messaging, and a "Remember Me" checkbox in the login form.
* `app.js`: Implement event handlers for modal display, temporary password reset submission, and update session storage logic to toggle between `localStorage` and `sessionStorage` depending on the "Remember Me" checkbox.
