## Context

The site's global styles rely on custom stylesheet definitions triggered by classes `.theme-light` or `.theme-sunset` placed on the root HTML element (`document.documentElement`). Because `admin-emails.html` loads within an iframe on `index.html`, it maintains a separate document context and stylesheet scope. We need a two-way synchronization mechanism (direct cross-document message dispatching and storage checking) to align themes.

## Goals / Non-Goals

**Goals:**
- Enable visual theme inheritance in `admin-emails.html` matching the parent document's choice.
- Support real-time synchronization when the theme is changed in the parent dashboard.

**Non-Goals:**
- Creating custom theme controls inside the iframe itself.

## Decisions

- **PostMessage + LocalStorage synchronization**: 
  - **On Load**: `admin-emails.html` will check localStorage key `qy_site_default_theme` and look up the current active session user's configuration to apply theme classes on boot.
  - **On Update**: `app.js`'s `applyTheme` method will dispatch a cross-document message (`THEME_CHANGE`) to `iframe.contentWindow` whenever a user changes the theme dropdown.

## Risks / Trade-offs

- **[Risk]**: PostMessage calls may execute before the iframe's content has loaded.
  - *Mitigation*: The iframe reads `localStorage` theme state immediately on document load, which guarantees proper rendering regardless of when the postMessage is delivered.
