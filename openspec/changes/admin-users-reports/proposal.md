## Why

Currently, Quantum Yoga only has user-facing views for registration, profile management, and routine/pose directory interactions. There is no mechanism for administrators to oversee registered users, inspect individual user profiles (favorites, routine history), or view aggregate engagement metrics and engagement reports. Adding administrative oversight is essential to understand usage trends and manage user accounts.

## What Changes

- Introduce a new special administrative user account (`admin@quantumyoga.com`) that is initialized automatically if it doesn't exist.
- Add an "Admin Panel" tab/navigation link in the header, visible only to authenticated administrator users.
- Implement an administrative view/dashboard (`#admin-section`) featuring two main sub-panels:
  - **User Management**: A table displaying all registered users (name, email, stats) with controls to view individual profiles (viewing their favorites/history) and delete users.
  - **Reports & Analytics**: Aggregate engagement reports (e.g., total registrations, popular routines, most favorited poses, and a log of all routine completions).

## Capabilities

### New Capabilities
- `admin-dashboard`: Establishes the administrator dashboard containing user account oversight, user-specific profile inspection, and user engagement report generation.

### Modified Capabilities

## Impact

- Modifies `index.html` to add the `#admin-section` panel, sub-tabs for User Management and Analytics, and header nav updates.
- Modifies `app.js` to seed the admin account, manage admin session rendering, construct the admin-only interface, and handle user deletion and data compilation.
- Modifies `index.css` to add premium glassmorphic styling for tables, analytics graphs/metrics cards, and admin tab navigations.
