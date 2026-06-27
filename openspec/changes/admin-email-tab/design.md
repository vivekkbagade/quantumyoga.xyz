## Context

The Email tab buttons (`adminEmailTabBtn` on the administrator panel and `profileEmailTabBtn` on the student profile panel) are toggled dynamically on startup and status updates based on local configuration states. Because email setups now rely entirely on server-side environment variables and have no client-side configuration parameters, the client-side toggles evaluate to false, leaving the Email tab buttons invisible.

## Goals / Non-Goals

**Goals:**
- Ensure the Email sub-navigation tab buttons on both student and administrator interfaces are always displayed.

**Non-Goals:**
- Allowing configuration settings UI to be toggled.

## Decisions

- **Remove Visibility Toggles**: Instead of conditionally modifying the `style.display` of `adminEmailTabBtn` and `profileEmailTabBtn` based on local settings parameters, the visibility rules will be removed or hardcoded to display (`inline-flex` or default CSS stylesheet rules). This ensures both tab triggers are permanently visible and functional.

## Risks / Trade-offs

- **[Risk]**: Showing tabs when mail configuration is completely missing on the server will display non-functional interfaces.
  - *Mitigation*: The email controllers show clear error states or user alerts on failed sends, which is acceptable since the server environment variables should be correctly configured.
