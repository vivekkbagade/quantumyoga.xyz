## Why

When a lead is converted to a member, they are registered with a temporary password. Currently, they can use this temporary password indefinitely, which poses a security risk. To secure user accounts, converted members must be forced to change their temporary password to a custom secure password upon their first login before they can access any platform dashboard features.

## What Changes

* **Temporary Password Tracking**: Add a `mustChangePassword` flag to the user account object. When a lead is converted to a member, this flag is set to `true`.
* **Forced Password Change Screen**: Upon login, if `mustChangePassword` is `true`, display a fullscreen change password overlay blocking all other sections.
* **Forced Password Update Logic**: The user must enter a new custom password (minimum 6 characters). Upon successful submission, update their password, set `mustChangePassword` to `false`, commit the update to the server (`db.json`), and grant dashboard access.

## Capabilities

### New Capabilities

- `force-password-change`: Enforce password change on first login with a temporary password.

### Modified Capabilities

- None

## Impact

* `index.html`: Add a fullscreen "Force Change Password" overlay `#force-change-password-overlay` with a form for entering the new password, a password confirmation field, validation messages, and a submit button.
* `app.js`: Update the lead conversion handler to set `mustChangePassword: true` on the new member record. Modify `checkSession` and `loginForm` submission logic to check this flag and intercept routing by showing the overlay. Add a submit handler for the change password form.
