# Lead Management & CRM Spec

## Overview
This capability governs lead capture, swimlane (Kanban) boards, status tracking, logging sales/contact notes, and converting prospects to registered members with automated account creation.

## Data Structures

### Leads Schema (`leads`)
Each lead has the following properties:
- `id` (string): Unique identifier (e.g., `"lead-1"`).
- `name` (string): Full name of the lead.
- `email` (string): Primary email address.
- `phone` (string): Contact number (supports Indian phone formatting: `+91 XXXXX XXXXX`).
- `message` (string): Original message/question from the landing page.
- `date` (string): Submission date (YYYY-MM-DD).
- `status` (string): CRM column status (`New`, `Contacted`, `Nurturing`, `Converted`, `Archived`).
- `logs` (array of objects): History of interactions. Each log has:
  - `timestamp` (string): Date and time of entry.
  - `note` (string): Detailed logs notes.

---

## Kanban Swimlane Board
- Located in the Admin Leads tab.
- Renders 5 visual columns corresponding to lead status levels:
  - **New**
  - **Contacted**
  - **Nurturing**
  - **Converted**
  - **Archived**
- Features cards displaying lead names, dates, snippets of messages, and quick buttons to inspect.
- Supports drag-and-drop or modal status selector tools to transition leads between swimlanes.
- Search input filters the board by lead name, email, or message contents.

---

## CRM Actions

### 1. Log Interactions
- Admins can add customized timestamped contact notes to any lead.
- These notes accumulate in the Lead Logs history timeline.

### 2. Lead Conversion Flow
- Admins click **"Convert Lead"** to register the prospect as an active member.
- **Automated Registration**:
  - Automatically creates a new user account in the `users` collection.
  - Generates a secure, temporary password.
  - Sets `mustChangePassword` to `true` to require a reset on first login.
  - Adds a log entry stating: `"Lead converted to registered user account successfully. Temporary Password: [TEMP_PASS]"`
  - Sends a welcome email containing their temporary password.
  - Switches lead status to `Converted`.
