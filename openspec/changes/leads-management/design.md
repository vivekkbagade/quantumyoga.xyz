## Context

The Quantum Yoga platform needs a mechanism to capture interest from prospective members and manage follow-ups. We will introduce a new public tab on the landing gate for inquiries and a lead management portal for administrators, supporting status transitions, follow-up logging, and auto-conversion to user accounts.

## Goals / Non-Goals

**Goals:**
- Add an "Inquire" tab and form inside the public fullscreen auth gate card.
- Persist captured inquiries in LocalStorage under the key `qy_leads`.
- Add a "Leads Pipeline" sub-tab and dashboard table in the Admin Console.
- Allow administrators to log follow-up notes, update pipeline statuses, and auto-register leads as members.

**Non-Goals:**
- Sending email/SMS notifications directly (handled as local simulations/logs).

## Decisions

### 1. Inquire Tab on Auth Gate
- **Decision**: Add an "Inquire" tab switcher to the public `#auth-gate-fullscreen` container next to the "Login" and "Register" switchers.
- **Rationale**: Reuses the existing glassmorphic auth card, keeps public options integrated, and avoids launching a separate contact page.

### 2. Flat Log History Structure
- **Decision**: Store a dated `logs` history array inside each lead object: `logs: [{ timestamp, note }]`.
- **Rationale**: Provides a chronological history of client nurturing steps directly on the lead record.

### 3. Automated Registration Conversion
- **Decision**: Clicking "Convert to Member" will auto-create a user record in `qy_users` with password `"welcome123"`. The lead's status is shifted to `"converted"`.
- **Rationale**: Drastically reduces administrative entry friction by moving lead details directly into the student table.

## Risks / Trade-offs

- **[Risk]** Spammers submitting empty/blank inquiry forms.
  - *Mitigation*: Enforce browser-native HTML5 input validation (`required` attribute) on name, email, and message inputs.
