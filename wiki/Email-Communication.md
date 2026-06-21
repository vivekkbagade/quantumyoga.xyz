# Email Communication Systems

Quantum Yoga hosts a dual-provider email client allowing both scheduled transactional emails and direct interactive mail threads.

---

## ⚙️ Core Configuration

The communication module runs under two separate operational modes:

### 1. Resend API Client (Transactional)
*   **Purpose:** Best for automated alerts, receipts, welcome letters, and system-triggered notifications.
*   **Variable Required:** `RESEND_API_KEY` and `RESEND_FROM_ADDRESS` set in `.env`.
*   **Endpoints:** 
    *   `POST /api/send-email`: Send a customized HTML format email.
    *   `GET /api/resend-emails`: Retrieve email log responses.

### 2. Gmail OAuth2 Integration (Interactive Chat)
*   **Purpose:** Real-time communications between active studio students and administrators.
*   **Google Cloud Setup:**
    1. Create a project at [Google Cloud Console](https://console.cloud.google.com).
    2. Enable the Gmail API.
    3. Setup OAuth Consent Screen and configure web application client credentials.
    4. Authorize redirect origins (e.g. `http://localhost`).
    5. Add the generated Client ID in **Admin > System Settings**.

---

## 📧 Interfaces

### Admin Email Hub
*   Renders Inbox and Sent tabs.
*   Supports live unread badge counters.
*   Includes preformatted templates for *Welcomes*, *Invoice Reminders*, and *Appointment Confirmations*.

### Student Support Inbox
*   Accessible within the member's profile portal.
*   Shows all official notifications sent from the studio.
*   Enables students to draft feedback/inquiries that go straight to the admin inbox.
