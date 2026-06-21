## Why

Currently, when the administrative user (`admin@quantumyoga.com`) logs in, they are shown student-facing UI elements such as class scheduling, practice logs, wellness trackers, and goals. Since the administrator's sole role is platform management (and they do not enroll in classes or track personal yoga practice), showing these panels is redundant and cluttering. This change ensures that the admin view is focused purely on administrative capabilities.

## What Changes

- Hide the **Profile** tab in the main header for the administrator.
- Exclude student-specific sub-panels (My Practice Log, Wellness Center, Appointments) from being accessed by the admin.
- Restrict scheduling features, favorites list seeding, and class/batch enrollments from operating on the admin email address.
- Keep the interface clean and targeted only to dashboard settings, metrics, and administration panels.

## Capabilities

### New Capabilities
- `admin-client-restrictions`: Excludes client-facing logs, schedules, and dashboards for the administrative user role.

### Modified Capabilities
- None

## Impact

- **index.html**: Navbar display logic for header tabs when admin logs in.
- **app.js**: DOM initializations and renderers (`updateUIForLogin`, `renderClientDashboard`, etc.) that handle layout logic based on the user's role.
