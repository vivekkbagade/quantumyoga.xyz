## Context

Currently, the Quantum Yoga SPA allows guest users to see the landing page, poses directory, and guided routines directory without logging in. We need to introduce an authentication gate where unauthenticated users can only see a login/registration view, and cannot access the main application dashboard until they log in.

## Goals / Non-Goals

**Goals:**
- Hide all dashboard layout elements (header, main, hero, footer) when there is no active user session.
- Render a fullscreen authentication card in the center of the viewport for unauthenticated users.
- Toggle between fullscreen login/registration and regular dashboard seamlessly upon authentication state changes (login, registration, logout).

**Non-Goals:**
- Modifying authentication logic or stored user structure in LocalStorage.

## Decisions

### 1. Fullscreen Gate View vs Modal Hack
- **Decision**: Introduce a wrapper `#dashboard-app` around all standard layout elements, and a separate `#auth-gate-fullscreen` container. Show only one of them based on authentication state.
- **Rationale**: Completely hides dashboard components from unauthenticated view, preventing guest users from inspecting or interacting with the page.
- **Alternative considered**: Forcing the existing `#auth-modal` to remain open and disabling the close button. Rejected because the guest can still see the background page behind the overlay.

### 2. Styling Approach
- **Decision**: Style `#auth-gate-fullscreen` as a full-viewport layout using flex centering with the glassmorphic card design matching the rest of the application.
- **Rationale**: Provides a premium first impression upon landing, aligning with the visual identity.

## Risks / Trade-offs

- **[Risk]** Autocomplete credentials or session check causing a flicker on load.
  - *Mitigation*: The session check (`checkSession()`) is executed synchronously on script initialization to set layout display before rendering frames.
