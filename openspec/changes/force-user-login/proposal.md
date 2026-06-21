## Why

Currently, the Quantum Yoga SPA allows guest users to see the landing page, poses directory, and guided routines directory without logging in. To ensure user privacy and enforce customized experiences, guest users should not be allowed to access any dashboard layout, directories, or headers. The application must display only a full-page login/registration view until authentication succeeds.

## What Changes

- Modify layout rendering behavior: if the user is unauthenticated, hide the landing page, header navigation, control panels, view toggle pills, and content section directories.
- Display a dedicated full-page authentication card (Login/Register tabs) in the center of the viewport for unauthenticated users.
- Upon successful registration or login, transition immediately to display the main header, nav, dashboard controls, and show the default content directory.
- Upon logging out, immediately tear down the dashboard components and return the viewport to the full-page authentication screen.

## Capabilities

### New Capabilities
- `force-user-login`: Enforces that unauthenticated users are presented only with a full-page login/registration view, restricting access to the dashboard until successful login.

### Modified Capabilities

## Impact

- Modifies `index.html` to restructure the `#auth-modal` or create a new dedicated `#auth-fullscreen` view.
- Modifies `app.js` to control visibility of layout wrappers based on the existence of an active user session.
- Modifies `index.css` to introduce styling rules for the full-screen authentication gate layout.
