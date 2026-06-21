## Context

The Quantum Yoga website is currently a client-side Single Page Application (SPA). To support registration, authentication, favoriting poses, and tracking completed routines, we need to introduce user state management. A backend system is out of scope, so all data storage and sessions must live entirely on the client (using browser LocalStorage). We must design HTML modal panels for authentication, a custom Profile view tab, and Javascript bindings to load and save user data structures.

## Goals / Non-Goals

**Goals:**
- Implement client-side user registration, login, and logout state flows in `app.js`.
- Persist multiple registered users and their session data (history and favorites) in LocalStorage.
- Add an interactive "Favorite" heart icon button on pose cards that toggles active favorites.
- Add a new "Profile" navigation tab and container displaying user metrics, favorites, and routine history.
- Update the navigation header layout dynamically to toggle login/logout buttons.

**Non-Goals:**
- Integrating a backend database or authentication server.
- Implementing production-grade security measures like password hashing, tokens, or OAuth.
- Modifying video playbacks or media assets.

## Decisions

### 1. Client-Side Data Schema
- **Decision**: Define a local user database under key `qy_users` and session under `qy_session`.
  - User structure: `{ name, email, password, favorites: [], routineHistory: [] }`
- **Rationale**: Simple client-side JSON serialization that offers persistent favorites and history.
- **Alternative considered**: Memory-only session state. Rejected because it would clear user settings and history on page refresh.

### 2. Profile Navigation Integration
- **Decision**: Add a new navigation link `nav-profile` and tab pill `tab-profile-btn`, extending `app.js`'s existing SPA tab controller (`setTab("profile")`).
- **Rationale**: Maximizes code reuse of the SPA tab selector already built.
- **Alternative considered**: Redirecting to a separate page. Rejected because it breaks the single-page flow and disrupts any active custom video overlays.

### 3. Star/Heart Toggle on Poses Cards
- **Decision**: Place an absolutely positioned heart button `.pose-fav-btn` inside `.card-badge-group` of each pose card.
- **Rationale**: Fits natively within the layout and provides instant client-side feedback.

## Risks / Trade-offs

- **Risk**: Storing passwords in cleartext in browser LocalStorage.
  - *Mitigation*: This is a prototype/demonstration application; we will not use real-world passwords. A warning comment will be added to the code.
- **Risk**: Dynamic elements (like favorites toggle) being clicked before authentication.
  - *Mitigation*: Clicking the favorite icon when logged out will automatically trigger and open the registration/login modal.
