# Student Referral & Scaling Discounts Portal

The Student Referrals capability drives organic studio growth by incentivizing current students to refer friends. It supports unique referral codes and a dynamic scaling discount tier based on successful referral counts.

## 🧭 Student Referral Flows

Every registered student can view and share their referrals:

1. **Unique Code Generation**: During signup, the system automatically assigns a unique 6-character alphanumeric code (e.g., `FLOW88`) to the student.
2. **Dashboard Display**: The code, along with successful invite metrics and active discount rate, is visible directly inside the student's **Profile** tab.
3. **Sharing**: Students share their code with prospective members.

## 🔀 Referral Verification

When a prospective member signs up or submits an inquiry:

1. **Signup Entry**: Prospective students fill out the optional **Referral Code** field in the registration card.
2. **Validation**: The system verifies the code belongs to a valid active member.
3. **Referral Mapping**: Upon successful registration, the new user's account is created, and the referrer's successful referral counter increments by 1.

## 📈 Configurable Discount Tiers

Administrators configure the business logic dynamically:

1. **Settings Control**: In **Admin Panel -> System Settings**, locate the **Referral Tiers Settings** card.
2. **Define Tiers**: Add, update, or remove discount milestones (e.g., 1 referral = 10% discount, 2 referrals = 15% discount, 3+ referrals = 20% discount).
3. **Save**: Save changes to sync configuration to the database.

## 💳 Automated Discount Deductions

Referrer rewards are automatically applied:
* When the system generates a new monthly subscription invoice or an appointment booking fee for a referrer, it calculates their highest qualified discount tier and applies the percentage deduction to the total amount due.
