## Context

The Quantum Yoga application operates as a single-page application (SPA) backed by an Express server that stores a unified state object (`db.json` / PostgreSQL / Supabase). To implement referrals, we must extend the global database schema and introduce logic for registration validation and billing discount calculations.

## Goals / Non-Goals

**Goals:**
* Define configurable discount tiers inside the database configuration.
* Automatically generate unique, easy-to-share referral codes for students.
* Increment the referrer's referral count when a new user registers using their code.
* Dynamically display referral stats on the user's dashboard profile.
* Deduct the calculated discount percentage from student invoices and coaching booking fees.

**Non-Goals:**
* Implementing multi-tier or nested referral networks (MLM). Only direct, single-level referrals are rewarded.
* Supporting cash payouts or bank transfers. Rewards are strictly discount credits applied directly to billing.

## Decisions

### 1. Referral Code Generation Scheme
* **Choice**: Generate a 6-character alphanumeric uppercase code (e.g., `FLOW79`) when a student registers.
* **Rationale**: Shareable codes are more user-friendly than long UUIDs and preserve privacy compared to email-based referral links.
* **Alternatives Considered**: Using the student's email as their code. Rejected due to email privacy concerns.

### 2. Schema Structure
* **Choice**: Add configuration fields directly to the state schema.
  * **Global Settings**:
    ```javascript
    referralTiers: [
      { minReferrals: 1, discount: 10 },
      { minReferrals: 2, discount: 15 },
      { minReferrals: 3, discount: 20 }
    ]
    ```
  * **User Object Extension**:
    ```javascript
    {
      name: "...",
      email: "...",
      referralCode: "FLOW79",
      referredBy: "referrer@email.com" || null,
      referralsCount: 0
    }
    ```
* **Rationale**: Storing these variables on the central state object fits our static database model and avoids database schema migration issues.

### 3. Discount Evaluation
* **Choice**: Calculate the discount dynamically on invoice creation.
  * Lookup user `referralsCount`.
  * Scan active `referralTiers` to find the highest matched tier.
  * Deduct that percentage from the invoice or booking fee amount.
* **Rationale**: Prevents hardcoded values and keeps billing rules configurable.

## Risks / Trade-offs

* **[Risk]** Self-referral abuse via fake accounts.
  * **Mitigation**: Enforce unique email and phone validation on registration. Since invoices undergo manual UTR verification, admins can audit suspicious referral loops.
