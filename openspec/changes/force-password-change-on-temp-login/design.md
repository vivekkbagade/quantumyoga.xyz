## Context

The application creates temporary passwords when converting leads. Allowing users to use temporary passwords indefinitely is insecure. We will track whether a user is using a temporary password using a boolean flag `mustChangePassword` and enforce a password change at first login using a fullscreen overlay gate.

## Goals / Non-Goals

**Goals:**
* Track temporary password state on user profiles.
* Update lead conversion to initialize `mustChangePassword` to `true`.
* Intercept session verification on startup and successful login to show a fullscreen "Force Change Password" overlay if the flag is `true`.
* Implement form validation and database persistence for password updates.

**Non-Goals:**
* Implementing email verification or password reset links (handled in a separate change).

## Decisions

### 1. Database Schema Extension
* **Flag:** Add `mustChangePassword: true` on user objects created during lead conversion.
* **Initialization:** Update the lead conversion handler in `app.js` to set:
  ```javascript
  const convertedUser = {
    ...
    mustChangePassword: true,
    ...
  };
  ```

### 2. Fullscreen Interrupt Overlay
* **HTML Element:** Add `#force-change-password-overlay` to `index.html`. It will behave like `#auth-gate-fullscreen`.
* **Flow Interception:** In `checkSession()` and the login form submit handler:
  - If a user successfully authenticates and has `mustChangePassword === true`:
    - Hide the main dashboard (`#dashboard-app`).
    - Hide the login screen (`#auth-gate-fullscreen`).
    - Show the `#force-change-password-overlay`.
    - Block access until they submit a valid new password.

### 3. Change Password Submission Logic
* **Validation:** New password must be at least 6 characters.
* **Saving:** Upon validation success:
  - Update password in the user record.
  - Set `mustChangePassword = false`.
  - Save to `localStorage` and invoke `saveToServer()`.
  - Hide the overlay, show `#dashboard-app`, and call `updateUIForLogin()`.

## Risks / Trade-offs

* **[Risk]** A user could reload the page to bypass the gate.
  * **[Mitigation]** `checkSession()` executes on page load and checks `mustChangePassword` on the loaded profile, re-enforcing the gate immediately.
