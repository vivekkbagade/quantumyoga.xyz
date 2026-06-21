## Why

When a prospective student submits the landing-page inquiry form, or when the admin converts a lead into a member account, no confirmation email is sent. The inquiry submitter receives no acknowledgement, and the newly-converted member has no way of knowing their temporary password or next steps unless the admin communicates manually. Adding automated transactional emails at both these moments closes the communication gap and improves the first impression of the studio.

## What Changes

- **New**: `inquiry-received` email template — sent to the prospect immediately after they submit the landing-page inquiry form, confirming receipt and setting expectations
- **New**: `lead-converted` email template — sent to the new member immediately after admin converts the lead, containing their temporary password and a prompt to log in and change it
- **Modified**: Inquiry form submit handler — fires `sendTransactionalEmail("inquiry-received", …)` after saving the new lead
- **Modified**: Lead conversion handler (`convertLeadBtn` click) — fires `sendTransactionalEmail("lead-converted", …)` after the user account is created
- **Modified**: `buildTransactionalEmailBody()` — adds rendering for the two new template types

## Capabilities

### New Capabilities
- `inquiry-email-trigger`: Auto-send a confirmation email to the prospect on inquiry form submission
- `conversion-email-trigger`: Auto-send a welcome + credentials email to the newly converted member on lead conversion

### Modified Capabilities
*(None — requirements of existing capabilities are unchanged; these are additive hooks)*

## Impact

- **`app.js`**: Two `sendTransactionalEmail()` call sites added; `buildTransactionalEmailBody()` extended with two new branches
- **No new HTML or CSS** — UI is unchanged; emails are fire-and-forget side effects
- **No new dependencies** — uses the existing provider-agnostic `sendTransactionalEmail()` which routes through whichever email provider (Gmail or Resend) is configured
- **Requires email provider configured** — if neither Gmail is connected nor Resend is set up, the sends are gracefully skipped (matching existing transactional email behaviour)
