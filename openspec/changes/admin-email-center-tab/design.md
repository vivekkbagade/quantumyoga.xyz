## Context

Currently, the admin portal's "Email Inbox" tab completely replaces the old inline split layout with the fullscreen `admin-emails.html` iframe. To support both interfaces, we will:
1. Revert `#admin-email-panel` back to its original inline layout (compose, inbox, sent, preview dialogs).
2. Create a new independent sub-tab panel `#admin-email-center-panel` that contains the iframe.
3. Wire both sub-tab button triggers inside the admin sub-navigation bar and tab switching logic in `app.js`.

## Goals / Non-Goals

**Goals:**
- Add a new tab `admin-email-center-tab-btn` and display panel `admin-email-center-panel`.
- Restore the original HTML composition, inbox lists, and preview cards inside `index.html`.
- Wire up tab click listeners for both panels in `app.js`.

**Non-Goals:**
- Modifying student portal tabs.

## Decisions

- **Keep UI distinct**: The original tab is labeled "Email Inbox" (for quick inline messaging), and the new tab is labeled "Email Center" (for folder navigation and list preview splitting). Both are managed side-by-side using the standard `setAdminSubTab` controller.

## Risks / Trade-offs

- **[Risk]**: Restoring the deleted inline elements may introduce syntax conflicts if handlers were not completely clean.
  - *Mitigation*: Ensure all form listeners (e.g. `adminComposeEmailForm`) check for element existence (`if (adminComposeEmailForm) { ... }`) to avoid null pointer reference errors on pages where they do not load.
