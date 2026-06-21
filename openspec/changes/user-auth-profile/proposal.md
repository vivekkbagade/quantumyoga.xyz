## Why

Currently, Quantum Yoga operates with static views and a global database of poses and routines. To make the application personal and interactive, users need a way to register an account, log in securely, and view/customize their profile (such as tracking completed routines, setting layout preferences, and saving favorite poses). Introducing authentication and profiles will make the website dynamic and user-centric.

## What Changes

- Add a glassmorphic User Registration and Login modal window.
- Implement client-side session management and user data persistence using browser LocalStorage.
- Add a dedicated "Profile" view and navigation tab in the main layout.
- Introduce interactive "Favorite" toggle controls on pose cards.
- Display personalized metrics on the Profile tab, including routine completion history and total active minutes.

## Capabilities

### New Capabilities
- `user-auth-profile`: Establishes the user authentication workflows (register, login, logout), dynamic session state handling, and customized user profiles.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Modifies `index.html` to include navigation links, the Profile section panel, and modal auth forms.
- Modifies `app.js` to handle registration, login/logout, state variables, pose favoriting, and local storage updates.
- Modifies `index.css` to styling authentication forms, buttons, and user profile panels.
