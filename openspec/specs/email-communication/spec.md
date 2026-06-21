# Email Communication Spec

## Overview
This capability handles the messaging inbox and compose tools for both students and administrators. It supports dual integration providers (Resend API key and OAuth-based Gmail connector), template selection, and synchronized messaging.

## Data Structures

### Email Log Schema (`emails`)
Each message record in the database contains:
- `id` (string): Unique email identifier.
- `threadId` (string, optional): Gmail-provided thread ID.
- `from` (string): Sender address.
- `to` (string): Recipient address.
- `subject` (string): Email header subject.
- `date` (string): Date and time of dispatch.
- `snippet` (string): Truncated preview text of the email body.
- `bodyHtml` (string): Message content formatted in HTML.
- `bodyText` (string): Message content formatted in raw text.
- `isRead` (boolean): Unread status indicator.
- `folder` (string): Active directory location (`inbox` or `sent`).
- `direction` (string): Messaging flow direction (`sent` or `received`).
- `connectedEmail` (string): Email account associated with the credentials.

---

## Email Integration Providers

### 1. Resend API Integration
- Uses API Keys (`RESEND_API_KEY`) and configured sender addresses (`RESEND_FROM_ADDRESS`).
- Integrates via backend endpoints (`/api/send-email` and `/api/resend-emails`).
- Displays active badges in the admin settings when API keys are configured and functional.

### 2. Gmail OAuth Integration
- Allows linking individual Gmail accounts using client credentials.
- Supports authorization connect/disconnect toggle controls.
- Fetches synchronized message threads from the connected Gmail account when refreshed.

---

## Messaging Interfaces

### 1. Admin Email Center
- **Folder Tabs**: Split into Inbox (received) and Sent mail.
- **Unread Badging**: Displays count of unread incoming messages.
- **Email Preview Overlay**: Opens selected messages to read the full body, displaying sender, date, and subject.
- **Reply Action**: Auto-populates recipient fields to respond to selected messages.
- **Composer & Templates**:
  - Send custom emails to any student email.
  - Dropdown selector containing template layouts (e.g., "Welcome Email", "Inquiry Reply", "Invoice Reminder", "Appointment Confirmation").
  - Auto-fills subject and body variables with preformatted professional copywriting.

### 2. Student Inbox
- Accessible via the member's profile portal.
- Displays incoming messages sent by administrators.
- Allows students to compose and send feedback/inquiry emails directly to `admin@quantumyoga.xyz`.
