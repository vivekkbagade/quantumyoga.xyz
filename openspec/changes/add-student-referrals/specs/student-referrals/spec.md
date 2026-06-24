## ADDED Requirements

### Requirement: Generate Referral Code
The system SHALL automatically generate a unique 6-character alphanumeric referral code for every newly registered student.

#### Scenario: Generating code on registration
- **WHEN** a user completes registration successfully
- **THEN** the system SHALL generate a unique referral code and save it to the student profile.

### Requirement: Registration Referral Tracking
The system SHALL allow registering users to optionally submit a referral code, verifying its validity, mapping the relationship, and crediting the referrer student.

#### Scenario: Registration with valid referral code
- **WHEN** a user registers with a valid referral code belonging to another active student
- **THEN** the system SHALL create the new user account and increment the referrer's successful referral count by 1.

### Requirement: Configurable Referral Discount Tiers
The system SHALL allow administrators to configure referral discount scaling tiers (minimum referral counts mapping to discount percentages) inside the System Settings panel.

#### Scenario: Administrator updates discount tiers
- **WHEN** an administrator modifies the referral milestones and discount percentages and saves the form
- **THEN** the system SHALL save the configuration to the server database and immediately apply the updated pricing rules.

### Requirement: Display Referral Metrics on Profile
The system SHALL display the student's unique referral code, successful referrals count, and current discount percentage on their profile dashboard.

#### Scenario: Student views profile dashboard
- **WHEN** a student navigates to their profile page
- **THEN** the system SHALL present their shareable referral code, successful referrals counter, and calculated discount rate.

### Requirement: Automated Billing Discount Application
The system SHALL automatically apply the student's current referral discount percentage to reduce any newly generated invoices or appointment coaching fees.

#### Scenario: System generates invoice for referrer
- **WHEN** a new payment invoice or appointment coaching fee is created for a student
- **THEN** the system SHALL apply their active referral discount percentage as a deduction to the total amount due.
