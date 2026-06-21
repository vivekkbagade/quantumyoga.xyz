# Lead CRM & Kanban Pipeline

Quantum Yoga features an integrated Customer Relationship Management (CRM) dashboard designed to capture visitor inquiries and convert them to active students.

---

## 📋 Leads Pipeline Schema (`leads`)

*   `id`: Unique identifier (e.g. `lead-1`).
*   `name` / `email`: Contact details.
*   `phone`: Validated Indian formatting number (+91 XXXXX XXXXX).
*   `message`: Freeform text from the landing page.
*   `date`: Initial inquiry submission date.
*   `status`: Kanban column status (`New`, `Contacted`, `Nurturing`, `Converted`, `Archived`).
*   `logs`: Timestamped chronological list of sales/coaching interactions.

---

## 🗂️ Kanban Swimlane Board

The Admin panel provides a multi-stage visual board to move prospects through the conversion funnel:

```
+------------+     +------------+     +------------+     +------------+     +------------+
|    New     | ──> | Contacted  | ──> | Nurturing  | ──> | Converted  | ──> |  Archived  |
+------------+     +------------+     +------------+     +------------+     +------------+
| Lead A     |     | Lead B     |     | Lead C     |     | Lead D     |     | Lead E     |
| [Details]  |     | [Notes]    |     | [Details]  |     | [Registered|     | [Closed]   |
+------------+     +------------+     +------------+     +------------+     +------------+
```

*   Admins can drag cards or use quick actions to update a lead's status.
*   The search bar enables instant filtering by name, email, or message text.

---

## ⚡ Single-Click Active Member Conversion

The conversion process automates user setup to reduce onboarding friction:

1.  **Account Provisioning:** Inserts a new user record in the database using the lead's email and name.
2.  **Credentials Generation:** Creates a secure random temporary password.
3.  **Forced Reset Flag:** Sets `mustChangePassword` to `true` to ensure the member establishes a private password on their first login.
4.  **Welcome Email:** Automatically drafts and sends an email containing login instructions and their temporary password via the active email service.
5.  **Status Sync:** Moves the lead state to `Converted`.
