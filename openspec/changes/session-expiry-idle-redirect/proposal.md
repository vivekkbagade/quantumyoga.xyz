## Why

The current application keeps the user logged in indefinitely because the session token stored in `localStorage` (`qy_session`) does not have an expiration. If a user is inactive/idle, their session remains active, creating a security risk. Furthermore, there is no route-level check on startup to enforce that direct links to protected views (like member profile/dashboard or admin sections) redirect unauthenticated users to the login/auth gate.

## What Changes

* **Session Expiry on Inactivity/Idle**: Automatically log out the user and redirect them to the auth gate if there has been no user activity (mouse movement, clicks, key presses, touch events) for a configurable duration of inactivity (e.g. 15 minutes).
* **Direct Access Route Guarding**: Check for an active session immediately on page load, and if the user attempts to directly access protected sections (e.g., `#admin-section` or `#profile-section`) without an active session, redirect them to the fullscreen auth gate and reset the URL hash.
* **Auto-redirect on Logout**: When a session expires or when the user logs out, clear the URL hash and redirect them to the login screen.

## Capabilities

### New Capabilities

- `session-management`: Covers idle session tracking, automatic logout, and route guarding for direct link access without a valid session.

### Modified Capabilities

- None

## Impact

* `app.js`: Implement activity listeners (mousemove, mousedown, keypress, scroll, click, touchstart) to track active state, update last-activity timestamp in `localStorage` or memory, and log out users when the idle duration is exceeded. Update initialization logic to check route hash and redirect to auth gate if no session is active.
