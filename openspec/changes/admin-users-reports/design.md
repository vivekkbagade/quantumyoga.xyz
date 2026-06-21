## Context

The Quantum Yoga application currently supports client-side authentication, favoriting poses, and tracking routine completion logs using browser `LocalStorage`. However, there is no administrative dashboard or metrics tracking. We need to introduce an admin interface for overseeing user profiles, managing user accounts, and generating aggregate statistics.

## Goals / Non-Goals

**Goals:**
- Seed a default administrator account (`admin@quantumyoga.com` / `adminpass`) automatically in `LocalStorage` if it does not exist.
- Add an administrative view (`#admin-section`) with sub-tabs for User Management and Reports & Analytics.
- Render a user table listing all accounts (name, email, completed count, favorites count) with options to inspect a user's profile or delete their account.
- Allow viewing any user's profile in a read-only modal (showing their specific favorites and completion history).
- Display aggregate metrics cards: Total registered users, total routines completed, most popular routine, and most favorited pose.
- Display a unified chronological completion log showing completions across all user accounts.

**Non-Goals:**
- Backend integration or production security authentication.
- Modifying routines/poses databases dynamically.

## Decisions

### 1. Seeding Location
- **Decision**: Initialize the default admin user during the startup sequence in `app.js` (inside user storage initialization logic).
- **Rationale**: Ensures that the administrative credentials are ready for use immediately upon page load without manual database setup.
- **Alternative considered**: Requiring the administrator to register. Rejected because registration shouldn't allow regular users to gain administrative roles.

### 2. Profile Inspection
- **Decision**: Render inspected user profiles inside a modal overlay (`#admin-inspect-modal`), reusing the layout structure of the `#profile-section`.
- **Rationale**: Reuses design patterns and keeps code concise while keeping the admin dashboard layout clean.
- **Alternative considered**: Direct inline expansion in the user table. Rejected because tables get cluttered when displaying list history.

### 3. Analytics Computations
- **Decision**: Compute analytics dynamically in JS from the `qy_users` LocalStorage array whenever the Reports sub-tab is clicked.
- **Rationale**: Since all state is local, computing metrics on-the-fly ensures real-time accuracy with minimal overhead.
- **Alternative considered**: Storing summary analytics state. Rejected because keeping summary data synchronized with user deletions/additions adds unnecessary complexity.

## Risks / Trade-offs

- **[Risk]** Administrator accidentally deletes the admin account.
  - *Mitigation*: Prevent the admin user row in User Management from showing a "Delete" button.
- **[Risk]** Plaintext credentials in mock local database.
  - *Mitigation*: Add warning comments in the code highlighting that this is a mockup database for design verification.
