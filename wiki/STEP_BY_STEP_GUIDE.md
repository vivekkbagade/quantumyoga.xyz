# Quantum Yoga - Step-by-Step Operations Guide

This guide provides step-by-step instructions for executing every feature and workflow in the Quantum Yoga application.

---

## 1. Authentication & Onboarding

### 1.1 How to Register a New Student Account
1. Click **Log In** in the top navigation bar.
2. Select the **Register** tab in the modal.
3. Fill in your **Name**, **Email**, and **Password**.
4. Click the **Register** button to create your account.

### 1.2 How to Submit an Inquiry (Leads Pipeline)
1. Click **Log In** in the top navigation bar.
2. Select the **Inquire** tab.
3. Enter your **Name**, **Email**, **Phone**, and **Message / Query**.
4. Click **Submit Inquiry** to submit your inquiry.

---

## 2. Student Functionality

### 2.1 Practicing Yoga Poses & Routines
1. Scroll down to the **Yoga Catalog** section.
2. Click **Poses** to view individual postures, or click **Routines** to view pre-constructed flows.
3. On any Routine card, click **Start Routine** to open the playback player.
4. Use the player control bar to:
   * **Play / Pause**: Pause or resume the routine timer.
   * **Mute**: Turn breathing cue audio prompts on or off.
   * **Fullscreen**: Expand the player window.
   * **Voice Settings**: Click the gear icon (`⚙️`) to customize voice guides and audio feedback.
5. Click **Stop** to close the player.

### 2.2 Logging Practices & Streaks
1. Go to **My Studio Dashboard** > **My Practice Log**.
2. Click **Log Practice** to record your completed yoga session.
3. Your consecutive day count and streaks will automatically update on the dashboard view.

### 2.3 Booking & Managing Appointments
1. Navigate to **My Appointments** tab.
2. Click **Book New Session** to open the appointment booking form.
3. In the form:
   * Select the **Yoga Routine** you'd like to practice.
   * Choose the **Date** and **Time**.
   * Click **Schedule Appointment**.
4. View your pending and scheduled bookings under the appointment history table.

### 2.4 Making Payments
1. Go to **My Studio Dashboard** and locate the **Billing & Invoices** card.
2. For any invoice listed as `pending` or `overdue`:
   * Click **Pay Now** to open the payment screen.
   * Scan the generated **UPI QR Code** or tap the payment link.
   * Enter your transaction details once paid to submit the payment claim.

---

## 3. Administrative Functionality

### 3.1 Managing Users & Memberships
1. Go to **User Management** panel on the Admin Dashboard.
2. Find a user in the table and click **Inspect / Manage**.
3. In the user profile container:
   * Update their membership settings (e.g. adjust referral discounts or assigned batches).
   * Click **Save Membership Settings**.

### 3.2 Handling Inquiries (Leads Pipeline)
1. Navigate to the **Leads Pipeline** tab on the Admin Dashboard.
2. Select a lead from the list:
   * Record notes or set a **Follow-up Date** and click **Save Follow-up**.
   * If the lead signs up, click **Convert to Member** to instantly generate their student profile.

### 3.3 Creating Batches & Scheduling Classes
1. Go to the **Batches & Scheduling** panel.
2. **Create a Batch**:
   * Enter **Batch Name**, **Instructor Name**, and max **Capacity**.
   * Add days and times to the timetable.
   * Click **Create Batch**.

### 3.4 Setting Coaching Fees & Managing Bookings
1. Go to the **Appointments Management** tab.
2. **Adjust Fee**:
   * Enter the fee amount in the fee input box.
   * Click **Save Appointment Fee**.
3. **Approve / Cancel Bookings**:
   * Review incoming appointment requests.
   * Approve bookings or click cancel to remove a session.

### 3.5 Managing Email Inbox & Communications
1. Navigate to the **Email Inbox** panel.
2. Click **Connect Gmail** to authorize email connectivity.
3. Filter messages using the **All** / **Unread** buttons.
4. Open a message to review:
   * Click **Reply** to compose and send a response.
   * Approve payment attachments directly by clicking **Approve Payment** or click decline to reject.

### 3.6 Automated UPI Statement Reconciliation
1. Go to the **Payments & Billing** panel on the Admin Dashboard.
2. Select the **Reconciliation Settings** tab:
   * Define the amount tolerance and maximum age window in days.
   * Map the CSV columns to matching fields.
3. Under the upload area, choose your bank statement CSV file.
4. Click **Upload & Run Auto-Reconcile**. The system matches transaction details against unpaid invoices and logs the output in the logs table.

### 3.7 Launching Live Streaming
1. Go to the Admin Dashboard and select the **Live Stream** utility.
2. Click **Launch Live Video Session**. The system initializes the video feed and notifies connected students.
