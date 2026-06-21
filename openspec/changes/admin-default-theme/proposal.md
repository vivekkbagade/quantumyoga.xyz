## Why

Currently, site-wide themes default strictly to Midnight Aura for guest users and newly registered users. Giving administrators control over the default system theme allows them to set a custom site-wide aesthetic (such as Ethereal Light or Zen Sunset) that applies to all unauthenticated users and new users, enhancing central customization control.

## What Changes

- Add a Default Theme configuration control (dropdown select) within the Admin dashboard panel.
- Save the configured default theme persistently in LocalStorage (under the key `qy_site_default_theme`).
- Automatically apply this admin-configured default theme for guest users/unauthenticated sessions on page load and logout.
- Apply the admin-configured default theme immediately to any logged-in user who does not have an overriding custom theme preference saved in their profile.

## Capabilities

### New Capabilities
- `admin-default-theme`: Allows administrative control over the default site-wide visual theme for guest users and users who have not set a custom preference.

### Modified Capabilities

## Impact

- Modifies `index.html` to add the system default theme selector dropdown in the Admin dashboard panel.
- Modifies `app.js` to process the default site-wide theme configuration, persist it in LocalStorage, and apply it dynamically.
