## 1. Database and Server Schema

- [ ] 1.1 Update default DB state and initial seeding in `server.js` to include default referral scaling tiers and initialize user state records with a unique 6-character referral code.

## 2. Registration and Inquiry Integration

- [ ] 2.1 Modify the registration form and public inquiry forms in `index.html` to include a "Referral Code" input field.
- [ ] 2.2 Integrate referral code verification inside user creation logic in `app.js` to map the referrer relation and increment their referral counter.
- [ ] 2.3 Implement the automatic 6-character uppercase alphanumeric referral code generation utility during signup.

## 3. Student Dashboard Metrics

- [ ] 3.1 Edit the profile container in `index.html` to display the active student's unique referral code, total successful referrals, and active discount rate.
- [ ] 3.2 Implement front-end logic in `app.js` to calculate, render, and update referral achievements dynamically.

## 4. Admin Settings and Configuration

- [ ] 4.1 Insert the Referral Milestone Tiers configuration form inside the Admin Settings tab in `index.html`.
- [ ] 4.2 Wire form event handlers, validation checks, and database synchronization in `app.js` to configure scaling tiers.

## 5. Invoice Discount Calculations

- [ ] 5.1 Implement billing handlers in `app.js` to evaluate a student's referral count against active tiers and deduct their discount from newly created invoices or appointments.

## 6. Verification

- [ ] 6.1 Run the production build command `npm run build` to verify clean compilation.
- [ ] 6.2 Conduct manual checks on registration referral inputs and verify discount deductions on payment workflows.
