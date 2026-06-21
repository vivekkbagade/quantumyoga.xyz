## Why

Currently, Quantum Yoga lacks any capability for managing membership tiers (e.g. Basic, Premium) or recording student-specific profiles such as personal yoga goals and injury history. Adding a member management system allows administrators to track membership statuses and personalize student experiences, building stronger community relationships.

## What Changes

- **Membership Tier & Status Tracking**: Add fields to define membership levels (Basic, Premium, VIP) and status (Active, Paused, Expired) for each student.
- **Personal Yoga Goals & Health Logs**: Allow students to record and update their personal wellness goals and physical/injury notes inside their Profile tab.
- **Admin Member Customization**: Enhance the Admin User Management panel to let administrators edit student membership tiers, change expiry dates, and write instructor-facing notes.

## Capabilities

### New Capabilities
- `member-management`: Allows tracking membership tiers, status, and expiry, while enabling students to set personal yoga goals and instructors to log coaching notes.

### Modified Capabilities

## Impact

- Modifies `index.html` to inject membership badges, goals forms in student Profile cards, and membership settings in the Admin user inspect modal.
- Modifies `app.js` to store membership data (status, tier, expiry, goals, notes) within user profile objects in LocalStorage.
