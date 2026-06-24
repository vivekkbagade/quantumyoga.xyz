## Why

To drive organic membership growth, the studio wants to introduce a referral program where existing students can invite friends using unique referral codes. To incentivize multiple invites, the earned discount scales up incrementally based on the number of successful referrals, configurable directly by administrators.

## What Changes

* **Admin Referral Configurations**: Administrators can define and customize discount scaling tiers (e.g., 1 referral = 10% discount, 2 referrals = 15% discount, 3+ referrals = 20% discount) inside the System Settings panel.
* **Unique Referral Codes**: Every registered student is assigned a unique, shareable referral code displayed in their profile portal alongside their active referral count and current unlocked discount tier.
* **Referral Entry Point**: Adds a "Referral Code" optional field to both the student registration form and the public inquiry form.
* **Referral Count Increment**: When a new user registers using a valid referral code, the referrer's successful referral count is incremented, immediately recalculating their discount tier.
* **Referral Discount Application**: Automatically applies the referrer's earned discount percentage to any new billing invoices or appointment coaching fees issued to them.

## Capabilities

### New Capabilities
- `student-referrals`: Covers referral code generation, registration referral validation, dynamic discount tier calculations, and automated billing discount deductions.

### Modified Capabilities
<!-- No requirement changes to existing specs, purely adding new capabilities -->

## Impact

* **Frontend**: `index.html` (registration form inputs, dashboard referral stats display, admin referral tiers settings card) and `app.js` (validation, configuration handlers, profile calculations).
* **Backend**: `server.js` state persistence (`db.json`/SQL state variables) to store the referral codes, referrer mappings, and admin discount tier settings.
