## Context

Currently, the visual theme defaults to "Midnight Aura" (dark mode) for all guest users and newly registered users. There is no central configuration allowing administrators to change the default theme site-wide. We need to introduce an administrative system default theme selector within the Admin control panel that persists the default theme choice, applying it dynamically to guest users and users who haven't saved a custom preference.

## Goals / Non-Goals

**Goals:**
- Add a "System Settings" sub-panel in the Admin control panel with a "System Default Theme" selector.
- Persist the selected default theme in LocalStorage under the key `qy_site_default_theme` (defaulting to `midnight` if empty).
- Dynamically apply the site default theme to all guest users and unauthenticated sessions on load/logout.
- Fallback user preference checks to the site default theme for any user who does not have an explicit `theme` choice saved in their user object.

**Non-Goals:**
- Modifying visual themes or adding new styles beyond the existing ones (Midnight Aura, Ethereal Light, Zen Sunset).
- Allowing non-admin users to change site-wide configuration.

## Decisions

### 1. Dedicated System Settings Sub-Tab
- **Decision**: Add a new sub-tab named "System Settings" in the Admin interface next to "User Management" and "Reports & Analytics".
- **Rationale**: Keeps settings clean, separate from operational data like reports and user logs, and follows the existing tab-switching architecture.

### 2. User Theme Customization Fallback
- **Decision**: Set the theme field on registration to an empty string (`theme: ""`) or leave it undefined to signify "System Default". When loading a user profile, apply `user.theme || getSiteDefaultTheme()`.
- **Rationale**: If the administrator changes the default theme, all users who have not explicitly customized their theme preference will automatically adopt the new site-wide theme. Once a user selects a custom preference in their profile tab, it overrides the default.

## Risks / Trade-offs

- **[Risk]** The site-wide default theme doesn't apply instantly to guest pages or when logged out.
  - *Mitigation*: Ensure `checkSession()` and `updateUIForLogout()` explicitly invoke `applyTheme(getSiteDefaultTheme())`.
