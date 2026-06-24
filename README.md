# 🧘 Quantum Yoga - Premium Studio Management & Practice Dashboard

Welcome to **Quantum Yoga**, a premium static and interactive dashboard website designed for modern yoga studio management, coaching interaction, and guided practices. Powered by a responsive single-page application (SPA) frontend and a modular Node.js/Express backend, Quantum Yoga integrates scheduling, payments, communications, and customer relations into a unified glassmorphic portal.

---

## 🌟 Key Features & Capabilities

Based on the [OpenSpec Specs](file:///d:/QuantumYogaWebsite/openspec/specs/), Quantum Yoga is organized into six core capability modules:

### 1. [Core Yoga Directory](file:///d:/QuantumYogaWebsite/openspec/specs/core-yoga/spec.md)
*   **Postures Directory:** Categorized and searchable index of master postures with detailed metadata (Sanskrit translations, difficulty, duration, benefits, and step-by-step instructions).
*   **SVG Pose Illustrations:** High-fidelity line-art illustrations embedded dynamically to guide body alignment.
*   **Guided Practice Flows:** Sequential yoga routines tracking total duration, focus areas, and pose steps.
*   **Custom HTML5 Video Player:** Bespoke overlay player with custom playback controls, volume sliders, progress buffers, and automatic routine completion logging.

### 2. [User Authentication & Profile Portal](file:///d:/QuantumYogaWebsite/openspec/specs/user-auth-profile/spec.md)
*   **Unified Auth Gate:** Seamless login, registration, and inquiry gates supporting modern features like "Remember Me" and "Forgot Password."
*   **Forced Password Reset:** Supports secure administrative conversions by forcing members to reset temporary passwords upon their first login.
*   **Personal Studio Dashboard:** Visualizes member stats (routines completed, favorites list, practice logs) and houses private wellness goals & health notes.
*   **UI Skin Selection:** Members can personalize their dashboard with themes like *Midnight Aura (Dark)*, *Ethereal Light*, or *Zen Sunset*.

### 3. [Class Scheduling & Batches](file:///d:/QuantumYogaWebsite/openspec/specs/class-scheduling/spec.md)
*   **Weekly Timetables:** Automatically maps assigned cohort schedules with a live countdown timer ticking down to the next live session.
*   **Coaching Appointments:** Members can book private sessions directly with instructors, select target routines, and reschedule or cancel existing appointments.
*   **Admin Scheduling Directory:** Master schedule manager permitting administrators to book appointments on behalf of students, change timetables, and customize session fees.

### 4. [Billing, Invoices & Payments](file:///d:/QuantumYogaWebsite/openspec/specs/billing-payments/spec.md)
*   **Outstanding Payment Banners:** Prominently alerts members of pending or overdue invoices right at the top of their dashboard.
*   **UPI QR Code Generator:** Generates a live merchant UPI QR code (`upi://pay?pa=...`) for instant scanned payments.
*   **UTR Verification:** Users submit their Unique Transaction Reference (UTR) code to confirm UPI transactions, automatically transitioning invoice statuses to "Paid" via automated reconciliation matching against a trusted bank statement ledger uploaded manually by administrators (as a CSV file), falling back to manual "Under Review" status if matching fails.
*   **Dynamic Receipts:** Printable branded billing receipts detailing invoice metadata, merchant payment addresses, and reference UTRs.

### 5. [Lead Management & CRM Pipeline](file:///d:/QuantumYogaWebsite/openspec/specs/leads-crm/spec.md)
*   **Kanban Swimlane Board:** Renders an interactive multi-column board (`New`, `Contacted`, `Nurturing`, `Converted`, `Archived`) to manage incoming inquiries.
*   **sales Notes & Logs:** Allows admins to record date-stamped interaction history for each prospective lead.
*   **Automated Conversion Flow:** Converts a lead into an active studio member with a single click—automatically registering the account, generating a temporary password, and dispatching a welcoming email.

### 6. [Email Communication Center](file:///d:/QuantumYogaWebsite/openspec/specs/email-communication/spec.md)
*   **Dual Integration System:** Supports high-scale transactional emails via the **Resend API proxy** and personalized client interactions via **Gmail OAuth2 flow**.
*   **Admin Inbox & Outbox:** An administrative dashboard folder to view, preview, and directly reply to messages.
*   **Pre-made Email Templates:** One-click email templates (e.g., *Welcome Email*, *Invoice Reminders*, *Appointment Confirmations*) auto-filled with variables.

### 7. [WhatsApp Notifications & Direct Chat Shortcuts](file:///d:/QuantumYogaWebsite/openspec/changes/add-whatsapp-functionality/specs/whatsapp-communication/spec.md)
*   **Automated Alert Dispatches:** Triggers immediate WhatsApp alert messages to student telephone numbers upon booking, rescheduling, and cancellation events or new/overdue billing creation.
*   **Direct Chat Shortcuts:** Displays chat launch actions (`https://wa.me/`) next to student profiles, appointment lists, invoices, and Kanban leads to start immediate conversations with pre-filled greeting templates.
*   **System settings:** Incorporates toggles, provider gateway endpoints, credentials keys, and template editors in the Admin Settings panel.

### 8. [Community Chat & WebSockets](file:///d:/QuantumYogaWebsite/openspec/changes/real-time-community-chat/specs/community-chat/spec.md)
*   **Real-time Glassmorphic Chat:** Real-time chat room where students and instructors/admins can discuss wellness and share daily motivation.
*   **Active Users List:** A live panel displaying online users with role indicators (Student, Instructor).
*   **Message History:** Automatic retrieval of the last 50 messages on join, persisted in database states (PG, Supabase, or local db.json).
*   **Co-hosted WebSocket Server:** Runs directly on the same Express server port using standard WebSockets (`ws`).

### 9. [Live Interactive Yoga Rooms (WebRTC)](file:///d:/QuantumYogaWebsite/openspec/changes/live-yoga-rooms-webrtc/specs/live-yoga-rooms/spec.md)
*   **Virtual Classrooms**: Embedded peer-to-peer interactive WebRTC video streaming rooms powered by the Jitsi Meet IFrame API.
*   **Instructor Dashboard**: Custom stream launching panel enabling instructors to initiate and moderate classes.
*   **Dynamic Timetable Sync**: Integrates a glowing "Join Live Room Now" shortcut directly within the student's next class countdown timetable when a session is active.

---

## 🛠️ Technology Stack

*   **Frontend:** HTML5, Vanilla JavaScript, CSS3 (Custom Glassmorphism styling with support for multiple themes).
*   **Build Tooling:** [Vite](https://vitejs.dev/) for quick HMR and optimal client-side bundling.
*   **Backend:** [Express](https://expressjs.com/) server acting as a database router, static asset hosting, email integration proxy, WhatsApp provider proxy, and co-hosted WebSocket server.
*   **Storage & Database:** Supports fallback local file database storage (`db.json`) and connects seamlessly to either a **PostgreSQL** pool or **Supabase Client JSON storage** when variables are set.
*   **Testing Suite:** [Jest](https://jestjs.io/) for backend/unit tests and [Playwright](https://playwright.dev/) for robust end-to-end testing.

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (v9 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd QuantumYogaWebsite
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```

### Configuration (`.env`)

Configure your environment by duplicating the active environment variables or editing the existing `.env` file in the root directory:

```env
# Server configuration
PORT=8080

# Database Configuration (PostgreSQL / Supabase)
# Fallback to local db.json if database connection is omitted
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/quantum_yoga

# Email Integrations (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_ADDRESS=admin@quantumyoga.xyz
```

### Running the Application

*   **Development Mode (Frontend HMR):**
    ```bash
    npm run dev
    ```
*   **Production Build:**
    ```bash
    npm run build
    ```
*   **Start Production Server:**
    ```bash
    npm run start
    ```

---

## 🧪 Testing

To run the test suite:

*   **Unit Tests (Jest):**
    ```bash
    npm run test
    ```
*   **End-to-End Tests (Playwright):**
    ```bash
    npm run e2e
    ```

---

## 🌐 VM CI/CD & Deployment Setup

This project is configured with a GitHub Actions CI/CD workflow to automatically deploy code updates to a Virtual Machine (VM) when pushed to the main/master branches.

### 1. GitHub Repository Secrets Configuration
To enable the deployment workflow, navigate to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**, and add the following repository secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `VM_SSH_IP` | Public IP Address or Domain of your VM | `192.0.2.1` |
| `VM_SSH_USER` | SSH Login User name | `ubuntu` or `root` |
| `VM_SSH_KEY` | Private SSH key authorized to log in | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VM_DEPLOY_PATH` | Path on the VM to deploy files | `/var/www/quantum-yoga` |

### 2. VM Environment Preparation

Run the following commands on your VM to prepare the environment for hosting this application:

```bash
# Update and install Node.js (v20 recommended) and git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 Process Manager globally
sudo npm install -g pm2

# Create the deployment directory and change ownership to your SSH user
sudo mkdir -p /var/www/quantum-yoga
sudo chown -R ubuntu:ubuntu /var/www/quantum-yoga
```

### 3. Application Configuration on VM
Inside the deployment path on the VM (e.g., `/var/www/quantum-yoga`), create your production environment configuration file `.env`:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:your-db-password@127.0.0.1:5432/quantum_yoga
RESEND_API_KEY=re_your_api_key
RESEND_FROM_ADDRESS=admin@quantumyoga.xyz
```

PM2 will automatically manage and reload the application using the configuration in `ecosystem.config.cjs`.

