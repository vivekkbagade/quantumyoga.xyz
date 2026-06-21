# User Authentication & Profile Spec

## Overview
This specification details the user membership lifecycle, authentication system, member profile portal, and wellness logging features.

## Data Structures

### User Schema (`users`)
Each user object is defined within the root state's `users` array:
- `name` (string): Full name of the user.
- `email` (string): Unique email address acting as username.
- `password` (string): Password string (cleartext or hash).
- `favorites` (array of strings): List of favored pose IDs.
- `routineHistory` (array of objects): History of completed routines. Each log contains:
  - `routineId` (string): Completed routine ID.
  - `date` (string): ISO timestamp of completion.
- `theme` (string): User-customized UI theme (`light`, `dark`, `glassmorphism`, `violet`, etc. or empty string to inherit site default).
- `batchId` (string): ID of the assigned class batch (e.g., `"batch-vinyasa-mornings"`).
- `membership` (object): Membership metadata details:
  - `tier` (string): `Basic`, `Premium`, or `Gold`.
  - `status` (string): `Active`, `Inactive`, or `Suspended`.
  - `expiryDate` (string): YYYY-MM-DD expiration date.
  - `notes` (string): Administrative coaching or member notes.
- `goals` (string): Personal health or yoga objectives.
- `healthNotes` (string): Active medical alerts or physical limitations.
- `mustChangePassword` (boolean): Flag requiring password change on login.

---

## Authentication Features

### 1. Unified Authentication Gate
- An overlay blocking application dashboards until logged in.
- Supports three primary tabs: **Login**, **Register**, and **Inquiry**.

### 2. Login Flow
- Validates credentials against the user database state.
- **Remember Me**: Saves credentials in localStorage/cookies if selected.
- **Forgot Password**: Form initiating password retrieval/reset instructions.
- **Force Password Change**: If `mustChangePassword` is `true`, blocks application access and displays a forced password reset form, requiring the user to change their password before proceeding.

### 3. Registration Flow
- Allows new members to sign up with unique emails.
- Automates default membership creation (`Basic` tier, `Active` status, 30-day default expiry).

### 4. Wellness Inquiry Form
- Anonymous landing page inquiries. Captures Name, Email, Phone, and Inquiry Message.
- Saves inquiries as new items in the `leads` table and triggers notifications.

---

## Member Profile Portal

### 1. Profile Dashboard Tab
- **Key Metrics**: Displays totals for routines completed and favorite poses.
- **Routines History Feed**: Cronological feed of practice sessions completed.
- **Favorites Grid**: Interactive list of user-favorited poses with click-through details.
- **Batch Schedule**: Displays details of the assigned class batch (Batch title, Weekly timetable, and an active countdown timer to the next scheduled session).

### 2. Practice Tab
- Quick access to launch poses and routines.

### 3. Wellness & Coaching Panel
- Form allowing members to update their yoga goals and health notes.
- Submissions update user fields, visible to administrators during coaching reviews.

### 4. Personal Theme Configuration
- Dropdown permitting users to set personal UI skins. Saves option to user object, instantly updating CSS root variables.
