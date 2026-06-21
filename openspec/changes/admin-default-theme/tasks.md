## 1. UI Implementation

- [x] 1.1 Add the "System Settings" sub-tab button `#admin-settings-tab-btn` and settings panel `#admin-settings-panel` (with default theme dropdown selector `#admin-default-theme-select`) to the admin section in `index.html`.

## 2. Logic & Controller Integration

- [x] 2.1 Bind DOM elements for `adminSettingsTabBtn`, `adminSettingsPanel`, and `adminDefaultThemeSelect` in `app.js`.
- [x] 2.2 Extend the `setAdminSubTab(panelName)` function in `app.js` to support tab-switching logic for the "settings" panel.
- [x] 2.3 Implement the `getSiteDefaultTheme()` utility function and update new user registration data to save an empty string theme option (`theme: ""`) signifying inheritance of site defaults.
- [x] 2.4 Update `checkSession()`, `updateUIForLogin()`, and `updateUIForLogout()` to dynamically retrieve and apply `getSiteDefaultTheme()` when no custom user preference is present.
- [x] 2.5 Bind the change listener for `#admin-default-theme-select` to write selection updates to LocalStorage under the key `qy_site_default_theme` and re-apply styles in real-time.

## 3. Verification

- [x] 3.1 Verify admin-initiated default theme shifts save correctly in LocalStorage.
- [x] 3.2 Verify dynamic system-wide styling fallback changes for guests, unregistered sessions, and logged-in users who do not have custom overrides.
