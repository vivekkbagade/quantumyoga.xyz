## Context

Quantum Yoga is a single-page vanilla JS/HTML/CSS dashboard application (no backend server) that stores all data in `db.json` via a local Vite dev server for development. The app has a well-established admin panel (with sub-tabs for Users, Payments, Leads, Batches, Appointments, Reports, Settings) and a student Profile section (with sub-tabs for Dashboard, Practice Log, Wellness, Appointments). There is currently no in-app communication mechanism; all communications are done outside the application.

The Gmail REST API allows browser-based OAuth2 flows (Authorization Code + PKCE or Implicit Grant), but for a client-side SPA without a backend, we will use the **Google Identity Services (GIS) library** with the `token` model (implicit grant) to get short-lived access tokens. To avoid requiring users to re-authorize on every page load, we persist the access token and its expiry in `db.json` (admin-side) and `localStorage` (student-side mirror). Since refresh tokens cannot be obtained without a backend redirect URI handler, the admin will need to periodically re-authorize (token TTL is 1 hour).

## Goals / Non-Goals

**Goals:**
- Allow admin to connect a Gmail account via Google OAuth2 from the System Settings tab
- Provide admin with an "Email" sub-tab: inbox list, compose modal, conversation thread view, and send email capability
- Provide students with an "Email" sub-tab in their Profile: view emails from the studio, reply to threads
- Mirror email metadata (sender, recipient, subject, snippet, timestamp, read status, threadId, messageId) in `db.json` under an `emails` array for offline/cached display
- Trigger automated notification emails on key events: invoice issued, appointment confirmed/cancelled, batch enrollment
- Display unread count badge on the Email tab for both admin and student
- Use the existing glassmorphic design system for all new UI elements

**Non-Goals:**
- Full backend OAuth2 server with refresh token management (no server component)
- Sending attachments (initial version: text/HTML body only)
- Push notifications or real-time email polling (manual refresh only in v1)
- Supporting multiple connected Gmail accounts simultaneously
- Email threading reconstructed from Gmail API (v1 shows flat list; threaded view is enhancement)
- Storing full email body content in `db.json` (only snippet + metadata; full body fetched on demand from Gmail API)

## Decisions

### Decision 1: Client-side OAuth2 with Google Identity Services (GIS)

**Chosen**: GIS `tokenClient` (implicit grant) loaded via `accounts.google.com/gsi/client` CDN script.

**Rationale**: The app has no backend server, so Authorization Code flow with refresh tokens is not viable without a redirect endpoint. The GIS library's `tokenClient` provides a popup-based consent flow that delivers a short-lived access token directly to the browser. The token is stored in `db.json` (for admin) with its expiry timestamp and re-requested when expired via a silent prompt attempt (which auto-renews if the user has a valid Google session).

**Alternative considered**: Firebase Auth with Gmail scope — rejected because it adds a large dependency and requires Firebase project setup, which is overkill for a local studio management app.

### Decision 2: Email metadata mirrored in `db.json`

**Chosen**: On each "fetch inbox" call, we sync the latest N (default 20) message metadata objects into `db.json.emails`. Full bodies are fetched on demand from the Gmail API when a message is opened.

**Rationale**: Prevents UI from showing empty state on every load while waiting for API. Allows filtering/searching the inbox locally. Keeps `db.json` as the single source of truth for the app's local state — consistent with how invoices, appointments, and batches are already stored.

**Alternative considered**: Purely API-driven with no local cache — rejected because any network latency or token expiry would leave the UI blank.

### Decision 3: Scopes — Gmail API read/write

**Chosen**: Request `https://www.googleapis.com/auth/gmail.modify` scope for admin (allows read, send, modify labels/read status) and display a read-only mirror for students (student emails are fetched by admin API and stored in `db.json`).

**Rationale**: `gmail.modify` gives full send+read access without requiring the more sensitive `gmail` scope. Students do not need a separate OAuth connection — their emails are persisted in `db.json` by the admin's connection and they "reply" by the system sending an email on their behalf via the admin's Gmail account (reply-to addressed to the student's stored email).

**Alternative considered**: Separate OAuth for each student — rejected because it massively complicates the UX and requires each student to have a Google account.

### Decision 4: Single `emails` collection in `db.json`

**Schema**:
```json
{
  "emails": [
    {
      "id": "msg_abc123",
      "threadId": "thread_xyz",
      "from": "studio@gmail.com",
      "to": "student@example.com",
      "subject": "Your Appointment Confirmation",
      "snippet": "Hi Priya, your appointment on...",
      "body": "",
      "timestamp": "2026-06-16T10:30:00Z",
      "isRead": false,
      "direction": "sent",
      "studentEmail": "student@example.com",
      "type": "manual | transactional",
      "triggerEvent": "appointment_confirmed | invoice_issued | batch_enrolled | null"
    }
  ],
  "gmailSettings": {
    "connectedEmail": "studio@gmail.com",
    "accessToken": "ya29...",
    "tokenExpiry": 1718530000,
    "clientId": "xxxx.apps.googleusercontent.com"
  }
}
```

**Rationale**: Flat collection is simple to filter by `studentEmail` for the student's inbox view and by `direction` for admin sent/received.

### Decision 5: Student "reply" via admin Gmail account

**Chosen**: When a student clicks "Reply" on an email, a compose modal pre-fills with the thread details. On submit, the admin's Gmail account sends the reply. The student does not need their own Gmail OAuth.

**Rationale**: Keeps OAuth complexity to one account. This models the studio as the sole communicating entity.

## Risks / Trade-offs

- **Access token expiry (1 hr TTL)** → Mitigation: Show a "Reconnect Gmail" banner in the Email tab if the token is expired; prompt re-authorization with one click. Silent re-auth attempt first.
- **Gmail API rate limits** → Mitigation: Cache inbox in `db.json`, only re-fetch on explicit user refresh or on page load if cache is >5 min old.
- **Google OAuth requires a real domain or `localhost` registered in GCP Console** → Mitigation: Document setup steps in tasks; admin must create a GCP project and add `http://localhost` as authorized origin. In production, update to the real domain.
- **No server-side token storage = token visible in localStorage/db.json** → Mitigation: Acceptable risk for a local studio management app. Document that `db.json` should not be committed to public repos with live tokens.
- **Students can only see emails via the studio's account mirror** → Mitigation: Clearly label the student email tab as "Studio Emails" to set expectations. If student replies, it goes through admin Gmail.

## Migration Plan

1. Admin navigates to System Settings → "Gmail Integration" card
2. Enters their Google Cloud OAuth2 Client ID
3. Clicks "Connect Gmail Account" → GIS popup appears → admin grants consent
4. Access token saved to `db.json.gmailSettings`
5. Email tab appears in both Admin and Student Profile panels
6. Existing data unaffected — `db.json` `emails` array starts empty and populates on first sync
7. Rollback: Admin clicks "Disconnect Gmail" in settings → token and emails array cleared
