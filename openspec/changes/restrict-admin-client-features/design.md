## Context

Currently, the Quantum Yoga platform has an administrator account (`admin@quantumyoga.com`) that handles dashboard metrics, lead workflows, scheduling, and billing settings. However, the system does not differentiate navigation visibility cleanly in certain areas, allowing the admin account to access student profile panels and attempt class enrollments. This design introduces strict UI visibility rules and checks to keep admin activity centered solely on dashboard operations.

## Goals / Non-Goals

**Goals:**
- Hide header profile tabs and student sub-menus for administrative logins.
- Block client-only DOM renderers from running or seeding favorite checklists for administrative logins.
- Restrict mock booking event submissions from accepting admin credentials.

**Non-Goals:**
- Creating a complex user permission control list (RBAC) database schema; role restrictions will be determined using the unique administrator email check (`admin@quantumyoga.com`).

## Decisions

### 1. Header Navigation Display
- **Decision**: Update `updateUIForLogin()` to toggle visibility of `#nav-profile` to `display: none` and `#nav-admin` to `display: inline-block` when logged in as the admin. Regular users will experience the inverse.
- **Rationale**: Aligns UI layout with role capabilities immediately upon login.

### 2. Client View Render Bypass
- **Decision**: Bypass executing client rendering operations (`renderClientDashboard`, `renderStudentAppointments`, `renderClientBillingHistory`) if the active user is `admin@quantumyoga.com`.
- **Rationale**: Prevents DOM element lookup errors and redundant computation.

### 3. Student Action Gatekeeping
- **Decision**: Throw alert notifications or return early inside `saveAppointmentBtn` click handlers and batch change submissions if the active account email matches `admin@quantumyoga.com`.
- **Rationale**: Prevents dirtying database lists with non-student records.

## Risks / Trade-offs

- **[Risk]** If the admin manually types `#profile-section` in the URL, they might trigger the profile view container.
  - *Mitigation*: In the router hash change listener, redirect the admin to `#admin-section` if the hash is `#profile-section`.
