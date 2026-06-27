## Why

The standalone Email Center page (`admin-emails.html`) is rendered inside an iframe in the admin dashboard. Because it loads in its own browsing context, it does not automatically inherit theme toggles (e.g., Light or Sunset themes) applied to the parent dashboard. Synchronization is needed so that the Email Center matches the user's selected interface theme at all times.

## What Changes

- Implement startup theme checking and a `storage` listener inside `admin-emails.html` to apply the active theme loaded from localStorage.
- Implement postMessage dispatch in `app.js`'s `applyTheme()` to propagate parent theme changes to the iframe.
- Implement a postMessage message listener in `admin-emails.html` to toggle theme classes dynamically when changed in the parent dashboard.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `email-communication`: Ensure the embedded full-screen email client dashboard dynamically synchronizes its visual theme with the user's selected application theme.

## Impact

- **`app.js`**: Dispatch postMessage events inside `applyTheme()`.
- **`admin-emails.html`**: Retrieve active theme on startup and handle incoming postMessage events to update local document theme classes.
