## Context

The Quantum Yoga application currently relies on a persistent session stored in `localStorage` under the key `qy_session`. This session has no expiration, meaning users remain logged in indefinitely unless they explicitly click "Logout". Additionally, visitors can manually type protected URL hashes like `#admin-section` or `#profile-section` to navigate to those views, and if they lack a session, the app does not properly redirect them to the authentication gate.

## Goals / Non-Goals

**Goals:**
* Implement automatic session expiration after 15 minutes of user inactivity (idle time).
* Prevent direct access to protected URL hashes (`#admin-section` and `#profile-section`) for unauthenticated visitors by redirecting them to the login form.
* Ensure explicit logouts redirect users cleanly and clear any active protected URL hashes.
* Provide a testable mechanism to verify idle timeouts quickly (e.g., via a query parameter `?idleTest=1` reducing the timeout to 10 seconds).

**Non-Goals:**
* Implementing server-side session expiration or token validation (as this is a mock database frontend client).
* Changing how user profiles or membership data are managed.

## Decisions

### 1. Inactivity Monitoring Event Listeners
We will attach global event listeners at the `document` level to track user activity.
* **Events to listen to:** `mousemove`, `mousedown`, `keypress`, `scroll`, `click`, `touchstart`.
* **Behavior:** Any of these events will update a `qy_last_activity` timestamp stored in `localStorage`. Using `localStorage` ensures that idle tracking works consistently across page refreshes.
* **Interval Checker:** A periodic `setInterval` check running every 5 seconds will compare `Date.now()` against `qy_last_activity`. If the delta exceeds 15 minutes (or 10 seconds if `?idleTest=1` is present in the URL), the session will be terminated.

### 2. Route Guarding via URL Hash Checks
We will implement route guards by checking `window.location.hash` and the `hashchange` event.
* **Initialization Check:** During initialization (after checking the session), we check if `window.location.hash` contains `#admin-section` or `#profile-section`.
* **Guard Action:** If a protected route hash is present but `localStorage.getItem("qy_session")` is null/empty, we:
  1. Clear the hash using `window.location.hash = ""` or `history.replaceState(null, null, " ")`.
  2. Call `openAuthModal()` to display the login screen and lock the dashboard.
* **Hash Change Listener:** Add an event listener for `hashchange` to handle manual URL edits during a browsing session.

### 3. Clean Redirection on Logout
Modify the logout click handler and the automatic session expiration function to:
1. Clear the active session token from `localStorage`.
2. Clear the active URL hash so the user is not left on a protected hash.
3. Open the auth modal to display the login screen.

## Risks / Trade-offs

* **[Risk]** Heavy CPU overhead from frequent activity listeners (e.g., `mousemove` fires continuously).
  * **[Mitigation]** Throttle/debounce the activity handler so that it only writes to `localStorage` at most once every 2 seconds.
* **[Risk]** Testing a 15-minute timeout is slow and tedious during verification.
  * **[Mitigation]** Implement a query parameter check `?idleTest=1` that sets the idle timeout limit to 10 seconds, enabling fast automated or manual testing.
