# Quantum Yoga - User Guide

Welcome to the **Quantum Yoga** user manual! This guide provides a detailed walkthrough of the platform's core features for both **Students** and **Administrators**.

---

## 1. Student Portal

The Student portal allows practitioners to manage their practices, book private coaching sessions, track progress, and communicate with the community.

### 1.1 Yoga Poses & Routines
* **Browse Catalog**: Discover an interactive list of yoga poses ([data.js:yoga_poses](file:///d:/QuantumYogaWebsite/data.js#L5)) with difficulty indicators, benefits, and step-by-step descriptions.
* **Practice Routines**: Select custom sequences ([data.js:yoga_routines](file:///d:/QuantumYogaWebsite/data.js#L54)) and initiate the step-by-step playback player. The UI guides you through breathing patterns, duration timers, and visual transitions.

### 1.2 Appointment Booking
* **Private Coaching**: Tap **Book Session** to open the appointment booking modal. 
* Select your preferred routine, date, and time.
* Once submitted, your appointment status defaults to `scheduled` and appears in your personal calendar dashboard.

### 1.3 Billing & Payments (UPI)
* View all invoices and subscriptions (monthly fees, coaching charges) from the Billing section.
* Invoices clearly list status (`pending`, `paid`, `overdue`).
* Pay instantly using the auto-generated **UPI VPA QR Code** or direct tap-to-pay link.

### 1.4 Engagement: Streaks & Referrals
* **Daily Practice Streaks**: Log practices daily to increase your activity streak score and unlock special badges.
* **Referral Program**: Invite friends to join Quantum Yoga. As they enroll, you move up referral tiers to receive discounts (e.g. 10%, 15%, or 20% off subscriptions).

### 1.5 Community Chat
* Join the live community chat from the dashboard.
* Converse in real-time with active peers and coaches.
* Toggle between dark mode and other system themes (such as the default `midnight` theme) to suit your environment.

---

## 2. Administrator Dashboard

Administrators have access to specialized management systems to control studio operations, handle payments, and communicate with students.

### 2.1 Student & Batch Management
* **User Tables**: View, filter, and manage all registered student profiles.
* **Class Batches**: Configure batches, adjust capacities, assign instructors, and set timetables.

### 2.2 Billing & Reconciliations
* Monitor invoice payments and approve payment claims or process refunds.
* **UPI Auto-Reconciliation**: Import bank statement ledgers and let the system automatically match UPI UTR transaction IDs against outstanding invoices based on customizable date and amount tolerance thresholds.

### 2.3 Automated Notifications
* **WhatsApp Integration**: Toggle and configure WhatsApp notification templates for automated welcome messages, invoice reminders, and booking confirmations.
* **Email Inbox & Outbox**: Write, track, and dispatch emails to students via Google Workspace (Gmail) or Resend API integrations.
