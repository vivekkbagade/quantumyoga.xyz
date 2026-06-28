# Quantum Yoga - Step-by-Step Operations Guide

This guide provides step-by-step instructions for executing every feature and workflow in the Quantum Yoga application, with precise reference links to the underlying codebase source files.

---

## 1. Authentication & Onboarding

### 1.1 How to Register a New Student Account
1. Click **Log In** in the top navigation bar.
2. Select the **Register** tab in the modal.
3. Fill in your **Name**, **Email**, and **Password**.
4. Click the **Register** button. This invokes [saveUsers()](file:///d:/QuantumYogaWebsite/app.js#L2886-L2891) in the frontend which pushes the new user profile to the server database.

### 1.2 How to Submit an Inquiry (Leads Pipeline)
1. Click **Log In** in the top navigation bar.
2. Select the **Inquire** tab.
3. Enter your **Name**, **Email**, **Phone**, and **Message / Query**.
4. Click **Submit Inquiry** to trigger [saveLeads()](file:///d:/QuantumYogaWebsite/app.js#L2794-L2798) and add your contact details to the sales pipeline.

---

## 2. Student Functionality

### 2.1 Practicing Yoga Poses & Routines
1. Scroll down to the **Yoga Catalog** section.
2. Click **Poses** to render individual postures via [renderPoses()](file:///d:/QuantumYogaWebsite/app.js#L763-L843) (defined in [data.js:YOGA_POSES](file:///d:/QuantumYogaWebsite/data.js#L1)), or click **Routines** to render pre-constructed flows via [renderRoutines()](file:///d:/QuantumYogaWebsite/app.js#L844-L889) (defined in [data.js:YOGA_ROUTINES](file:///d:/QuantumYogaWebsite/data.js#L359)).
3. On any Routine card, click **Start Routine** to open the playback player.
4. The system triggers [startRoutineStep()](file:///d:/QuantumYogaWebsite/app.js#L669-L726). Use the player control bar to:
   * **Play / Pause**: Pause or resume the routine timer.
   * **Mute**: Turn breathing cue audio prompts on or off.
   * **Fullscreen**: Expand the player window.
   * **Voice Settings**: Click the gear icon (`⚙️`) to customize voice guides and audio feedback via [initVoiceCoachSettings()](file:///d:/QuantumYogaWebsite/app.js#L568-L606).
5. Click **Stop** to call [stopRoutinePlayback()](file:///d:/QuantumYogaWebsite/app.js#L727-L761) and exit.

### 2.2 Logging Practices & Streaks
1. Go to **My Studio Dashboard** > **My Practice Log**.
2. Click **Log Practice** to record your completed yoga session.
3. The system processes your consecutive day count using [computeStreaks()](file:///d:/QuantumYogaWebsite/app.js#L3715-L3780) and updates the dashboard view.

### 2.3 Booking & Managing Appointments
1. Navigate to **My Appointments** tab.
2. Click **Book New Session** to trigger [openAppointmentModal()](file:///d:/QuantumYogaWebsite/app.js#L4452-L4519).
3. In the appointment form modal:
   * Select the **Yoga Routine** you'd like to practice.
   * Choose the **Date** and **Time**.
   * Click **Schedule Appointment** to fire [saveAppointments()](file:///d:/QuantumYogaWebsite/app.js#L4447-L4450).
4. View your pending and scheduled bookings under the appointment history table rendered by [renderStudentAppointments()](file:///d:/QuantumYogaWebsite/app.js#L4529-L4639).

### 2.4 Making Payments (UPI)
1. Go to **My Studio Dashboard** and locate the **Billing & Invoices** card.
2. For any invoice listed as `pending` or `overdue`:
   * Click **Pay Now** to trigger [openUpiPaymentModal()](file:///d:/QuantumYogaWebsite/app.js#L8532-L8656).
   * Scan the generated **UPI VPA QR Code** or tap the payment link.
   * Enter your transaction details once paid to submit the payment claim to administrators.

---

## 3. Administrative Functionality

### 3.1 Managing Users & Memberships
1. Go to **User Management** panel on the Admin Dashboard, populated by [renderAdminUsersTable()](file:///d:/QuantumYogaWebsite/app.js#L6700-L6796).
2. Find a user in the table and click **Inspect / Manage** to open [openInspectModal()](file:///d:/QuantumYogaWebsite/app.js#L7246-L7341).
3. In the user inspection profile container:
   * Update their membership settings (e.g. adjust referral discounts or assigned batches).
   * Click **Save Membership Settings**.

### 3.2 Handling Inquiries (Leads Pipeline)
1. Navigate to the **Leads Pipeline** tab on the Admin Dashboard.
2. Select a lead from the list to trigger [openInspectLeadModal()](file:///d:/QuantumYogaWebsite/app.js#L6935-L6984).
   * Record notes or set a **Follow-up Date** and click **Save Follow-up**.
   * If the lead signs up, click **Convert to Member** to instantly generate their student profile.

### 3.3 Creating Batches & Scheduling Classes
1. Go to the **Batches & Scheduling** panel, rendered by [renderAdminBatches()](file:///d:/QuantumYogaWebsite/app.js#L6584-L6667).
2. **Create a Batch**:
   * Enter **Batch Name**, **Instructor Name**, and max **Capacity**.
   * Add days and times to the timetable.
   * Click **Create Batch**.

### 3.4 Setting Coaching Fees & Managing Bookings
1. Go to the **Appointments Management** tab, managed by [renderAdminAppointments()](file:///d:/QuantumYogaWebsite/app.js#L4640-L4734).
2. **Adjust Fee**:
   * Enter the fee amount in the fee input box.
   * Click **Save Appointment Fee** to trigger [saveAppointmentFee()](file:///d:/QuantumYogaWebsite/app.js#L2781-L2786).
3. **Approve / Cancel Bookings**:
   * Review incoming appointment requests.
   * Approve bookings or click cancel, which triggers [cancelAppointmentSession()](file:///d:/QuantumYogaWebsite/app.js#L4213-L4254).

### 3.5 Managing Email Inbox & Communications
1. Navigate to the **Email Inbox** panel rendered by [renderAdminEmailTab()](file:///d:/QuantumYogaWebsite/app.js#L5491-L5510).
2. Click **Connect Gmail** to trigger [connectGmail()](file:///d:/QuantumYogaWebsite/app.js#L1811-L1819).
3. Filter messages using **All** / **Unread** buttons.
4. Open a message to review:
   * Click **Reply** to compose and send a response.
   * Approve payment attachments directly by clicking **Approve Payment** to trigger [approvePayment()](file:///d:/QuantumYogaWebsite/app.js#L5154-L5178) or click decline to trigger [rejectPayment()](file:///d:/QuantumYogaWebsite/app.js#L5179-L5201).

### 3.6 Automated UPI Statement Reconciliation
1. Go to the **Payments & Billing** panel on the Admin Dashboard.
2. Select the **Reconciliation Settings** tab:
   * Define the amount tolerance and maximum age window in days.
   * Map the CSV columns to matching keys. The inputs are initialized by [populateReconciliationSettingsInputs()](file:///d:/QuantumYogaWebsite/app.js#L1483-L1502).
3. Under the upload area, choose your bank statement CSV file.
4. Click **Upload & Run Auto-Reconcile**. The server processes the reconciliation, and matches are displayed under the **Reconciliation Logs** table rendered by [renderReconciliationLogs()](file:///d:/QuantumYogaWebsite/app.js#L1503-L1535).

### 3.7 Launching Live Streaming
1. Go to the Admin Dashboard and select the **Live Stream** utility.
2. Click **Launch Live Video Session**. The system initializes the video feed, sets up WebSocket communication via [initChatWebSocketIfNeeded()](file:///d:/QuantumYogaWebsite/app.js#L9053-L9094), and broadcasts active sessions.
