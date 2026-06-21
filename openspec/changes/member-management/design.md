## Context

Currently, the student profiles are limited to name, email, and completion histories. There is no central tracking of membership levels or student wellness logs. We need to design a member management system mapping tiers, statuses, expiration dates, goals, and health logs directly to user accounts in LocalStorage.

## Goals / Non-Goals

**Goals:**
- Extend the user model structure in LocalStorage to include membership metadata, goals, and health logs.
- Add a wellness goals and health history form on the student Profile tab.
- Integrate membership tier selects, status toggles, expiry inputs, and coaching logs inside the Admin inspect modal.

**Non-Goals:**
- Integrating payment processing APIs or recurring subscription gateways.

## Decisions

### 1. User Model Schema Extension
- **Decision**: Extend each user object in `qy_users` to include a nested `membership` object (`tier`, `status`, `expiryDate`, `notes`) and flat string parameters `goals` and `healthNotes`.
- **Rationale**: Keeps the student profile records consolidated, preventing multi-table lookup delay in mockups.

### 2. Auto-Seeding Membership Details on Registration
- **Decision**: Automatically seed newly registered users with a `Basic` membership tier, `Active` status, an expiry date calculated at `current date + 30 days`, and blank wellness fields.
- **Rationale**: Establishes a predictable starting state for all new accounts without forcing immediately complex administrative configuration.

## Risks / Trade-offs

- **[Risk]** Data model incompatibility for legacy test accounts created prior to this change.
  - *Mitigation*: Fallback default parameters dynamically inside the `loadUsers()` and session checks if membership parameters are missing.
