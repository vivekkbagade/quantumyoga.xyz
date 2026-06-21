## Context

Quantum Yoga Studio's `app.js` has an established transactional email infrastructure:

- `sendTransactionalEmail(template, data, toEmail)` — provider-agnostic dispatcher that routes to either `gmailSendEmail()` or `resendSendEmail()` depending on `emailSettings.provider`
- `buildTransactionalEmailBody(template, data)` — returns branded HTML for a given template key (`welcome`, `invoice`, `appointment`)
- Existing triggers: invoice issuance, appointment booking, appointment cancellation, batch enrollment

The two new triggers follow the exact same pattern. No new infrastructure is needed.

**Inquiry form** (`inquireForm` submit handler, line ~2365 in `app.js`): currently saves a lead and shows a success message — no email.

**Lead conversion** (`convertLeadBtn` click handler, line ~4959): creates a new user with a generated temporary password and logs the conversion — no email.

## Goals / Non-Goals

**Goals:**
- Fire `sendTransactionalEmail("inquiry-received", …)` after the new lead is saved in the inquiry form handler
- Fire `sendTransactionalEmail("lead-converted", …)` after the user account is created in the lead conversion handler, passing the generated temporary password
- Add `"inquiry-received"` and `"lead-converted"` branches to `buildTransactionalEmailBody()` with Quantum Yoga branded HTML
- Both sends are gracefully silent if no email provider is configured

**Non-Goals:**
- Admin notification email when a new inquiry arrives (admin sees the lead in the pipeline UI)
- Email re-send button in the UI
- Storing email send status on the lead/user record

## Decisions

### 1. Template keys: `"inquiry-received"` and `"lead-converted"`

**Decision**: Use these exact string keys in `buildTransactionalEmailBody()` and `sendTransactionalEmail()` subject map.

**Rationale**: Consistent with existing snake-case pattern. Short and self-documenting.

---

### 2. Pass `generatedPassword` in the `lead-converted` email data

**Decision**: The conversion handler already generates `generatedPassword` and logs it in the lead timeline. The same value is passed as `data.tempPassword` to the email template.

**Risk**: Temporary password appears in email in plaintext. This is intentional — the member must receive it to log in. `mustChangePassword: true` ensures they change it on first login.

---

### 3. Inquiry email recipient is the **submitter's email** (not the admin)

**Decision**: `sendTransactionalEmail("inquiry-received", …, newLead.email)` — the confirmation goes to the prospect.

**Rationale**: The admin already sees the new lead appear in the Leads Pipeline; they don't need a separate email. The prospect needs the acknowledgement to know their message was received.

---

### 4. `buildTransactionalEmailBody` for `lead-converted` includes login link

**Decision**: Include a direct link to the app (`window.location.origin` or a hardcoded anchor) so the new member can navigate straight to login. Since this is a client-side SPA without a backend URL config, use a generic "Visit our website" CTA that resolves to the current origin.

---

### 5. Fire-and-forget — no await blocking the UI

**Decision**: Both `sendTransactionalEmail` calls use `await` (matching existing callers) but the UI flow (success message, form reset, modal refresh) is not gated on the email result.

**Rationale**: Email delivery failure should never block the lead/conversion save. The data is already persisted before the email attempt.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Email provider not configured — sends silently skipped | `sendTransactionalEmail()` already handles this gracefully with a console warning |
| Prospect enters a fake email address in the inquiry form | Email bounces silently; no change needed — this is acceptable |
| `lead-converted` email exposes temp password | Expected and necessary for member onboarding; `mustChangePassword` enforces immediate change |
| Duplicate inquiry submission sends duplicate emails | Existing form has no deduplication; a second submission creates a second lead, both get emails — acceptable for now |
