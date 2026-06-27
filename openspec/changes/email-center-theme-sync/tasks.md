## 1. Implement Theme Dispatcher in Parent

- [x] 1.1 Update `applyTheme(themeName)` in `app.js` to dispatch a `THEME_CHANGE` postMessage event to the active `admin-emails.html` iframe window.

## 2. Implement Theme Receiver in Standalone Page

- [x] 2.1 Add theme check on startup, cross-window storage event listener, and postMessage event listener in `admin-emails.html` to toggle theme classes (`theme-light`, `theme-sunset`) on the root document.

## 3. Rebuild and Verification

- [x] 3.1 Compile the production bundle using `npm run build`.
