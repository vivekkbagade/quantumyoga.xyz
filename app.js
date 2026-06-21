/* ==========================================================================
   Quantum Yoga - Application logic
   ========================================================================== */

import { YOGA_POSES, YOGA_ROUTINES } from './data.js';

document.addEventListener("DOMContentLoaded", async () => {
  let isSaving = false;
  let hasPendingSave = false;
  try {
    // Seed initial mock data for testing if empty
  function seedMockData() {
    if (!localStorage.getItem("qy_batches")) {
      localStorage.setItem("qy_batches", JSON.stringify([
        {
          id: "batch-vinyasa-mornings",
          name: "Morning Vinyasa Flow",
          instructor: "David Vance",
          capacity: 15,
          timetable: [
            { day: "Monday", time: "08:00 AM" },
            { day: "Wednesday", time: "08:00 AM" },
            { day: "Friday", time: "08:00 AM" }
          ]
        }
      ]));
    }
    const existingPayments = localStorage.getItem("qy_payments");
    if (!existingPayments) {
      localStorage.setItem("qy_payments", JSON.stringify([
        {
          id: "INV-10029",
          userEmail: "member@quantumyoga.xyz",
          description: "Gold Monthly subscription fee",
          amount: "2499",
          dueDate: "2026-06-30",
          status: "pending"
        },
        {
          id: "INV-10010",
          userEmail: "member@quantumyoga.xyz",
          description: "Private coaching class fee",
          amount: "1500",
          dueDate: "2026-06-10",
          status: "paid",
          paymentDate: "2026-06-08"
        },
        {
          id: "INV-10005",
          userEmail: "member@quantumyoga.xyz",
          description: "Overdue Vinyasa workshop fee",
          amount: "1999",
          dueDate: "2026-05-15",
          status: "overdue"
        }
      ]));
    } else {
      try {
        const payments = JSON.parse(existingPayments);
        if (!payments.some(p => p.id === "INV-10005")) {
          payments.push({
            id: "INV-10005",
            userEmail: "member@quantumyoga.xyz",
            description: "Overdue Vinyasa workshop fee",
            amount: "1999",
            dueDate: "2026-05-15",
            status: "overdue"
          });
          localStorage.setItem("qy_payments", JSON.stringify(payments));
        }
      } catch (e) {
        console.error("Error parsing qy_payments", e);
      }
    }
    if (!localStorage.getItem("qy_appointments")) {
      localStorage.setItem("qy_appointments", JSON.stringify([
        {
          id: "appt-90112",
          studentEmail: "member@quantumyoga.xyz",
          selectedRoutine: "Vinyasa flow routine",
          date: "2026-06-20",
          time: "10:00 AM",
          status: "scheduled"
        }
      ]));
    }
    if (!localStorage.getItem("qy_upi_ledger")) {
      localStorage.setItem("qy_upi_ledger", JSON.stringify([]));
    }
    const users = JSON.parse(localStorage.getItem("qy_users") || "[]");
    const memberIndex = users.findIndex(u => u.email === "member@quantumyoga.xyz");
    if (memberIndex > -1) {
      users[memberIndex].batchId = "batch-vinyasa-mornings";
    } else {
      users.push({
        name: "Sarah Jenkins",
        email: "member@quantumyoga.xyz",
        password: "memberpass",
        favorites: [],
        routineHistory: [],
        theme: "",
        batchId: "batch-vinyasa-mornings"
      });
    }
    localStorage.setItem("qy_users", JSON.stringify(users));

    if (!localStorage.getItem("qy_leads")) {
      localStorage.setItem("qy_leads", JSON.stringify([
        {
          id: "lead-1",
          name: "Michael Chang",
          email: "michael@inquiry.com",
          phone: "+91 98765 00199",
          message: "Would love to know more about the Unlimited VIP package benefits.",
          date: "2026-06-12",
          status: "New",
          logs: [
            {
              timestamp: "2026-06-12, 10:30:00 AM",
              note: "Lead created via landing page inquiry form."
            }
          ]
        },
        {
          id: "lead-2",
          name: "Jessica Taylor",
          email: "jessica@inquiry.com",
          phone: "+91 98765 00144",
          message: "Do you offer prenatal vinyasa classes? Looking for beginners difficulty.",
          date: "2026-06-13",
          status: "Contacted",
          logs: [
            {
              timestamp: "2026-06-14, 09:15:00 AM",
              note: "Called to discuss Vinyasa options. She is interested in beginner level programs."
            },
            {
              timestamp: "2026-06-13, 02:00:00 AM",
              note: "Lead created via landing page inquiry form."
            }
          ]
        }
      ]));
    }
  }

  // Run seed only if it's a fresh browser instance, to avoid overwriting the server database with stale cache
  const isFreshLocal = !localStorage.getItem("qy_batches");
  seedMockData();
  if (isFreshLocal) {
    await saveToServer();
  }

  // Application State
  const state = {
    searchQuery: "",
    categoryFilter: "all",
    difficultyFilter: "all",
    activeTab: "poses", // 'poses' | 'routines' | 'profile'
    currentUser: null,
    activeRoutineId: null
  };

  // DOM Elements
  const posesGrid = document.getElementById("poses-grid");
  const routinesGrid = document.getElementById("routines-grid");
  const posesEmptyState = document.getElementById("poses-empty-state");
  
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const filterCategory = document.getElementById("filter-category");
  const filterDifficulty = document.getElementById("filter-difficulty");
  const resetPosesBtn = document.getElementById("reset-poses-btn");
  
  const sectionPoses = document.getElementById("poses-section");
  const sectionRoutines = document.getElementById("routines-section");
  const sectionProfile = document.getElementById("profile-section");
  
  const navPoses = document.getElementById("nav-poses");
  const navRoutines = document.getElementById("nav-routines");
  const navProfileLink = document.getElementById("nav-profile");
  
  const poseModal = document.getElementById("pose-modal");
  const poseModalBody = document.getElementById("pose-modal-body");
  const closePoseModalBtn = document.getElementById("close-pose-modal");
  
  const videoModal = document.getElementById("video-modal");
  const videoElement = document.getElementById("custom-video-element");
  const closeVideoModalBtn = document.getElementById("close-video-modal");
  
  // Dashboard & Fullscreen Auth Gate DOM Elements
  const dashboardApp = document.getElementById("dashboard-app");
  const authGateFullscreen = document.getElementById("auth-gate-fullscreen");
  
  // Auth DOM Elements
  const loginNavBtn = document.getElementById("login-nav-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userNavPanel = document.getElementById("user-nav-panel");
  const navUserName = document.getElementById("nav-user-name");
  
  const authLoginTabBtn = document.getElementById("auth-login-tab-btn");
  const authRegisterTabBtn = document.getElementById("auth-register-tab-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  const registerNameInput = document.getElementById("register-name");
  const registerEmailInput = document.getElementById("register-email");
  const registerPhoneInput = document.getElementById("register-phone");
  const registerPasswordInput = document.getElementById("register-password");
  const loginErrorMsg = document.getElementById("login-error-msg");
  const registerErrorMsg = document.getElementById("register-error-msg");
  
  const authInquireTabBtn = document.getElementById("auth-inquire-tab-btn");
  const authInquireFormWrapper = document.getElementById("auth-inquire-form-wrapper");
  const inquireForm = document.getElementById("inquire-form");
  const inquireNameInput = document.getElementById("inquire-name");
  const inquireEmailInput = document.getElementById("inquire-email");
  const inquirePhoneInput = document.getElementById("inquire-phone");
  const inquireMessageInput = document.getElementById("inquire-message");
  const inquireSuccessMsg = document.getElementById("inquire-success-msg");
  
  // Profile DOM Elements
  const profileUserName = document.getElementById("profile-user-name");
  const profileUserEmail = document.getElementById("profile-user-email");
  const profileUserPhone = document.getElementById("profile-user-phone");
  const profileStatCompleted = document.getElementById("profile-stat-completed");
  const profileStatFavorites = document.getElementById("profile-stat-favorites");
  const profileFavoritesList = document.getElementById("profile-favorites-list");
  const profileHistoryList = document.getElementById("profile-history-list");
  const profileThemeSelect = document.getElementById("profile-theme-select");
  const profilePhoneInput = document.getElementById("profile-phone-input");
  const profilePhoneSaveBtn = document.getElementById("profile-phone-save-btn");
  const profilePhoneSuccessMsg = document.getElementById("profile-phone-success-msg");
  const profileSandboxOptinWidget = document.getElementById("profile-sandbox-optin-widget");
  
  const profileDashboardTabBtn = document.getElementById("profile-dashboard-tab-btn");
  const profilePracticeTabBtn = document.getElementById("profile-practice-tab-btn");
  const profileDashboardPanel = document.getElementById("profile-dashboard-panel");
  const profilePracticePanel = document.getElementById("profile-practice-panel");
  const profileBatchDetails = document.getElementById("profile-batch-details");
  const profileSessionsFeed = document.getElementById("profile-sessions-feed");
  const profileBillingTableBody = document.getElementById("profile-billing-table-body");
  
  // Payments & Receipts DOM Elements
  const overduePaymentBanner = document.getElementById("overdue-payment-banner");
  const overduePaymentMessage = document.getElementById("overdue-payment-message");
  const closeOverdueBannerBtn = document.getElementById("close-overdue-banner-btn");
  
  const receiptModal = document.getElementById("receipt-modal");
  const receiptModalBody = document.getElementById("receipt-modal-body");
  const closeReceiptModalBtn = document.getElementById("close-receipt-modal");
  
  const adminPaymentsTabBtn = document.getElementById("admin-payments-tab-btn");
  const adminPaymentsPanel = document.getElementById("admin-payments-panel");
  const adminPaymentsTableBody = document.getElementById("admin-payments-table-body");
  const adminIssueInvoiceForm = document.getElementById("admin-issue-invoice-form");
  const adminInvoiceEmail = document.getElementById("admin-invoice-email");
  const adminInvoiceDesc = document.getElementById("admin-invoice-desc");
  const adminInvoiceAmount = document.getElementById("admin-invoice-amount");
  const adminInvoiceDue = document.getElementById("admin-invoice-due");
  
  const adminBillingKpiTotalInvoiced = document.getElementById("admin-billing-kpi-total-invoiced");
  const adminBillingKpiPaid = document.getElementById("admin-billing-kpi-paid");
  const adminBillingKpiPending = document.getElementById("admin-billing-kpi-pending");
  const adminBillingKpiOverdue = document.getElementById("admin-billing-kpi-overdue");
  
  // Member Management DOM Elements
  const profileMembershipTier = document.getElementById("profile-membership-tier");
  const profileMembershipStatus = document.getElementById("profile-membership-status");
  const profileMembershipExpiry = document.getElementById("profile-membership-expiry");
  
  const profileWellnessTabBtn = document.getElementById("profile-wellness-tab-btn");
  const profileWellnessPanel = document.getElementById("profile-wellness-panel");
  const profileWellnessForm = document.getElementById("profile-wellness-form");
  const profileGoalsInput = document.getElementById("profile-goals-input");
  const profileHealthInput = document.getElementById("profile-health-input");
  const profileWellnessSuccessMsg = document.getElementById("profile-wellness-success-msg");
  
  const adminInspectMembershipForm = document.getElementById("admin-inspect-membership-form");
  const inspectMembershipTierSelect = document.getElementById("inspect-membership-tier");
  const inspectMembershipStatusSelect = document.getElementById("inspect-membership-status");
  const inspectMembershipExpiryInput = document.getElementById("inspect-membership-expiry-input");
  const inspectCoachingNotes = document.getElementById("inspect-coaching-notes");
  const inspectMembershipSuccessMsg = document.getElementById("inspect-membership-success-msg");

  let inspectedUserEmail = null;
  
  // Admin DOM Elements
  const navAdmin = document.getElementById("nav-admin");
  const sectionAdmin = document.getElementById("admin-section");
  const adminOverviewTabBtn = document.getElementById("admin-overview-tab-btn");
  const adminUsersTabBtn = document.getElementById("admin-users-tab-btn");
  const adminReportsTabBtn = document.getElementById("admin-reports-tab-btn");
  const adminLeadsTabBtn = document.getElementById("admin-leads-tab-btn");
  const adminSettingsTabBtn = document.getElementById("admin-settings-tab-btn");
  const adminEmailTabBtn = document.getElementById("admin-email-tab-btn");
  
  const adminOverviewPanel = document.getElementById("admin-overview-panel");
  const adminUsersPanel = document.getElementById("admin-users-panel");
  const adminReportsPanel = document.getElementById("admin-reports-panel");
  const adminLeadsPanel = document.getElementById("admin-leads-panel");
  const adminSettingsPanel = document.getElementById("admin-settings-panel");
  const adminEmailPanel = document.getElementById("admin-email-panel");

  // Email panel DOM elements
  const adminInboxEmailList = document.getElementById("admin-inbox-email-list");
  const adminSentEmailList = document.getElementById("admin-sent-email-list");
  const adminUnreadCount = document.getElementById("admin-unread-count");
  const adminSentCount = document.getElementById("admin-sent-count");
  const adminEmailPreviewOverlay = document.getElementById("admin-email-preview-overlay");
  const adminPreviewSubject = document.getElementById("admin-preview-subject");
  const adminPreviewFrom = document.getElementById("admin-preview-from");
  const adminPreviewDate = document.getElementById("admin-preview-date");
  const adminPreviewBody = document.getElementById("admin-preview-body");
  const adminCloseEmailPreview = document.getElementById("admin-close-email-preview");
  const adminPreviewReplyBtn = document.getElementById("admin-preview-reply-btn");
  const adminComposeEmailForm = document.getElementById("admin-compose-email-form");
  const adminEmailTo = document.getElementById("admin-email-to");
  const adminEmailSubject = document.getElementById("admin-email-subject");
  const adminEmailBody = document.getElementById("admin-email-body");
  const adminEmailTemplate = document.getElementById("admin-email-template");
  const adminEmailSendMsg = document.getElementById("admin-email-send-msg");
  const adminGmailConnectBtn = document.getElementById("admin-gmail-connect-btn");
  const adminGmailDisconnectBtn = document.getElementById("admin-gmail-disconnect-btn");
  const adminGmailRefreshBtn = document.getElementById("admin-gmail-refresh-btn");
  const adminGmailConnectedLabel = document.getElementById("admin-gmail-connected-label");
  const adminGmailDisconnectedLabel = document.getElementById("admin-gmail-disconnected-label");
  const adminGmailConnectedEmail = document.getElementById("admin-gmail-connected-email");
  const adminGmailStatusDetail = document.getElementById("admin-gmail-status-detail");
  const adminGmailSettingsForm = document.getElementById("admin-gmail-settings-form");
  const adminGmailClientIdInput = document.getElementById("admin-gmail-client-id");
  const adminGmailSettingsSuccessMsg = document.getElementById("admin-gmail-settings-success-msg");
  // Task 4.1 — Email provider selector DOM vars
  const emailProviderGmailBtn = document.getElementById("email-provider-gmail-btn");
  const emailProviderResendBtn = document.getElementById("email-provider-resend-btn");
  const gmailConfigSection = document.getElementById("gmail-config-section");
  const resendConfigSection = document.getElementById("resend-config-section");
  const resendApiKeyInput = document.getElementById("resend-api-key-input");
  const resendFromAddressInput = document.getElementById("resend-from-address-input");
  const resendSettingsSaveBtn = document.getElementById("resend-settings-save-btn");
  const resendSettingsMsg = document.getElementById("resend-settings-msg");
  // Task 5.2 — Resend status badges in Email tab
  const adminResendActiveLabel = document.getElementById("admin-resend-active-label");
  const adminResendFromDisplay = document.getElementById("admin-resend-from-display");
  const adminResendUnconfiguredLabel = document.getElementById("admin-resend-unconfigured-label");

  // Student email DOM elements
  const profileEmailTabBtn = document.getElementById("profile-email-tab-btn");
  const profileEmailPanel = document.getElementById("profile-email-panel");
  const studentInboxEmailList = document.getElementById("student-inbox-email-list");
  const studentUnreadCount = document.getElementById("student-unread-count");
  const studentComposeEmailForm = document.getElementById("student-compose-email-form");
  const studentEmailSubject = document.getElementById("student-email-subject");
  const studentEmailBody = document.getElementById("student-email-body");
  const studentEmailSendMsg = document.getElementById("student-email-send-msg");
  
  // Admin UPI Settings DOM Elements
  const adminUpiSettingsForm = document.getElementById("admin-upi-settings-form");
  const adminUpiVpaInput = document.getElementById("admin-upi-vpa");
  const adminUpiNameInput = document.getElementById("admin-upi-name");
  const adminUpiSuccessMsg = document.getElementById("admin-upi-settings-success-msg");

  // Client UPI Payment Modal DOM Elements
  const upiPaymentModal = document.getElementById("upi-payment-modal");
  const closeUpiPaymentModalBtn = document.getElementById("close-upi-payment-modal");
  const upiPayInvoiceId = document.getElementById("upi-pay-invoice-id");
  const upiPayInvoiceDesc = document.getElementById("upi-pay-invoice-desc");
  const upiPayInvoiceAmount = document.getElementById("upi-pay-invoice-amount");
  const upiQrImage = document.getElementById("upi-qr-image");
  const upiPayRecipientName = document.getElementById("upi-pay-recipient-name");
  const upiPayRecipientVpa = document.getElementById("upi-pay-recipient-vpa");
  const upiPaymentUtrForm = document.getElementById("upi-payment-utr-form");
  const upiPaymentUtrInput = document.getElementById("upi-payment-utr");
  
  // Admin Batches DOM Elements
  const adminBatchesTabBtn = document.getElementById("admin-batches-tab-btn");
  const adminBatchesPanel = document.getElementById("admin-batches-panel");
  const adminCreateBatchForm = document.getElementById("admin-create-batch-form");
  const adminBatchNameInput = document.getElementById("admin-batch-name-input");
  const adminBatchInstructorInput = document.getElementById("admin-batch-instructor-input");
  const adminBatchCapacityInput = document.getElementById("admin-batch-capacity-input");
  const adminBatchesTableBody = document.getElementById("admin-batches-table-body");
  
  const adminScheduleClassForm = document.getElementById("admin-schedule-class-form");
  const adminScheduleBatchSelect = document.getElementById("admin-schedule-batch-select");
  const adminScheduleWeekdaySelect = document.getElementById("admin-schedule-weekday-select");
  const adminScheduleTimeInput = document.getElementById("admin-schedule-time-input");
  const adminScheduleRoutineSelect = document.getElementById("admin-schedule-routine-select");
  
  const inspectUserBatchSelect = document.getElementById("inspect-user-batch");
  
  // Profile Batches DOM Elements
  const profileBatchTitle = document.getElementById("profile-batch-title");
  const profileTimetableList = document.getElementById("profile-timetable-list");
  const profileClassCountdown = document.getElementById("profile-class-countdown");
  
  // Student Profile Appointments DOM Elements
  const profileAppointmentsTabBtn = document.getElementById("profile-appointments-tab-btn");
  const profileAppointmentsSection = document.getElementById("profile-appointments-section");
  const profileUpcomingAppointments = document.getElementById("profile-upcoming-appointments");
  const profilePastAppointments = document.getElementById("profile-past-appointments");
  const bookAppointmentBtn = document.getElementById("book-appointment-btn");
  
  // Appointment Booking & Rescheduling Modal DOM Elements
  const appointmentModal = document.getElementById("appointment-modal");
  const closeAppointmentModalBtn = document.getElementById("close-appointment-modal");
  const appointmentModalTitle = document.getElementById("appointment-modal-title");
  const appointmentForm = document.getElementById("appointment-form");
  const appointmentStudentGroup = document.getElementById("appointment-student-group");
  const appointmentStudentSelect = document.getElementById("appointment-student-select");
  const appointmentRoutineSelect = document.getElementById("appointment-routine-select");
  const appointmentDateInput = document.getElementById("appointment-date-input");
  const appointmentTimeSelect = document.getElementById("appointment-time-select");
  const saveAppointmentBtn = document.getElementById("save-appointment-btn");
  
  // Admin Appointments Management DOM Elements
  const adminAppointmentsTabBtn = document.getElementById("admin-appointments-tab-btn");
  const adminAppointmentsPanel = document.getElementById("admin-appointments-panel");
  const adminAppointmentsSearchInput = document.getElementById("admin-appointments-search-input");
  const adminBookApptBtn = document.getElementById("admin-book-appt-btn");
  const adminAppointmentsTableBody = document.getElementById("admin-appointments-table-body");
  
  const adminDefaultThemeSelect = document.getElementById("admin-default-theme-select");
  const adminUsersTableBody = document.getElementById("admin-users-table-body");
  
  const adminKpiMembers = document.getElementById("admin-kpi-members");
  const adminKpiRevenue = document.getElementById("admin-kpi-revenue");
  const adminKpiSessions = document.getElementById("admin-kpi-sessions");
  const adminKpiUnpaid = document.getElementById("admin-kpi-unpaid");
  const adminInsightsList = document.getElementById("admin-insights-list");
  const adminTimelineFeed = document.getElementById("admin-timeline-feed");
  const adminPaymentsFeed = document.getElementById("admin-payments-feed");
  
  const adminInspectModal = document.getElementById("admin-inspect-modal");
  const closeInspectModalBtn = document.getElementById("close-inspect-modal");
  const inspectUserName = document.getElementById("inspect-user-name");
  const inspectUserEmail = document.getElementById("inspect-user-email");
  const inspectUserPhone = document.getElementById("inspect-user-phone");
  const inspectUserPhoneInput = document.getElementById("inspect-user-phone-input");
  const inspectStatCompleted = document.getElementById("inspect-stat-completed");
  const inspectStatFavorites = document.getElementById("inspect-stat-favorites");
  const inspectFavoritesList = document.getElementById("inspect-favorites-list");
  const inspectHistoryList = document.getElementById("inspect-history-list");

  // Admin Leads Management DOM Elements
  const leadsSwimlaneBoard = document.getElementById("leads-swimlane-board");
  const leadsSearchInput = document.getElementById("leads-search-input");
  const leadsStatusFilter = document.getElementById("leads-status-filter");
  const adminInspectLeadModal = document.getElementById("admin-inspect-lead-modal");
  const closeInspectLeadModalBtn = document.getElementById("close-inspect-lead-modal");
  const inspectLeadName = document.getElementById("inspect-lead-name");
  const inspectLeadEmail = document.getElementById("inspect-lead-email");
  const inspectLeadPhone = document.getElementById("inspect-lead-phone");
  const inspectLeadStatusBadge = document.getElementById("inspect-lead-status-badge");
  const inspectLeadDate = document.getElementById("inspect-lead-date");
  const inspectLeadMessage = document.getElementById("inspect-lead-message");
  const inspectLeadLogs = document.getElementById("inspect-lead-logs");
  const inspectLeadStatus = document.getElementById("inspect-lead-status");
  const inspectLeadNoteInput = document.getElementById("inspect-lead-note-input");
  const saveLeadSettingsBtn = document.getElementById("save-lead-settings-btn");
  const convertLeadBtn = document.getElementById("convert-lead-btn");
  const inspectLeadSuccessMsg = document.getElementById("inspect-lead-success-msg");
  const inspectLeadActionForm = document.getElementById("inspect-lead-action-form");

  let inspectedLeadId = null;
  
  const adminStatTotalUsers = document.getElementById("admin-stat-total-users");
  const adminStatTotalCompletions = document.getElementById("admin-stat-total-completions");
  const adminStatPopularRoutine = document.getElementById("admin-stat-popular-routine");
  const adminStatPopularPose = document.getElementById("admin-stat-popular-pose");
  const adminReportsTableBody = document.getElementById("admin-reports-table-body");
  
  // Video Custom Controls
  const videoPlayPauseBtn = document.getElementById("video-play-pause-btn");
  const playIcon = videoPlayPauseBtn.querySelector(".play-icon");
  const pauseIcon = videoPlayPauseBtn.querySelector(".pause-icon");
  const videoCurrentTime = document.getElementById("video-current-time");
  const videoDuration = document.getElementById("video-duration");
  const videoMuteBtn = document.getElementById("video-mute-btn");
  const speakerIcon = videoMuteBtn.querySelector(".speaker-icon");
  const mutedIcon = videoMuteBtn.querySelector(".muted-icon");
  const videoVolumeSlider = document.getElementById("video-volume-slider");
  const videoFullscreenBtn = document.getElementById("video-fullscreen-btn");
  const videoTimeline = document.getElementById("video-timeline");
  const videoProgressBar = document.getElementById("video-progress-bar");
  const videoBufferedBar = document.getElementById("video-buffered-bar");
  const videoTimelineHandle = document.getElementById("video-timeline-handle");

  // Force Change Password DOM Elements
  const forceChangePasswordOverlay = document.getElementById("force-change-password-overlay");
  const forceChangePasswordForm = document.getElementById("force-change-password-form");
  const forceNewPasswordInput = document.getElementById("force-new-password");
  const forceConfirmPasswordInput = document.getElementById("force-confirm-password");
  const forceChangePasswordErrorMsg = document.getElementById("force-change-password-error-msg");

  // Forgot Password & Remember Me DOM Elements
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const forgotPasswordModal = document.getElementById("forgot-password-modal");
  const closeForgotPasswordModal = document.getElementById("close-forgot-password-modal");
  const forgotPasswordForm = document.getElementById("forgot-password-form");
  const forgotEmailInput = document.getElementById("forgot-email");
  const forgotPasswordErrorMsg = document.getElementById("forgot-password-error-msg");
  const forgotPasswordSuccessMsg = document.getElementById("forgot-password-success-msg");
  const loginRememberCheckbox = document.getElementById("login-remember");

  // ==========================================================================
  // Core Rendering Logic
  // ==========================================================================

  // Render Poses Directory
  function renderPoses() {
    posesGrid.innerHTML = "";
    
    const filteredPoses = YOGA_POSES.filter(pose => {
      const matchesSearch = 
        pose.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        pose.sanskrit.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        pose.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        pose.description.toLowerCase().includes(state.searchQuery.toLowerCase());
        
      const matchesCategory = 
        state.categoryFilter === "all" || 
        pose.category.toLowerCase() === state.categoryFilter;
        
      const matchesDifficulty = 
        state.difficultyFilter === "all" || 
        pose.difficulty.toLowerCase() === state.difficultyFilter;
        
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (filteredPoses.length === 0) {
      posesGrid.style.display = "none";
      posesEmptyState.style.display = "block";
      return;
    }

    posesGrid.style.display = "grid";
    posesEmptyState.style.display = "none";

    filteredPoses.forEach(pose => {
      const card = document.createElement("div");
      card.className = "card";
      
      const difficultyClass = `badge-difficulty-${pose.difficulty.toLowerCase()}`;
      const isFavorite = state.currentUser && state.currentUser.favorites && state.currentUser.favorites.includes(pose.id);
      
      card.innerHTML = `
        <div class="card-media-wrapper">
          <div class="card-badge-group">
            <span class="badge ${difficultyClass}">${pose.difficulty}</span>
            <span class="badge badge-category">${pose.category}</span>
          </div>
          <button class="pose-fav-btn ${isFavorite ? 'active' : ''}" data-id="${pose.id}" aria-label="Favorite" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-glass); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${isFavorite ? 'var(--accent-secondary)' : '#9ca3af'}; transition: var(--transition-fast); z-index: 15; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          ${pose.svgMarkup}
        </div>
        <div class="card-content">
          <h3 class="card-title">${pose.name}</h3>
          <p class="card-desc">${pose.description}</p>
          <div class="card-metadata">
            <div class="metadata-item">
              <span class="metadata-icon">🧘</span>
              <span>${pose.sanskrit}</span>
            </div>
            <button class="btn btn-primary btn-sm view-pose-btn" data-id="${pose.id}">
              Details
            </button>
          </div>
        </div>
      `;
      
      // Bind details button click
      card.querySelector(".view-pose-btn").addEventListener("click", () => {
        openPoseModal(pose.id);
      });
      
      // Bind favorite button click
      card.querySelector(".pose-fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(pose.id);
      });
      
      posesGrid.appendChild(card);
    });
  }

  // Render Routines Directory
  function renderRoutines() {
    routinesGrid.innerHTML = "";
    
    YOGA_ROUTINES.forEach(routine => {
      const card = document.createElement("div");
      card.className = "card card-routine";
      
      card.innerHTML = `
        <div class="card-media-wrapper" style="background-image: url('${routine.posterUrl}'); background-size: cover; background-position: center; min-height: 200px;">
          <div class="card-badge-group">
            <span class="badge badge-difficulty-${routine.difficulty.toLowerCase()}">${routine.difficulty}</span>
            <span class="badge badge-category">${routine.focus}</span>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${routine.name}</h3>
          <p class="card-desc">${routine.description}</p>
          <div class="card-metadata">
            <div class="metadata-item">
              <span class="metadata-icon">⏱️</span>
              <span>${routine.duration}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-icon">📋</span>
              <span>${routine.poses.length} Poses</span>
            </div>
            <button class="btn btn-rose btn-sm view-routine-btn" data-id="${routine.id}">
              Start Routine
            </button>
          </div>
        </div>
      `;
      
      card.querySelector(".view-routine-btn").addEventListener("click", () => {
        openRoutineModal(routine.id);
      });
      
      routinesGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // Modal Management
  // ==========================================================================

  // Open Pose Details Modal
  function openPoseModal(poseId) {
    const pose = YOGA_POSES.find(p => p.id === poseId);
    if (!pose) return;

    const difficultyClass = `badge-difficulty-${pose.difficulty.toLowerCase()}`;
    const benefitsList = pose.benefits.map(b => `<li>${b}</li>`).join("");
    const instructionsList = pose.instructions.map(i => `<li>${i}</li>`).join("");

    poseModalBody.innerHTML = `
      <div class="pose-detail-layout">
        <div class="pose-detail-media">
          ${pose.svgMarkup}
        </div>
        <div class="pose-detail-info">
          <h2>${pose.name}</h2>
          <div class="pose-detail-badges">
            <span class="badge ${difficultyClass}">${pose.difficulty}</span>
            <span class="badge badge-category">${pose.category}</span>
            <span class="badge badge-category">⏱️ ${pose.duration}</span>
          </div>
          <p class="pose-detail-description"><strong>Sanskrit:</strong> <em>${pose.sanskrit}</em><br><br>${pose.description}</p>
          
          <h4 class="pose-section-title">✨ Key Benefits</h4>
          <ul class="pose-benefits-list">
            ${benefitsList}
          </ul>
          
          <h4 class="pose-section-title">👣 Step-by-Step Instructions</h4>
          <ol class="pose-instructions-list">
            ${instructionsList}
          </ol>
          
          <div class="pose-detail-actions">
            <button class="btn btn-primary play-pose-guide-btn">
              ▶ Play Guide
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind modal video button
    poseModalBody.querySelector(".play-pose-guide-btn").addEventListener("click", () => {
      state.activeRoutineId = null;
      openVideoPlayer(pose.videoUrl, pose.posterUrl);
    });

    poseModal.classList.add("active");
    poseModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // disable background scrolling
  }

  // Close Pose Modal
  function closePoseModal() {
    poseModal.classList.remove("active");
    poseModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Open Routine Details Modal
  function openRoutineModal(routineId) {
    const routine = YOGA_ROUTINES.find(r => r.id === routineId);
    if (!routine) return;

    // Generate steps HTML
    let posesHTML = "";
    routine.poses.forEach((step, idx) => {
      const poseInfo = YOGA_POSES.find(p => p.id === step.poseId);
      if (poseInfo) {
        posesHTML += `
          <div class="routine-pose-item">
            <div class="routine-pose-num">${idx + 1}</div>
            <div class="routine-pose-meta">
              <h4>${poseInfo.name}</h4>
              <p>${poseInfo.sanskrit} • ${poseInfo.category}</p>
            </div>
            <div class="routine-pose-duration">⏱️ ${step.duration}</div>
          </div>
        `;
      }
    });

    poseModalBody.innerHTML = `
      <div class="routine-step-panel">
        <div class="routine-flow-header">
          <div>
            <h2>${routine.name}</h2>
            <p style="margin-top:0.25rem;">Focus Area: <strong>${routine.focus}</strong></p>
          </div>
          <span class="badge routine-duration-pill">⏱️ ${routine.duration}</span>
        </div>
        
        <p class="pose-detail-description">${routine.description}</p>
        
        <h4 class="pose-section-title">Sequence Order (${routine.poses.length} Steps)</h4>
        <div class="routine-pose-list">
          ${posesHTML}
        </div>
        
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button class="btn btn-rose play-routine-guide-btn" style="width: 60%; font-size: 0.85rem;">
            ▶ Start Guided Flow
          </button>
          <button class="btn btn-secondary complete-routine-btn" style="width: 40%; font-size: 0.85rem;">
            ✓ Complete
          </button>
        </div>
      </div>
    `;

    poseModalBody.querySelector(".play-routine-guide-btn").addEventListener("click", () => {
      state.activeRoutineId = routine.id;
      openVideoPlayer(routine.videoUrl, routine.posterUrl);
    });

    poseModalBody.querySelector(".complete-routine-btn").addEventListener("click", () => {
      if (!state.currentUser) {
        openAuthModal();
        return;
      }
      state.activeRoutineId = routine.id;
      handleVideoCompletion();
    });

    poseModal.classList.add("active");
    poseModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // ==========================================================================
  // Custom HTML5 Video Player Overlay
  // ==========================================================================

  function openVideoPlayer(videoUrl, posterUrl) {
    videoElement.src = videoUrl;
    videoElement.poster = posterUrl;
    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    
    // Attempt playback immediately
    videoElement.play()
      .then(() => updatePlayPauseState(true))
      .catch(err => {
        console.log("Autoplay blocked, showing play icon:", err);
        updatePlayPauseState(false);
      });
  }

  function closeVideoPlayer() {
    videoElement.pause();
    videoElement.src = "";
    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");
    updatePlayPauseState(false);
  }

  function updatePlayPauseState(isPlaying) {
    if (isPlaying) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      updatePlayPauseState(true);
    } else {
      videoElement.pause();
      updatePlayPauseState(false);
    }
  }

  // Formatting utility for duration (mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Update Progress bars & Time Display
  function updateProgress() {
    const cur = videoElement.currentTime;
    const dur = videoElement.duration || 0;
    
    // Calculate current progress
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    videoProgressBar.style.width = `${pct}%`;
    videoTimelineHandle.style.left = `${pct}%`;
    videoCurrentTime.textContent = formatTime(cur);
    videoDuration.textContent = formatTime(dur);

    // Calculate buffered range
    if (videoElement.buffered.length > 0 && dur > 0) {
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      const bufPct = (bufferedEnd / dur) * 100;
      videoBufferedBar.style.width = `${bufPct}%`;
    }
  }

  // Scrub timeline to location
  function scrubVideo(e) {
    const rect = videoTimeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    
    if (videoElement.duration) {
      videoElement.currentTime = ratio * videoElement.duration;
    }
  }

  // Drag scrub handling
  let isDraggingScrub = false;
  
  videoTimeline.addEventListener("mousedown", (e) => {
    isDraggingScrub = true;
    scrubVideo(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingScrub) {
      scrubVideo(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDraggingScrub = false;
  });

  // Mute / Unmute
  function toggleMute() {
    videoElement.muted = !videoElement.muted;
    if (videoElement.muted) {
      speakerIcon.style.display = "none";
      mutedIcon.style.display = "block";
      videoVolumeSlider.value = 0;
    } else {
      speakerIcon.style.display = "block";
      mutedIcon.style.display = "none";
      videoVolumeSlider.value = videoElement.volume || 1;
    }
  }

  // Volume slider change
  function handleVolumeChange() {
    const vol = parseFloat(videoVolumeSlider.value);
    videoElement.volume = vol;
    if (vol === 0) {
      videoElement.muted = true;
      speakerIcon.style.display = "none";
      mutedIcon.style.display = "block";
    } else {
      videoElement.muted = false;
      speakerIcon.style.display = "block";
      mutedIcon.style.display = "none";
    }
  }

  // Fullscreen
  function toggleFullscreen() {
    const playerContainer = videoModal.querySelector(".video-player-container");
    if (!document.fullscreenElement) {
      if (playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen();
      } else if (playerContainer.webkitRequestFullscreen) { /* Safari */
        playerContainer.webkitRequestFullscreen();
      } else if (playerContainer.msRequestFullscreen) { /* IE11 */
        playerContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Bind video element events
  videoElement.addEventListener("click", togglePlay);
  videoElement.addEventListener("timeupdate", updateProgress);
  videoElement.addEventListener("durationchange", updateProgress);
  videoElement.addEventListener("play", () => updatePlayPauseState(true));
  videoElement.addEventListener("pause", () => updatePlayPauseState(false));
  videoElement.addEventListener("ended", () => {
    handleVideoCompletion();
  });

  // Bind control buttons
  videoPlayPauseBtn.addEventListener("click", togglePlay);
  videoMuteBtn.addEventListener("click", toggleMute);
  videoVolumeSlider.addEventListener("input", handleVolumeChange);
  videoFullscreenBtn.addEventListener("click", toggleFullscreen);
  closeVideoModalBtn.addEventListener("click", closeVideoPlayer);

  // Close modals on overlay clicks
  poseModal.addEventListener("click", (e) => {
    if (e.target === poseModal) closePoseModal();
  });
  
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideoPlayer();
  });

  closePoseModalBtn.addEventListener("click", closePoseModal);

  // Esc key closure
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (videoModal.classList.contains("active")) {
        closeVideoPlayer();
      } else if (poseModal.classList.contains("active")) {
        closePoseModal();
      } else if (adminInspectModal.classList.contains("active")) {
        closeInspectModal();
      } else if (receiptModal && receiptModal.classList.contains("active")) {
        closeReceiptModal();
      } else if (adminInspectLeadModal && adminInspectLeadModal.classList.contains("active")) {
        closeInspectLeadModal();
      } else if (upiPaymentModal && upiPaymentModal.classList.contains("active")) {
        closeUpiPaymentModal();
      }
    }
  });

  // Formatting utility for YYYY-MM-DD to DD-MM-YYYY
  function formatDateToIndian(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  // Formatting utility for Indian mobile phone numbers (+91 XXXXX XXXXX)
  function formatIndianPhone(phoneStr) {
    if (!phoneStr) return "";
    const clean = phoneStr.replace(/[\s-]/g, "");
    
    // Check if it fits standard formats:
    // +919876543210 (13 chars) or 09876543210 (11 chars) or 9876543210 (10 chars)
    let mainPart = "";
    if (clean.startsWith("+91") && clean.length === 13) {
      mainPart = clean.slice(3);
    } else if (clean.startsWith("91") && clean.length === 12) {
      mainPart = clean.slice(2);
    } else if (clean.startsWith("0") && clean.length === 11) {
      mainPart = clean.slice(1);
    } else if (clean.length === 10) {
      mainPart = clean;
    } else {
      return phoneStr; // fallback if it doesn't match standard lengths
    }
    
    // Check if it starts with 6-9
    if (/^[6-9]\d{9}$/.test(mainPart)) {
      return `+91 ${mainPart.slice(0, 5)} ${mainPart.slice(5)}`;
    }
    return phoneStr;
  }

  // Helper to generate a random secure alphanumeric password
  function generateRandomPassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // ==========================================================================
  // Interactions & Filter Listeners
  // ==========================================================================

  // Tab switcher poses vs routines vs profile vs admin
  function setTab(tabName) {
    if (tabName === "profile" && state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") {
      setTab("admin");
      return;
    }
    state.activeTab = tabName;
    
    // Clear all tab active classes
    navPoses.classList.remove("active");
    navRoutines.classList.remove("active");
    navProfileLink.classList.remove("active");
    navAdmin.classList.remove("active");
    
    sectionPoses.classList.remove("active");
    sectionRoutines.classList.remove("active");
    sectionProfile.classList.remove("active");
    sectionAdmin.classList.remove("active");
    
    if (tabName === "poses") {
      navPoses.classList.add("active");
      sectionPoses.classList.add("active");
    } else if (tabName === "routines") {
      navRoutines.classList.add("active");
      sectionRoutines.classList.add("active");
    } else if (tabName === "profile") {
      navProfileLink.classList.add("active");
      sectionProfile.classList.add("active");
      updateUIForLogin();
    } else if (tabName === "admin") {
      if (!state.currentUser || state.currentUser.email !== "admin@quantumyoga.xyz") {
        setTab("poses");
        return;
      }
      navAdmin.classList.add("active");
      sectionAdmin.classList.add("active");
      renderAdminDashboard();
    }
  }

  navPoses.addEventListener("click", () => setTab("poses"));
  navRoutines.addEventListener("click", () => setTab("routines"));
  navProfileLink.addEventListener("click", () => setTab("profile"));
  navAdmin.addEventListener("click", () => setTab("admin"));

  // Search input change
  searchInput.addEventListener("input", () => {
    state.searchQuery = searchInput.value;
    if (state.searchQuery.length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
    renderPoses();
  });

  // Clear search input
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderPoses();
  });

  // Filter dropdown listeners
  filterCategory.addEventListener("change", () => {
    state.categoryFilter = filterCategory.value.toLowerCase();
    renderPoses();
  });

  filterDifficulty.addEventListener("change", () => {
    state.difficultyFilter = filterDifficulty.value.toLowerCase();
    renderPoses();
  });

  // Reset filter buttons
  function resetAllFilters() {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    
    filterCategory.value = "all";
    state.categoryFilter = "all";
    
    filterDifficulty.value = "all";
    state.difficultyFilter = "all";
    
    renderPoses();
  }

  resetPosesBtn.addEventListener("click", resetAllFilters);

  // Dynamic spotlight card interaction
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    }
  });

  // ==========================================================================
  // User Authentication, Sessions & Profile Dashboard
  // ==========================================================================

  // LocalStorage Keys
  const STORAGE_KEY_USERS = "qy_users";
  const STORAGE_KEY_SESSION = "qy_session";
  const STORAGE_KEY_LEADS = "qy_leads";
  const STORAGE_KEY_UPI_SETTINGS = "qy_upi_settings";
  const STORAGE_KEY_APPOINTMENT_FEE = "qy_appointment_fee";
  const STORAGE_KEY_EMAILS = "qy_emails";
  const STORAGE_KEY_GMAIL_SETTINGS = "qy_gmail_settings";
  const STORAGE_KEY_WHATSAPP_SETTINGS = "qy_whatsapp_settings";
  const DEFAULT_UPI_VPA = "quantumyoga@upi";
  const DEFAULT_UPI_NAME = "Quantum Yoga Studio";

  function populateWhatsAppSettingsInputs(settings) {
    const enabledCheckbox = document.getElementById("whatsapp-enabled-checkbox");
    const apiKeyInput = document.getElementById("whatsapp-api-key");
    const gatewayUrlInput = document.getElementById("whatsapp-gateway-url");
    const templateBookingTextarea = document.getElementById("whatsapp-template-booking");
    
    if (enabledCheckbox) enabledCheckbox.checked = !!settings.enabled;
    if (apiKeyInput) apiKeyInput.value = settings.apiKey || "";
    if (gatewayUrlInput) gatewayUrlInput.value = settings.gatewayUrl || "";
    if (templateBookingTextarea) {
      templateBookingTextarea.value = settings.templates?.booking || "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}.";
    }
  }

  // Asynchronous database synchronization helpers
  async function loadFromServer() {
    try {
      const response = await fetch('/api/db');
      if (response.ok) {
        const db = await response.json();
        if (db && Object.keys(db).length > 0) {
          if (db.users) localStorage.setItem("qy_users", JSON.stringify(db.users));
          if (db.leads) localStorage.setItem("qy_leads", JSON.stringify(db.leads));
          if (db.upi_settings) localStorage.setItem("qy_upi_settings", JSON.stringify(db.upi_settings));
          if (db.batches) localStorage.setItem("qy_batches", JSON.stringify(db.batches));
           if (db.payments) localStorage.setItem("qy_payments", JSON.stringify(db.payments));
          if (db.appointments) localStorage.setItem("qy_appointments", JSON.stringify(db.appointments));
          if (db.upi_ledger) localStorage.setItem("qy_upi_ledger", JSON.stringify(db.upi_ledger));
          
          // Auto-sync any old/historically mismatched cancelled appointments with their billing records
          syncCancelledAppointmentsWithBilling();
          if (db.site_default_theme) localStorage.setItem("qy_site_default_theme", db.site_default_theme);
          if (db.appointment_fee !== undefined) {
            localStorage.setItem(STORAGE_KEY_APPOINTMENT_FEE, String(db.appointment_fee));
            // Update admin setting input immediately if it exists
            const apptFeeInput = document.getElementById("admin-appointment-fee-input");
            if (apptFeeInput) {
              apptFeeInput.value = String(db.appointment_fee);
            }
          }
          // Load Gmail data from server
          if (db.emails) localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(db.emails));
          if (db.gmailSettings) {
            const currentRaw = localStorage.getItem(STORAGE_KEY_GMAIL_SETTINGS);
            const current = currentRaw ? JSON.parse(currentRaw) : {};
            const merged = {
              ...db.gmailSettings,
              resendApiKey: current.resendApiKey || "",
              accessToken: current.accessToken || "",
              tokenExpiry: current.tokenExpiry || 0
            };
            localStorage.setItem(STORAGE_KEY_GMAIL_SETTINGS, JSON.stringify(merged));
          }

          if (db.whatsappSettings) {
            localStorage.setItem(STORAGE_KEY_WHATSAPP_SETTINGS, JSON.stringify(db.whatsappSettings));
            populateWhatsAppSettingsInputs(db.whatsappSettings);
          }

          // Trigger UI updates to reflect fresh database data
          renderStudentAppointments();
          renderAdminAppointments();
          if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") {
            renderAdminOverview();
            renderAdminBatches();
            renderAdminPayments();
          }
        }
      }
    } catch (err) {
      console.warn("Could not load database state from server. Using local storage fallback.", err);
    }
  }

  async function saveToServer() {
    if (isSaving) {
      hasPendingSave = true;
      return;
    }
    isSaving = true;
    try {
      const gmailSettingsRaw = localStorage.getItem(STORAGE_KEY_GMAIL_SETTINGS);
      const gmailSettingsParsed = gmailSettingsRaw ? JSON.parse(gmailSettingsRaw) : { clientId: "", connectedEmail: "", accessToken: "", tokenExpiry: 0 };
      // Task 1.3 — include provider and resendFromAddress in server payload
      // (resendApiKey intentionally omitted server-side; same policy as accessToken)
      const gmailSettingsForDb = {
        clientId: gmailSettingsParsed.clientId || "",
        connectedEmail: gmailSettingsParsed.connectedEmail || "",
        provider: gmailSettingsParsed.provider || "resend",
        resendFromAddress: gmailSettingsParsed.resendFromAddress || ""
      };

      const whatsappSettingsRaw = localStorage.getItem(STORAGE_KEY_WHATSAPP_SETTINGS);
      const whatsappSettingsParsed = whatsappSettingsRaw ? JSON.parse(whatsappSettingsRaw) : { enabled: false, apiKey: "", gatewayUrl: "", templates: { welcome: "Hello {{name}}, welcome to Quantum Yoga! Your temporary password is {{tempPass}}.", invoice: "Hello {{name}}, a new invoice {{invoiceId}} for {{amount}} is due on {{dueDate}}. Pay here: {{link}}", booking: "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}." } };

      const db = {
        users: JSON.parse(localStorage.getItem("qy_users") || "[]"),
        leads: JSON.parse(localStorage.getItem("qy_leads") || "[]"),
        upi_settings: JSON.parse(localStorage.getItem("qy_upi_settings") || "null"),
        batches: JSON.parse(localStorage.getItem("qy_batches") || "[]"),
        payments: JSON.parse(localStorage.getItem("qy_payments") || "[]"),
        appointments: JSON.parse(localStorage.getItem("qy_appointments") || "[]"),
        site_default_theme: localStorage.getItem("qy_site_default_theme") || "midnight",
        appointment_fee: Number(localStorage.getItem(STORAGE_KEY_APPOINTMENT_FEE) || 0),
        emails: JSON.parse(localStorage.getItem(STORAGE_KEY_EMAILS) || "[]"),
        upi_ledger: JSON.parse(localStorage.getItem("qy_upi_ledger") || "[]"),
        gmailSettings: gmailSettingsForDb,
        whatsappSettings: whatsappSettingsParsed
      };
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(db)
      });
    } catch (err) {
      console.warn("Could not save database state to server.", err);
    } finally {
      isSaving = false;
      if (hasPendingSave) {
        hasPendingSave = false;
        await saveToServer();
      }
    }
  }

  // ==========================================================================
  // Gmail Integration — Data Helpers (Tasks 2.1–2.5)
  // ==========================================================================

  function loadGmailSettings() {
    const data = localStorage.getItem(STORAGE_KEY_GMAIL_SETTINGS);
    let settings;
    if (data) {
      try { settings = JSON.parse(data); } catch (e) { settings = null; }
    }
    if (!settings) {
      settings = { clientId: "", connectedEmail: "", accessToken: "", tokenExpiry: 0 };
    }
    // Task 1.2 — backward-compat: apply defaults for new Resend fields
    if (!settings.provider) settings.provider = "resend";
    if (settings.resendApiKey === undefined) settings.resendApiKey = "";
    if (settings.resendFromAddress === undefined) settings.resendFromAddress = "";
    return settings;
  }

  function saveGmailSettings(settings) {
    localStorage.setItem(STORAGE_KEY_GMAIL_SETTINGS, JSON.stringify(settings));
    saveToServer(); // persists only clientId + connectedEmail
  }

  function loadEmails() {
    const data = localStorage.getItem(STORAGE_KEY_EMAILS);
    const emails = data ? JSON.parse(data) : [];
    let modified = false;
    emails.forEach(e => {
      const toStr = (e.to || "").toLowerCase();
      if (toStr.includes("admin@quantumyoga.xyz") && (e.folder === "sent" || e.direction === "sent")) {
        e.folder = "inbox";
        e.direction = "received";
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(emails));
      saveToServer();
    }
    return emails;
  }

  function saveEmails(emails) {
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(emails));
    saveToServer();
  }

  function isGmailConnected() {
    const gs = loadGmailSettings();
    return !!(gs.connectedEmail && gs.accessToken && gs.tokenExpiry > Date.now());
  }

  // Returns the stored access token, or null if it has expired
  function getGmailAccessToken() {
    const gs = loadGmailSettings();
    if (gs.accessToken && gs.tokenExpiry > Date.now()) return gs.accessToken;
    return null;
  }

  // ==========================================================================
  // Gmail Integration — OAuth2 via GIS (Tasks 2.1–2.5)
  // ==========================================================================

  let gmailTokenClient = null;
  let gmailTokenCallback = null;

  /**
   * Initialise the GIS token client using the admin-configured Client ID.
   * Must be called after the GIS script has loaded.
   * Returns true if initialised successfully.
   */
  function initGmailClient() {
    const gs = loadGmailSettings();
    if (!gs.clientId) {
      console.warn("Gmail Client ID not configured. Visit Admin > Settings > Gmail Integration.");
      return false;
    }
    if (typeof google === "undefined" || !google.accounts || !google.accounts.oauth2) {
      console.warn("Google Identity Services not loaded yet.");
      return false;
    }
    gmailTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: gs.clientId,
      scope: "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email",
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          const currentGs = loadGmailSettings();
          currentGs.accessToken = tokenResponse.access_token;
          currentGs.tokenExpiry = Date.now() + (tokenResponse.expires_in || 3600) * 1000;
          // Fetch the connected Gmail address
          fetchGmailUserInfo(tokenResponse.access_token).then(email => {
            currentGs.connectedEmail = email || currentGs.connectedEmail;
            saveGmailSettings(currentGs);
            if (typeof gmailTokenCallback === "function") {
              gmailTokenCallback(true, email);
              gmailTokenCallback = null;
            }
            updateGmailStatusUI();
          });
        } else {
          if (typeof gmailTokenCallback === "function") {
            gmailTokenCallback(false, null);
            gmailTokenCallback = null;
          }
        }
      }
    });
    return true;
  }

  async function fetchGmailUserInfo(accessToken) {
    try {
      const resp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (resp.ok) {
        const info = await resp.json();
        return info.email || null;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function connectGmail(onDone) {
    if (!initGmailClient()) {
      if (typeof onDone === "function") onDone(false, "Gmail client not initialised. Check Client ID in Settings.");
      return;
    }
    gmailTokenCallback = onDone;
    gmailTokenClient.requestAccessToken();
  }

  function disconnectGmail() {
    const gs = loadGmailSettings();
    if (gs.accessToken && typeof google !== "undefined" && google.accounts && google.accounts.oauth2) {
      google.accounts.oauth2.revoke(gs.accessToken, () => {
        console.log("Gmail token revoked.");
      });
    }
    gs.accessToken = "";
    gs.tokenExpiry = 0;
    gs.connectedEmail = "";
    saveGmailSettings(gs);
    // Clear cached emails
    saveEmails([]);
    updateGmailStatusUI();
  }

  // ==========================================================================
  // Gmail Integration — API Service Layer (Tasks 3.1–3.5)
  // ==========================================================================

  const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1";

  /**
   * Fetches inbox messages from the Gmail API and merges them into local email store.
   * Returns the list of emails.
   */
  async function gmailFetchInbox(maxResults = 30) {
    const token = getGmailAccessToken();
    if (!token) {
      console.warn("No valid Gmail access token. Please reconnect Gmail.");
      return loadEmails();
    }
    try {
      const listResp = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!listResp.ok) throw new Error(`Gmail API error: ${listResp.status}`);
      const listData = await listResp.json();
      const messages = listData.messages || [];

      // Fetch each message detail in parallel (limited to avoid rate limits)
      const details = await Promise.all(
        messages.slice(0, maxResults).map(msg =>
          fetch(`${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(r => r.ok ? r.json() : null)
        )
      );

      const existingEmails = loadEmails();
      const existingIds = new Set(existingEmails.map(e => e.id));
      const gs = loadGmailSettings();

      details.forEach(msg => {
        if (!msg) return;
        const headers = msg.payload && msg.payload.headers ? msg.payload.headers : [];
        const getHeader = name => (headers.find(h => h.name === name) || {}).value || "";
        const emailObj = {
          id: msg.id,
          threadId: msg.threadId,
          from: getHeader("From"),
          to: getHeader("To"),
          subject: getHeader("Subject") || "(No Subject)",
          date: getHeader("Date"),
          snippet: msg.snippet || "",
          labelIds: msg.labelIds || [],
          isRead: !(msg.labelIds || []).includes("UNREAD"),
          folder: "inbox",
          direction: "received",
          connectedEmail: gs.connectedEmail
        };
        if (!existingIds.has(emailObj.id)) {
          existingEmails.push(emailObj);
          existingIds.add(emailObj.id);
        } else {
          // Update read status
          const idx = existingEmails.findIndex(e => e.id === emailObj.id);
          if (idx > -1) existingEmails[idx].isRead = emailObj.isRead;
        }
      });

      saveEmails(existingEmails);
      return existingEmails;
    } catch (err) {
      console.error("Error fetching Gmail inbox:", err);
      return loadEmails();
    }
  }

  /**
   * Fetches Sent folder messages from Gmail and merges them.
   */
  async function gmailFetchSent(maxResults = 20) {
    const token = getGmailAccessToken();
    if (!token) return loadEmails();
    try {
      const listResp = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}&labelIds=SENT`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!listResp.ok) return loadEmails();
      const listData = await listResp.json();
      const messages = listData.messages || [];

      const details = await Promise.all(
        messages.slice(0, maxResults).map(msg =>
          fetch(`${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(r => r.ok ? r.json() : null)
        )
      );

      const existingEmails = loadEmails();
      const existingIds = new Set(existingEmails.map(e => e.id));
      const gs = loadGmailSettings();

      details.forEach(msg => {
        if (!msg) return;
        const headers = msg.payload && msg.payload.headers ? msg.payload.headers : [];
        const getHeader = name => (headers.find(h => h.name === name) || {}).value || "";
        const emailObj = {
          id: msg.id,
          threadId: msg.threadId,
          from: getHeader("From"),
          to: getHeader("To"),
          subject: getHeader("Subject") || "(No Subject)",
          date: getHeader("Date"),
          snippet: msg.snippet || "",
          labelIds: msg.labelIds || [],
          isRead: true,
          folder: "sent",
          direction: "sent",
          connectedEmail: gs.connectedEmail
        };
        if (!existingIds.has(emailObj.id)) {
          existingEmails.push(emailObj);
          existingIds.add(emailObj.id);
        }
      });

      saveEmails(existingEmails);
      return existingEmails;
    } catch (err) {
      console.error("Error fetching Gmail sent:", err);
      return loadEmails();
    }
  }

  /**
   * Fetches the full body of a specific message.
   */
  async function gmailGetMessageBody(messageId) {
    const token = getGmailAccessToken();
    if (!token) return null;
    try {
      const resp = await fetch(
        `${GMAIL_API_BASE}/users/me/messages/${messageId}?format=full`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      return extractEmailBody(data.payload);
    } catch (e) {
      console.error("Error fetching message body:", e);
      return null;
    }
  }

  /**
   * Fetches sent/received email lists from Resend.
   */
  async function resendFetchInbox() {
    const es = loadGmailSettings();
    const apiKey = es.resendApiKey || "";
    if (!apiKey) return loadEmails();
    try {
      const resp = await fetch(`/api/resend-emails?apiKey=${encodeURIComponent(apiKey)}&type=receiving`);
      if (!resp.ok) throw new Error(`Resend API error: ${resp.status}`);
      const result = await resp.json();
      const items = result.data || [];

      const existingEmails = loadEmails();
      const existingIds = new Set(existingEmails.map(e => e.id));

      items.forEach(item => {
        const id = "resend-" + item.id;
        const toField = Array.isArray(item.to) ? item.to.join(", ") : (item.to || "");
        const fromField = Array.isArray(item.from) ? item.from.join(", ") : (item.from || "");
        const emailObj = {
          id: id,
          threadId: "",
          from: fromField,
          to: toField,
          subject: item.subject || "(No Subject)",
          date: item.created_at || new Date().toUTCString(),
          snippet: item.subject || "",
          labelIds: [],
          isRead: true,
          folder: "inbox",
          direction: "received",
          connectedEmail: es.resendFromAddress || "admin@quantumyoga.xyz"
        };
        if (!existingIds.has(id)) {
          existingEmails.push(emailObj);
          existingIds.add(id);
        }
      });
      saveEmails(existingEmails);
      return existingEmails;
    } catch (e) {
      console.error("Error fetching Resend receiving inbox:", e);
      return loadEmails();
    }
  }

  async function resendFetchSent() {
    const es = loadGmailSettings();
    const apiKey = es.resendApiKey || "";
    if (!apiKey) return loadEmails();
    try {
      const resp = await fetch(`/api/resend-emails?apiKey=${encodeURIComponent(apiKey)}&type=sent`);
      if (!resp.ok) throw new Error(`Resend API error: ${resp.status}`);
      const result = await resp.json();
      const items = result.data || [];

      const existingEmails = loadEmails();
      const existingIds = new Set(existingEmails.map(e => e.id));

      items.forEach(item => {
        const id = "resend-" + item.id;
        const toField = Array.isArray(item.to) ? item.to.join(", ") : (item.to || "");
        const fromField = Array.isArray(item.from) ? item.from.join(", ") : (item.from || "");
        const isAdminRecipient = toField.toLowerCase().includes("admin@quantumyoga.xyz");
        const folder = isAdminRecipient ? "inbox" : "sent";
        const direction = isAdminRecipient ? "received" : "sent";

        const emailObj = {
          id: id,
          threadId: "",
          from: fromField,
          to: toField,
          subject: item.subject || "(No Subject)",
          date: item.created_at || new Date().toUTCString(),
          snippet: item.subject || "",
          labelIds: [],
          isRead: true,
          folder: folder,
          direction: direction,
          connectedEmail: es.resendFromAddress || "admin@quantumyoga.xyz"
        };
        if (!existingIds.has(id)) {
          existingEmails.push(emailObj);
          existingIds.add(id);
        } else {
          const idx = existingEmails.findIndex(e => e.id === id);
          if (idx > -1) {
            existingEmails[idx].folder = folder;
            existingEmails[idx].direction = direction;
          }
        }
      });
      saveEmails(existingEmails);
      return existingEmails;
    } catch (e) {
      console.error("Error fetching Resend sent emails:", e);
      return loadEmails();
    }
  }

  async function resendGetMessageBody(messageId) {
    const es = loadGmailSettings();
    const apiKey = es.resendApiKey || "";
    if (!apiKey) return null;
    try {
      const emails = loadEmails();
      const cached = emails.find(e => e.id === messageId);
      const type = (cached && cached.direction === "received") ? "receiving" : "sent";
      const rawId = messageId.replace(/^resend-/, "");

      const resp = await fetch(`/api/resend-emails?apiKey=${encodeURIComponent(apiKey)}&type=${type}&id=${encodeURIComponent(rawId)}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.html || data.text || "";
    } catch (e) {
      console.error("Error fetching Resend email body:", e);
      return null;
    }
  }

  async function emailGetMessageBody(messageId) {
    const es = loadGmailSettings();
    if (es.provider === "resend") {
      if (messageId.startsWith("local-")) {
        const emails = loadEmails();
        const found = emails.find(e => e.id === messageId);
        return found ? (found.bodyHtml || found.body || found.snippet || "") : "";
      }
      return await resendGetMessageBody(messageId);
    } else {
      return await gmailGetMessageBody(messageId);
    }
  }

  function extractEmailBody(payload) {
    if (!payload) return "";
    if (payload.body && payload.body.data) {
      return atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
    if (payload.parts) {
      // Prefer text/html, fallback to text/plain
      const htmlPart = payload.parts.find(p => p.mimeType === "text/html");
      if (htmlPart && htmlPart.body && htmlPart.body.data) {
        return atob(htmlPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      const textPart = payload.parts.find(p => p.mimeType === "text/plain");
      if (textPart && textPart.body && textPart.body.data) {
        return atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      // Recurse into multipart
      for (const part of payload.parts) {
        const body = extractEmailBody(part);
        if (body) return body;
      }
    }
    return "";
  }

  /**
   * Sends an email via Gmail API using the stored access token.
   * Params: { to, subject, bodyHtml, bodyText }
   */
  async function gmailSendEmail({ to, subject, bodyHtml, bodyText }) {
    const token = getGmailAccessToken();
    if (!token) {
      return { success: false, error: "Not authenticated. Please reconnect Gmail." };
    }
    const gs = loadGmailSettings();
    const fromEmail = gs.connectedEmail || "me";

    const mime = [
      `From: ${fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      bodyHtml || bodyText || ""
    ].join("\r\n");

    const encoded = btoa(unescape(encodeURIComponent(mime)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
      const resp = await fetch(`${GMAIL_API_BASE}/users/me/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: encoded })
      });
      if (!resp.ok) {
        const err = await resp.json();
        return { success: false, error: err.error ? err.error.message : `HTTP ${resp.status}` };
      }
      const sentMsg = await resp.json();
      // Save a local copy
      const emails = loadEmails();
      emails.push({
        id: sentMsg.id || ("local-" + Date.now()),
        threadId: sentMsg.threadId || "",
        from: fromEmail,
        to,
        subject,
        date: new Date().toUTCString(),
        snippet: (bodyText || bodyHtml || "").slice(0, 100),
        labelIds: ["SENT"],
        isRead: true,
        folder: "sent",
        direction: "sent",
        connectedEmail: gs.connectedEmail
      });
      saveEmails(emails);
      return { success: true, messageId: sentMsg.id };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Task 2.1 — Sends email via the Resend REST API.
   * Returns { success, messageId } or { success: false, error }.
   */
  async function resendSendEmail({ to, subject, bodyHtml, bodyText }) {
    const es = loadGmailSettings();
    const apiKey = es.resendApiKey || "";
    const fromAddress = es.resendFromAddress || "";
    try {
      // Route through the local Vite proxy (/api/send-email) so the request to
      // api.resend.com is made server-side (Node.js). Direct browser fetch to
      // api.resend.com is intentionally blocked by Resend's CORS policy.
      const resp = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          from: fromAddress,
          to,
          subject,
          html: bodyHtml || bodyText || ""
        })
      });
      if (!resp.ok) {
        let errMsg = `HTTP ${resp.status}`;
        try { const errBody = await resp.json(); errMsg = errBody.message || errBody.error || errMsg; } catch (_) {}
        return { success: false, error: errMsg };
      }
      const result = await resp.json();
      return { success: true, messageId: result.id || ("resend-" + Date.now()) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }


  async function emailMarkAsRead(messageId) {
    // Update local database first so read status updates immediately for all providers
    const emails = loadEmails();
    const idx = emails.findIndex(e => e.id === messageId);
    if (idx > -1) {
      emails[idx].isRead = true;
      saveEmails(emails);
    }

    // If active provider is Gmail, sync status to Gmail API
    const es = loadGmailSettings();
    if (es.provider === "gmail" || !es.provider) {
      const token = getGmailAccessToken();
      if (!token) return;
      try {
        await fetch(`${GMAIL_API_BASE}/users/me/messages/${messageId}/modify`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ removeLabelIds: ["UNREAD"] })
        });
      } catch (e) {
        console.warn("Error marking Gmail message as read:", e);
      }
    }
  }

  async function refreshEmailCache() {
    const es = loadGmailSettings();
    if (es.provider === "resend") {
      await loadFromServer();
      await Promise.all([resendFetchInbox(), resendFetchSent()]);
    } else {
      await Promise.all([gmailFetchInbox(), gmailFetchSent()]);
    }
    
    // Automatically check for pending payments from incoming emails
    await autoCheckPendingPayments();
  }

  async function autoCheckPendingPayments() {
    const payments = loadPayments();
    const emails = loadEmails();
    let modified = false;

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      if (payment.status === "pending" || payment.status === "overdue") {
        const userEmails = emails.filter(e => {
          const fromEmail = (e.from || "").toLowerCase();
          const subject = (e.subject || "").toLowerCase();
          const isFromUser = fromEmail.includes(payment.userEmail.toLowerCase());
          const isVerification = subject.includes("upi payment verification");
          
          const matchesAppt = payment.appointmentId ? subject.includes(payment.appointmentId.toLowerCase()) : false;
          const matchesInvoice = subject.includes(payment.id.toLowerCase());
          
          return isFromUser && isVerification && (matchesAppt || matchesInvoice);
        });

        if (userEmails.length > 0) {
          userEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
          const latestEmail = userEmails[0];
          
          const body = await emailGetMessageBody(latestEmail.id);
          let txId = "";
          if (body) {
            const txMatch = body.match(/(?:Transaction ID|UTR Number|Tx ID):\s*([a-zA-Z0-9\-]+)/i) || body.match(/\b\d{12}\b/);
            if (txMatch) {
              txId = txMatch[1] || txMatch[0];
              if (txId.includes("ENTER") || txId.includes("[") || txId.includes("]")) {
                txId = "";
              }
            }
          }

          if (txId && payment.utr !== txId) {
            payments[i].status = "review";
            payments[i].utr = txId;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      savePayments(payments);
      renderAdminPayments();
      renderAdminOverview();
    }
  }

  // ==========================================================================
  // Gmail Integration — Transactional Email Helpers (Task 3.5)
  // ==========================================================================

  function buildTransactionalEmailBody(template, data) {
    const headerHtml = `
      <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: #fff; letter-spacing: -0.5px;">🧘 Quantum Yoga</h1>
          <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Elevate Your Body & Mind</p>
        </div>
        <div style="padding: 32px;">
    `;
    const footerHtml = `
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 16px 32px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4);">© 2026 Quantum Yoga. All rights reserved.</p>
        </div>
      </div>
    `;

    let body = "";
    if (template === "welcome") {
      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Welcome to Quantum Yoga, ${data.name}! 🙏</h2>
        <p>We are thrilled to have you join the Quantum Yoga community. Your journey to wellness starts now.</p>
        <p><strong>Your account has been created successfully.</strong></p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 8px 0 0;"><strong>Membership Tier:</strong> ${data.tier || "Basic"}</p>
        </div>
        
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #10b981; margin: 0 0 8px 0; font-size: 16px;">💬 Receive Notifications on WhatsApp</h3>
          <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.45; color: #b5e2d5;">
            We send automated class bookings, rescheduling alerts, and invoice alerts directly to your phone. To receive alerts from our Twilio testing sandbox, please register your number:
          </p>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <div style="background: white; padding: 4px; border-radius: 6px; display: inline-block;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fwa.me%2F14155238886%3Ftext%3Djoin%2520increase-selection" alt="Twilio QR Code" style="width: 100px; height: 100px; display: block;">
            </div>
            <div style="font-size: 13px; line-height: 1.4; color: #e0e0e0; min-width: 200px;">
              <strong>Option 1:</strong> Scan the QR code with your mobile camera.<br>
              <strong>Option 2:</strong> Send <strong><code>join increase-selection</code></strong> to <a href="https://wa.me/14155238886?text=join%20increase-selection" target="_blank" style="color: #10b981; font-weight: bold; text-decoration: underline;">+1 415 523 8886</a>
            </div>
          </div>
        </div>

        <p>Log in at any time to explore poses, routines, and book private coaching sessions. Namaste!</p>
      `;
    } else if (template === "invoice") {
      const upi = loadUpiSettings();
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upi.vpa)}&pn=${encodeURIComponent(upi.name)}&am=${encodeURIComponent(data.amount)}&tn=${encodeURIComponent("Invoice: " + (data.invoiceId || "Payment"))}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
      
      const mailtoSubject = encodeURIComponent(`UPI Payment Verification - Invoice ${data.invoiceId || ""}`);
      const mailtoBody = encodeURIComponent(`Hello Quantum Yoga Admin,

I have completed the UPI payment of ₹${data.amount} for my invoice. Here are my transaction details:

- Invoice ID: ${data.invoiceId || "N/A"}
- Description: ${data.description || ""}
- Due Date: ${data.dueDate || ""}
- UPI Transaction ID / UTR Number: [ENTER TX ID HERE]

Please verify and update my status. Thank you!`);
      const mailtoUrl = `mailto:admin@quantumyoga.xyz?subject=${mailtoSubject}&body=${mailtoBody}`;

      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Invoice Notification 💳</h2>
        <p>Hello ${data.name || data.to || "Student"},</p>
        <p>A new invoice has been issued to your account.</p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice #:</strong> ${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Description:</strong> ${data.description}</p>
          <p style="margin: 8px 0 0;"><strong>Amount:</strong> ₹${data.amount}</p>
          <p style="margin: 8px 0 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
        </div>
        
        <div style="text-align: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 16px 0; font-weight: bold; color: #a78bfa;">Payment Details (UPI)</p>
          
          <!-- Mobile Deep Link Button -->
          <div style="margin-bottom: 20px;">
            <a href="${upiUrl}" style="background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Pay ₹${data.amount} via UPI (Mobile) 📱</a>
          </div>
          
          <!-- QR Code (for Desktop scanning) -->
          <div style="margin-bottom: 16px;">
            <img src="${qrCodeUrl}" alt="UPI QR Code" style="border: 6px solid #fff; border-radius: 8px; width: 150px; height: 150px; display: inline-block;" />
            <p style="margin: 6px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.5);">Scan with Google Pay, PhonePe, or BHIM</p>
          </div>
          
          <!-- Fallback VPA info -->
          <div style="font-size: 13px; color: rgba(255,255,255,0.8); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; display: inline-block; text-align: left;">
            <p style="margin: 0;"><strong>UPI ID:</strong> <code style="color: #fb923c;">${upi.vpa}</code></p>
            <p style="margin: 4px 0 0 0;"><strong>Payee:</strong> ${upi.name}</p>
          </div>

          <!-- Submit Tx ID via Email -->
          <div style="margin-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.85);">Once paid, click below to submit your transaction ID / UTR Number for admin verification:</p>
            <a href="${mailtoUrl}" style="background: rgba(255,255,255,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">Verify Payment via Email ✉️</a>
          </div>
        </div>
        
        <p>Please log in to your Quantum Yoga account to view and manage this invoice.</p>
      `;
    } else if (template === "appointment") {
      const upi = loadUpiSettings();
      const fee = data.fee !== undefined ? data.fee : loadAppointmentFee();
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upi.vpa)}&pn=${encodeURIComponent(upi.name)}&am=${encodeURIComponent(fee)}&tn=${encodeURIComponent("Appointment: " + (data.routine || "Coaching"))}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
      
      const mailtoSubject = encodeURIComponent(`UPI Payment Verification - Appointment ${data.appointmentId || ""}`);
      const mailtoBody = encodeURIComponent(`Hello Quantum Yoga Admin,

I have completed the UPI payment of ₹${fee} for my coaching session. Here are my transaction details:

- Appointment ID: ${data.appointmentId || "N/A"}
- Routine: ${data.routine || "Coaching"}
- Date: ${data.date || ""}
- Time: ${data.time || ""}
- UPI Transaction ID / UTR Number: [ENTER TX ID HERE]

Please verify and update my status. Thank you!`);
      const mailtoUrl = `mailto:admin@quantumyoga.xyz?subject=${mailtoSubject}&body=${mailtoBody}`;

      const isCancelled = String(data.action || data.status || "").toLowerCase().includes("cancel");

      const paymentHtml = isCancelled ? "" : `
        <div style="text-align: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 16px 0; font-weight: bold; color: #a78bfa;">Payment Details (UPI)</p>
          
          <!-- Mobile Deep Link Button -->
          <div style="margin-bottom: 20px;">
            <a href="${upiUrl}" style="background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Pay ₹${fee} via UPI (Mobile) 📱</a>
          </div>
          
          <!-- QR Code (for Desktop scanning) -->
          <div style="margin-bottom: 16px;">
            <img src="${qrCodeUrl}" alt="UPI QR Code" style="border: 6px solid #fff; border-radius: 8px; width: 150px; height: 150px; display: inline-block;" />
            <p style="margin: 6px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.5);">Scan with Google Pay, PhonePe, or BHIM</p>
          </div>
          
          <!-- Fallback VPA info -->
          <div style="font-size: 13px; color: rgba(255,255,255,0.8); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; display: inline-block; text-align: left;">
            <p style="margin: 0;"><strong>UPI ID:</strong> <code style="color: #fb923c;">${upi.vpa}</code></p>
            <p style="margin: 4px 0 0 0;"><strong>Payee:</strong> ${upi.name}</p>
          </div>

          <!-- Submit Tx ID via Email -->
          <div style="margin-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.85);">Once paid, click below to submit your transaction ID for admin verification:</p>
            <a href="${mailtoUrl}" style="background: rgba(255,255,255,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">Verify Payment via Email ✉️</a>
          </div>
        </div>
      `;

      const closingText = isCancelled 
        ? `<p>If you have any questions or would like to reschedule, please feel free to reach out. Namaste!</p>`
        : `<p>We look forward to seeing you on the mat. Namaste!</p>`;

      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Appointment ${data.action || "Update"} 🗓️</h2>
        <p>Hello ${data.name || data.to},</p>
        <p>Your private coaching appointment has been ${data.action || "updated"}.</p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Routine:</strong> ${data.routine}</p>
          <p style="margin: 8px 0 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 8px 0 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> ${data.status || data.action || "Scheduled"}</p>
          <p style="margin: 8px 0 0;"><strong>Session Fee:</strong> ₹${fee}</p>
        </div>
        
        ${paymentHtml}
        
        ${closingText}
      `;
    } else if (template === "payment-under-review") {
      body = `
        <h2 style="color: #fb923c; margin-top: 0;">Payment Under Review ⏳</h2>
        <p>Hello ${data.name || data.to || "Student"},</p>
        <p>We have received your payment reference for the following invoice and it is now under review by our administration team.</p>
        <div style="background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice #:</strong> ${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Amount:</strong> ₹${data.amount}</p>
          <p style="margin: 8px 0 0;"><strong>Transaction Ref / UTR:</strong> <code style="color: #fb923c;">${data.utr}</code></p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> Under Review</p>
        </div>
        <p>Once our team verifies the transfer, your invoice will be marked as paid and we will notify you. Thank you for your patience!</p>
      `;
    } else if (template === "reminder") {
      const upi = loadUpiSettings();
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upi.vpa)}&pn=${encodeURIComponent(upi.name)}&am=${encodeURIComponent(data.amount)}&tn=${encodeURIComponent("Invoice: " + (data.invoiceId || "Payment"))}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
      
      const mailtoSubject = encodeURIComponent(`UPI Payment Verification - Invoice ${data.invoiceId || ""}`);
      const mailtoBody = encodeURIComponent(`Hello Quantum Yoga Admin,

I have completed the UPI payment of ₹${data.amount} for my invoice. Here are my transaction details:

- Invoice ID: ${data.invoiceId || "N/A"}
- Description: ${data.description || ""}
- Due Date: ${data.dueDate || ""}
- UPI Transaction ID / UTR Number: [ENTER TX ID HERE]

Please verify and update my status. Thank you!`);
      const mailtoUrl = `mailto:admin@quantumyoga.xyz?subject=${mailtoSubject}&body=${mailtoBody}`;

      body = `
        <h2 style="color: #f59e0b; margin-top: 0;">Payment Reminder ⚠️</h2>
        <p>Hello ${data.name || data.to || "Student"},</p>
        <p>This is a friendly reminder that you have an outstanding payment due.</p>
        <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice #:</strong> ${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Description:</strong> ${data.description}</p>
          <p style="margin: 8px 0 0;"><strong>Amount Due:</strong> ₹${data.amount}</p>
          <p style="margin: 8px 0 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
        </div>
        
        <div style="text-align: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 16px 0; font-weight: bold; color: #a78bfa;">Payment Details (UPI)</p>
          
          <!-- Mobile Deep Link Button -->
          <div style="margin-bottom: 20px;">
            <a href="${upiUrl}" style="background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Pay ₹${data.amount} via UPI (Mobile) 📱</a>
          </div>
          
          <!-- QR Code (for Desktop scanning) -->
          <div style="margin-bottom: 16px;">
            <img src="${qrCodeUrl}" alt="UPI QR Code" style="border: 6px solid #fff; border-radius: 8px; width: 150px; height: 150px; display: inline-block;" />
            <p style="margin: 6px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.5);">Scan with Google Pay, PhonePe, or BHIM</p>
          </div>
          
          <!-- Fallback VPA info -->
          <div style="font-size: 13px; color: rgba(255,255,255,0.8); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; display: inline-block; text-align: left;">
            <p style="margin: 0;"><strong>UPI ID:</strong> <code style="color: #fb923c;">${upi.vpa}</code></p>
            <p style="margin: 4px 0 0 0;"><strong>Payee:</strong> ${upi.name}</p>
          </div>

          <!-- Submit Tx ID via Email -->
          <div style="margin-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.85);">Once paid, click below to submit your transaction ID / UTR Number for admin verification:</p>
            <a href="${mailtoUrl}" style="background: rgba(255,255,255,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">Verify Payment via Email ✉️</a>
          </div>
        </div>
        
        <p>Please log in and pay at your earliest convenience to avoid any service interruptions.</p>
      `;
    } else if (template === "inquiry-received") {
      // Task 1.1 — inquiry confirmation email
      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Thank you for reaching out, ${data.name}! 🙏</h2>
        <p>We've received your inquiry and are excited to connect with you.</p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Your message:</strong></p>
          <p style="margin: 8px 0 0; font-style: italic; color: rgba(224,224,224,0.85);">"${data.message || ""}"</p>
        </div>
        <p>A member of our team will get back to you within <strong>24–48 hours</strong>. In the meantime, feel free to explore our class offerings and routines on our website.</p>
        <p>We look forward to beginning this journey with you. Namaste! 🧘</p>
      `;
    } else if (template === "lead-converted") {
      // Task 1.2 — new member welcome + credentials email
      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Welcome to Quantum Yoga, ${data.name}! 🎉</h2>
        <p>Your member account has been created and you're all set to begin your wellness journey with us.</p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Your temporary password:</strong></p>
          <p style="margin: 10px 0 0;">
            <code style="background: rgba(255,255,255,0.12); color: #f0abfc; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; letter-spacing: 1px; display: inline-block;">${data.tempPassword || ""}</code>
          </p>
        </div>
        <p style="color: #f87171; font-weight: 600;">⚠️ Please log in and change your password immediately — this temporary password is active now.</p>
        
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #10b981; margin: 0 0 8px 0; font-size: 16px;">💬 Receive Notifications on WhatsApp</h3>
          <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.45; color: #b5e2d5;">
            We send automated class bookings, rescheduling alerts, and invoice alerts directly to your phone. To receive alerts from our Twilio testing sandbox, please register your number:
          </p>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <div style="background: white; padding: 4px; border-radius: 6px; display: inline-block;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fwa.me%2F14155238886%3Ftext%3Djoin%2520increase-selection" alt="Twilio QR Code" style="width: 100px; height: 100px; display: block;">
            </div>
            <div style="font-size: 13px; line-height: 1.4; color: #e0e0e0; min-width: 200px;">
              <strong>Option 1:</strong> Scan the QR code with your mobile camera.<br>
              <strong>Option 2:</strong> Send <strong><code>join increase-selection</code></strong> to <a href="https://wa.me/14155238886?text=join%20increase-selection" target="_blank" style="color: #10b981; font-weight: bold; text-decoration: underline;">+1 415 523 8886</a>
            </div>
          </div>
        </div>

        <p>Once logged in, you can explore poses, book private coaching sessions, track your progress, and much more.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${typeof window !== "undefined" ? window.location.origin : "#"}" style="background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">Log In to Quantum Yoga →</a>
        </div>
        <p>If you have any questions, just reply to this email or contact us through the website. We're here to support you!</p>
        <p>Namaste 🙏 — The Quantum Yoga Team</p>
      `;
    } else if (template === "payment-approved") {
      body = `
        <h2 style="color: #10B981; margin-top: 0;">Payment Approved & Confirmed! 🎉</h2>
        <p>Hello,</p>
        <p>Thank you! Your payment has been successfully approved and recorded.</p>
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice ID:</strong> ${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Amount Paid:</strong> ₹${data.amount}</p>
          ${data.utr ? `<p style="margin: 8px 0 0;"><strong>UTR / Transaction ID:</strong> <code style="color: #a78bfa;">${data.utr}</code></p>` : ""}
          <p style="margin: 8px 0 0;"><strong>Payment Date:</strong> ${data.paymentDate}</p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">PAID</span></p>
        </div>
        <p>Your receipt is available under the Payments/Billing tab in your student dashboard.</p>
        <p>Namaste 🙏 — The Quantum Yoga Team</p>
      `;
    } else if (template === "payment-declined") {
      body = `
        <h2 style="color: #EF4444; margin-top: 0;">Payment Verification Update ⚠️</h2>
        <p>Hello,</p>
        <p>We were unable to verify the UPI payment for your invoice.</p>
        <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice ID:</strong> ${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Amount Due:</strong> ₹${data.amount}</p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> <span style="color: #EF4444; font-weight: bold;">PENDING</span></p>
        </div>
        <p>Please log in to your student dashboard to re-submit your Transaction ID / UTR or contact the administrator to resolve this.</p>
        <p>Namaste 🙏 — The Quantum Yoga Team</p>
      `;
    } else if (template === "refunded") {
      body = `
        <h2 style="color: #a78bfa; margin-top: 0;">Refund Processed Successfully 💸</h2>
        <p>Hello ${data.name || data.to || "Student"},</p>
        <p>We have approved and successfully processed a refund for your invoice.</p>
        <div style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Invoice ID:</strong> #${data.invoiceId}</p>
          <p style="margin: 8px 0 0;"><strong>Amount Refunded:</strong> ₹${data.amount}</p>
          <p style="margin: 8px 0 0;"><strong>Refund Date:</strong> ${data.refundDate}</p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> <span style="color: #a78bfa; font-weight: bold;">REFUNDED</span></p>
        </div>
        <p>The refunded amount should reflect in your account shortly depending on your bank's processing times.</p>
        <p>Namaste 🙏 — The Quantum Yoga Team</p>
      `;
    } else {
      body = `<p>${data.message || ""}</p>`;
    }

    return headerHtml + body + footerHtml;
  }


  function loadUpiSettings() {
    const data = localStorage.getItem(STORAGE_KEY_UPI_SETTINGS);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn("Error parsing UPI settings from local storage, using default", e);
      }
    }
    return { vpa: DEFAULT_UPI_VPA, name: DEFAULT_UPI_NAME };
  }

  function saveUpiSettings(settings) {
    localStorage.setItem(STORAGE_KEY_UPI_SETTINGS, JSON.stringify(settings));
    saveToServer();
  }

  // Appointment fee helpers
  function loadAppointmentFee() {
    const stored = localStorage.getItem(STORAGE_KEY_APPOINTMENT_FEE);
    return stored !== null ? Number(stored) : 0;
  }

  function saveAppointmentFee(fee) {
    const val = Number(fee);
    localStorage.setItem(STORAGE_KEY_APPOINTMENT_FEE, String(isNaN(val) ? 0 : val));
    saveToServer();
  }

  // Load leads from storage
  function loadLeads() {
    const data = localStorage.getItem(STORAGE_KEY_LEADS);
    return data ? JSON.parse(data) : [];
  }

  // Save leads to storage
  function saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
    saveToServer();
  }

  // Load registered users from storage
  function loadUsers() {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    let users = data ? JSON.parse(data) : [];
    
    // Seed admin account if missing
    const adminEmail = "admin@quantumyoga.xyz";
    if (!users.some(u => u.email === adminEmail)) {
      const adminUser = {
        name: "Administrator",
        email: adminEmail,
        password: "adminpass",
        favorites: [],
        routineHistory: []
      };
      users.push(adminUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
    
    // Legacy support fallback: inject default membership data if missing
    let modified = false;
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];
    
    users = users.map(u => {
      if (u.email !== "admin@quantumyoga.xyz") {
        if (!u.membership) {
          u.membership = {
            tier: "Basic",
            status: "Active",
            expiryDate: expiryStr,
            notes: ""
          };
          modified = true;
        }
        if (u.goals === undefined) {
          u.goals = "";
          modified = true;
        }
        if (u.healthNotes === undefined) {
          u.healthNotes = "";
          modified = true;
        }
      }
      return u;
    });
    
    if (modified) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      saveToServer();
    }
    
    return users;
  }

  // Save users to storage
  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    saveToServer();
  }

  // Check active session on load
  function checkSession() {
    // Enforce route guard check on startup
    const protectedHashes = ["#admin-section", "#profile-section"];
    const currentHash = window.location.hash;
    const hasSession = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
    
    if (protectedHashes.includes(currentHash) && !hasSession) {
      window.location.hash = "";
      history.replaceState(null, null, " ");
      openAuthModal();
      applyTheme(getSiteDefaultTheme());
      return;
    }

    const data = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (data) {
      const email = JSON.parse(data);
      const users = loadUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        state.currentUser = user;
        updateUIForLogin();
        applyTheme(user.theme || getSiteDefaultTheme());
        if (user.mustChangePassword === true) {
          dashboardApp.style.display = "none";
          authGateFullscreen.style.display = "none";
          forceChangePasswordOverlay.style.display = "flex";
          document.body.style.overflow = "hidden";
        }
      } else {
        openAuthModal();
        applyTheme(getSiteDefaultTheme());
      }
    } else {
      openAuthModal();
      applyTheme(getSiteDefaultTheme());
    }
  }

  // Listen to hashchange event to enforce route guard when manually modifying URLs
  window.addEventListener("hashchange", () => {
    const protectedHashes = ["#admin-section", "#profile-section"];
    const currentHash = window.location.hash;
    const hasSession = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
    
    if (protectedHashes.includes(currentHash) && !hasSession) {
      window.location.hash = "";
      history.replaceState(null, null, " ");
      openAuthModal();
      applyTheme(getSiteDefaultTheme());
    }
  });

  // Update UI components when logged in
  function updateUIForLogin() {
    if (!state.currentUser) return;
    closeAuthModal();
    
    // Header welcome greeting
    navUserName.textContent = state.currentUser.name;
    userNavPanel.style.display = "flex";
    loginNavBtn.style.display = "none";
    
    // Navigation links
    if (state.currentUser.email === "admin@quantumyoga.xyz") {
      navProfileLink.style.display = "none";
      navAdmin.style.display = "inline-block";

      // Hide member-facing sections that are irrelevant for admin
      const heroSection = document.querySelector(".hero-section");
      const controlsSection = document.querySelector(".controls-section");
      if (heroSection) heroSection.style.display = "none";
      if (controlsSection) controlsSection.style.display = "none";
      if (sectionPoses) sectionPoses.style.display = "none";
      if (sectionRoutines) sectionRoutines.style.display = "none";

      // If we are currently active on admin page, render it
      if (state.activeTab === "admin") {
        renderAdminDashboard();
      }
    } else {
      navProfileLink.style.display = "inline-block";
      navAdmin.style.display = "none";

      // Restore member-facing sections that are relevant for student
      const heroSection = document.querySelector(".hero-section");
      const controlsSection = document.querySelector(".controls-section");
      if (heroSection) heroSection.style.display = "";
      if (controlsSection) controlsSection.style.display = "";
      if (sectionPoses) sectionPoses.style.display = "";
      if (sectionRoutines) sectionRoutines.style.display = "";
    }
    
    // Update profile page details
    profileUserName.textContent = state.currentUser.name;
    profileUserEmail.textContent = state.currentUser.email;
    if (profileUserPhone) {
      profileUserPhone.textContent = state.currentUser.phone ? `Phone: ${state.currentUser.phone}` : "Phone: -";
    }
    if (profilePhoneInput) {
      profilePhoneInput.value = state.currentUser.phone || "";
    }
    if (profileSandboxOptinWidget) {
      profileSandboxOptinWidget.style.display = state.currentUser.phone ? "block" : "none";
    }
    profileStatCompleted.textContent = state.currentUser.routineHistory ? state.currentUser.routineHistory.length : 0;
    profileStatFavorites.textContent = state.currentUser.favorites ? state.currentUser.favorites.length : 0;

    if (state.currentUser.membership) {
      if (profileMembershipTier) {
        const tier = state.currentUser.membership.tier;
        profileMembershipTier.textContent = tier.endsWith("Member") || tier.includes("VIP") ? tier : (tier + " Member");
        
        profileMembershipTier.className = "badge";
        if (tier === "Basic") {
          profileMembershipTier.classList.add("badge-tier-basic");
        } else if (tier === "Premium") {
          profileMembershipTier.classList.add("badge-tier-premium");
        } else if (tier === "Unlimited VIP" || tier.includes("VIP")) {
          profileMembershipTier.classList.add("badge-tier-vip");
        } else {
          profileMembershipTier.classList.add("badge-category");
        }
      }
      
      if (profileMembershipStatus) {
        const status = state.currentUser.membership.status;
        profileMembershipStatus.textContent = status;
        
        profileMembershipStatus.className = "badge";
        if (status === "Active") {
          profileMembershipStatus.classList.add("badge-active");
        } else if (status === "Paused") {
          profileMembershipStatus.classList.add("badge-paused");
        } else if (status === "Expired") {
          profileMembershipStatus.classList.add("badge-expired");
        } else {
          profileMembershipStatus.classList.add("badge-category");
        }
      }
      
      if (profileMembershipExpiry) {
        profileMembershipExpiry.textContent = formatDateToIndian(state.currentUser.membership.expiryDate) || "N/A";
      }
    }
    
    // Update theme dropdown selection
    if (profileThemeSelect) {
      profileThemeSelect.value = state.currentUser.theme || getSiteDefaultTheme();
    }
    applyTheme(state.currentUser.theme || getSiteDefaultTheme());
    
    // Load student sub-tab defaults & overdue alert if not admin
    if (state.currentUser.email !== "admin@quantumyoga.xyz") {
      setProfileSubTab("dashboard");
      
      // Overdue payment banner alert
      const payments = loadPayments();
      const myPayments = payments.filter(p => p.userEmail === state.currentUser.email);
      const overdueAmount = myPayments.filter(p => p.status === "overdue").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      if (overdueAmount > 0) {
        if (overduePaymentBanner) {
          overduePaymentBanner.style.display = "block";
        }
        if (overduePaymentMessage) {
          overduePaymentMessage.textContent = `Action Required: You have an outstanding overdue payment of ₹${overdueAmount.toFixed(2)}.`;
        }
      } else {
        if (overduePaymentBanner) {
          overduePaymentBanner.style.display = "none";
        }
      }
    } else {
      if (overduePaymentBanner) {
        overduePaymentBanner.style.display = "none";
      }
    }
    
    // Render membership details
    if (state.currentUser.membership) {
      if (profileMembershipTier) {
        profileMembershipTier.textContent = `${state.currentUser.membership.tier} Member`;
        profileMembershipTier.style.background = "";
        profileMembershipTier.style.color = "";
        profileMembershipTier.style.borderColor = "";
        if (state.currentUser.membership.tier === "Unlimited VIP") {
          profileMembershipTier.style.background = "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))";
          profileMembershipTier.style.color = "#fbbf24";
          profileMembershipTier.style.borderColor = "#f59e0b";
        } else if (state.currentUser.membership.tier === "Premium") {
          profileMembershipTier.style.background = "linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(244, 63, 94, 0.2))";
          profileMembershipTier.style.color = "var(--accent-primary)";
          profileMembershipTier.style.borderColor = "var(--accent-primary)";
        } else {
          profileMembershipTier.style.background = "rgba(255, 255, 255, 0.05)";
          profileMembershipTier.style.color = "var(--text-secondary)";
          profileMembershipTier.style.borderColor = "var(--glass-light-border)";
        }
      }
      if (profileMembershipStatus) {
        profileMembershipStatus.textContent = state.currentUser.membership.status;
        profileMembershipStatus.style.background = "";
        profileMembershipStatus.style.color = "";
        profileMembershipStatus.style.borderColor = "";
        if (state.currentUser.membership.status === "Active") {
          profileMembershipStatus.style.background = "rgba(16, 185, 129, 0.12)";
          profileMembershipStatus.style.color = "#10b981";
          profileMembershipStatus.style.borderColor = "rgba(16, 185, 129, 0.25)";
        } else if (state.currentUser.membership.status === "Paused") {
          profileMembershipStatus.style.background = "rgba(245, 158, 11, 0.12)";
          profileMembershipStatus.style.color = "#f59e0b";
          profileMembershipStatus.style.borderColor = "rgba(245, 158, 11, 0.25)";
        } else {
          profileMembershipStatus.style.background = "rgba(239, 68, 68, 0.12)";
          profileMembershipStatus.style.color = "#ef4444";
          profileMembershipStatus.style.borderColor = "rgba(239, 68, 68, 0.25)";
        }
      }
      if (profileMembershipExpiry) {
        profileMembershipExpiry.textContent = formatDateToIndian(state.currentUser.membership.expiryDate) || "N/A";
      }
    }
    
    // Populate textareas with current user data
    if (profileGoalsInput) {
      profileGoalsInput.value = state.currentUser.goals || "";
    }
    if (profileHealthInput) {
      profileHealthInput.value = state.currentUser.healthNotes || "";
    }
    if (profileWellnessSuccessMsg) {
      profileWellnessSuccessMsg.style.display = "none";
    }
    
    // Re-render pose cards to show hearts highlighted if favorited
    renderPoses();
  }

  // Update UI components when logged out
  function updateUIForLogout() {
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    
    // Clear URL hash
    if (window.location.hash) {
      window.location.hash = "";
      history.replaceState(null, null, " ");
    }
    
    userNavPanel.style.display = "none";
    loginNavBtn.style.display = "inline-block";
    
    navProfileLink.style.display = "none";
    navAdmin.style.display = "none";
    
    // Switch active tab back to poses if currently on profile or admin
    if (state.activeTab === "profile" || state.activeTab === "admin") {
      setTab("poses");
    }
    
    renderPoses();
    applyTheme(getSiteDefaultTheme());
    if (forceChangePasswordOverlay) {
      forceChangePasswordOverlay.style.display = "none";
      forceChangePasswordForm.reset();
      forceChangePasswordErrorMsg.style.display = "none";
    }
    if (forgotPasswordModal) {
      forgotPasswordModal.classList.remove("active");
      forgotPasswordForm.reset();
      forgotPasswordErrorMsg.style.display = "none";
      forgotPasswordSuccessMsg.style.display = "none";
    }
    openAuthModal();
  }

  // Auth Modal events (Redefined to toggle fullscreen auth gate)
  function openAuthModal() {
    authGateFullscreen.style.display = "flex";
    dashboardApp.style.display = "none";
    document.body.style.overflow = "hidden";
    // Reset form inputs & messages
    loginForm.reset();
    registerForm.reset();
    if (inquireForm) inquireForm.reset();
    loginErrorMsg.style.display = "none";
    registerErrorMsg.style.display = "none";
    if (inquireSuccessMsg) inquireSuccessMsg.style.display = "none";
    switchAuthTab("login");
  }

  // Close Auth Modal
  function closeAuthModal() {
    authGateFullscreen.style.display = "none";
    dashboardApp.style.display = "block";
    document.body.style.overflow = "";
  }

  function switchAuthTab(tab) {
    if (tab === "login") {
      authLoginTabBtn.classList.add("active");
      authRegisterTabBtn.classList.remove("active");
      if (authInquireTabBtn) authInquireTabBtn.classList.remove("active");
      loginForm.classList.add("active-form");
      registerForm.classList.remove("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.classList.remove("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.style.display = "none";
    } else if (tab === "register") {
      authLoginTabBtn.classList.remove("active");
      authRegisterTabBtn.classList.add("active");
      if (authInquireTabBtn) authInquireTabBtn.classList.remove("active");
      loginForm.classList.remove("active-form");
      registerForm.classList.add("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.classList.remove("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.style.display = "none";
    } else if (tab === "inquire") {
      authLoginTabBtn.classList.remove("active");
      authRegisterTabBtn.classList.remove("active");
      if (authInquireTabBtn) authInquireTabBtn.classList.add("active");
      loginForm.classList.remove("active-form");
      registerForm.classList.remove("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.classList.add("active-form");
      if (authInquireFormWrapper) authInquireFormWrapper.style.display = "block";
    }
  }

  loginNavBtn.addEventListener("click", openAuthModal);
  
  authLoginTabBtn.addEventListener("click", () => switchAuthTab("login"));
  authRegisterTabBtn.addEventListener("click", () => switchAuthTab("register"));
  if (authInquireTabBtn) {
    authInquireTabBtn.addEventListener("click", () => switchAuthTab("inquire"));
  }

  // Register form submit
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = registerNameInput.value.trim();
    const email = registerEmailInput.value.trim().toLowerCase();
    const phone = registerPhoneInput.value.trim();
    const password = registerPasswordInput.value;
    
    if (password.length < 6) {
      registerErrorMsg.textContent = "Password must be at least 6 characters.";
      registerErrorMsg.style.display = "block";
      return;
    }
    
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      registerErrorMsg.textContent = "Email is already registered.";
      registerErrorMsg.style.display = "block";
      return;
    }
    
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];

    const newUser = {
      name,
      email,
      phone,
      password, // Cleartext password for local mockup
      favorites: [],
      routineHistory: [],
      theme: "",
      membership: {
        tier: "Basic",
        status: "Active",
        expiryDate: expiryStr,
        notes: ""
      },
      goals: "",
      healthNotes: ""
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Send transactional welcome email and WhatsApp notification
    try {
      sendTransactionalEmail("welcome", { email: email, tier: "Basic" }, email);
      sendWhatsAppNotification("welcome", { tempPass: "" }, email);
    } catch (err) {
      console.error("Welcome communications failed:", err);
    }
    
    // Log user session in
    state.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(email));
    
    updateUIForLogin();
    closeAuthModal();
  });

  // Login form submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginEmailInput.value.trim().toLowerCase();
    const password = loginPasswordInput.value;
    
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      loginErrorMsg.textContent = "Invalid email or password.";
      loginErrorMsg.style.display = "block";
      return;
    }
    state.currentUser = user;
    
    // Check Remember Me checkbox
    const rememberMe = loginRememberCheckbox && loginRememberCheckbox.checked;
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(email));
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(email));
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
    
    updateUIForLogin();
    if (user.mustChangePassword === true) {
      dashboardApp.style.display = "none";
      authGateFullscreen.style.display = "none";
      forceChangePasswordOverlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  });

  // Forgot Password modal toggle & submission listeners
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.add("active");
      
      // Reset form & errors
      forgotPasswordForm.reset();
      forgotPasswordErrorMsg.style.display = "none";
      forgotPasswordErrorMsg.textContent = "";
      forgotPasswordSuccessMsg.style.display = "none";
      forgotPasswordSuccessMsg.textContent = "";
    });
  }

  if (closeForgotPasswordModal) {
    closeForgotPasswordModal.addEventListener("click", () => {
      forgotPasswordModal.classList.remove("active");
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = forgotEmailInput.value.trim().toLowerCase();
      
      // Reset status displays
      forgotPasswordErrorMsg.style.display = "none";
      forgotPasswordErrorMsg.textContent = "";
      forgotPasswordSuccessMsg.style.display = "none";
      forgotPasswordSuccessMsg.textContent = "";
      
      const users = loadUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        forgotPasswordErrorMsg.textContent = "Email address not found.";
        forgotPasswordErrorMsg.style.display = "block";
        return;
      }
      
      // Found the user! Generate an 8-character temporary password
      const tempPassword = generateRandomPassword(8);
      
      // Update database record
      users[userIndex].password = tempPassword;
      // Mark mustChangePassword as true since it's a temporary password!
      users[userIndex].mustChangePassword = true;
      
      // Save
      saveUsers(users);
      
      // Show success message with password
      forgotPasswordSuccessMsg.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.5rem; color: #10B981;">✓ Password Reset Successful!</div>
        <div>A new temporary password has been generated for your account. Please write it down:</div>
        <div style="margin-top: 0.75rem; margin-bottom: 0.75rem; text-align: center;">
          <code style="background: rgba(16, 185, 129, 0.2); padding: 0.35rem 0.75rem; border-radius: 4px; font-family: monospace; font-size: 1.1rem; font-weight: 700; color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); display: inline-block;">${tempPassword}</code>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
          Use this temporary password to log in. You will be prompted to choose a new custom password upon logging in.
        </div>
      `;
      forgotPasswordSuccessMsg.style.display = "block";
      
      // Clear email input
      forgotEmailInput.value = "";
    });
  }

  // Force Change Password form submit
  if (forceChangePasswordForm) {
    forceChangePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newPassword = forceNewPasswordInput.value;
      const confirmPassword = forceConfirmPasswordInput.value;
      
      // Clear previous error
      forceChangePasswordErrorMsg.style.display = "none";
      forceChangePasswordErrorMsg.textContent = "";
      
      // Validation: Minimum 6 characters
      if (newPassword.length < 6) {
        forceChangePasswordErrorMsg.textContent = "Password must be at least 6 characters.";
        forceChangePasswordErrorMsg.style.display = "block";
        return;
      }
      
      // Validation: Passwords must match
      if (newPassword !== confirmPassword) {
        forceChangePasswordErrorMsg.textContent = "Passwords do not match.";
        forceChangePasswordErrorMsg.style.display = "block";
        return;
      }
      
      // Update password in database
      const users = loadUsers();
      const currentUserEmail = state.currentUser.email;
      const userIndex = users.findIndex(u => u.email === currentUserEmail);
      
      if (userIndex > -1) {
        users[userIndex].password = newPassword;
        users[userIndex].mustChangePassword = false;
        
        // Save to localStorage and server
        saveUsers(users);
        
        // Also update our state.currentUser reference
        state.currentUser.password = newPassword;
        state.currentUser.mustChangePassword = false;
        
        // Hide overlay, restore background scrolling
        forceChangePasswordOverlay.style.display = "none";
        document.body.style.overflow = "";
        
        // Reset form
        forceChangePasswordForm.reset();
        
        // Transition to dashboard - show dashboardApp and hide auth modal
        dashboardApp.style.display = "block";
        authGateFullscreen.style.display = "none";
        
        // Update UI
        updateUIForLogin();
      } else {
        forceChangePasswordErrorMsg.textContent = "Error: Current user session not found.";
        forceChangePasswordErrorMsg.style.display = "block";
      }
    });
  }

  // Inquiry form submit
  if (inquireForm) {
    inquireForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const name = inquireNameInput.value.trim();
      const email = inquireEmailInput.value.trim().toLowerCase();
      const phone = inquirePhoneInput.value.trim();
      const message = inquireMessageInput.value.trim();
      
      if (!name || !email || !phone || !message) return;

      // Validate Indian mobile phone number
      const sanitizedPhone = phone.replace(/[\s-]/g, "");
      const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(sanitizedPhone)) {
        alert("Please enter a valid 10-digit Indian mobile number (e.g., +91 98765 43210 or 09876543210).");
        return;
      }
      
      const leads = loadLeads();
      const newLead = {
        id: "lead-" + Date.now(),
        name: name,
        email: email,
        phone: formatIndianPhone(phone),
        message: message,
        date: new Date().toISOString().split("T")[0],
        status: "New",
        logs: [
          {
            timestamp: new Date().toLocaleString(),
            note: "Lead created via landing page inquiry form."
          }
        ]
      };
      
      leads.push(newLead);
      saveLeads(leads);

      // Task 3.1 — fire inquiry confirmation email (fire-and-forget; does not block UI)
      await sendTransactionalEmail("inquiry-received", { name, message }, email);
      
      // Reset form
      inquireForm.reset();
      
      // Show success message
      if (inquireSuccessMsg) {
        inquireSuccessMsg.style.display = "block";
        setTimeout(() => {
          inquireSuccessMsg.style.display = "none";
        }, 5000);
      }
    });
  }

  // Logout button click
  logoutBtn.addEventListener("click", () => {
    updateUIForLogout();
  });

  // Toggle favorite pose for current user
  function toggleFavorite(poseId) {
    if (!state.currentUser) {
      openAuthModal();
      return;
    }
    if (state.currentUser.email === "admin@quantumyoga.xyz") {
      alert("Administrators cannot add poses to favorites.");
      return;
    }
    
    const favorites = state.currentUser.favorites || [];
    const index = favorites.indexOf(poseId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(poseId);
    }
    
    state.currentUser.favorites = favorites;
    
    // Save to local storage
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.email === state.currentUser.email);
    if (userIndex > -1) {
      users[userIndex].favorites = favorites;
      saveUsers(users);
    }
    
    updateUIForLogin();
  }

  // Handle completed routine tracking
  function handleVideoCompletion() {
    if (!state.currentUser || !state.activeRoutineId) return;
    if (state.currentUser.email === "admin@quantumyoga.xyz") {
      state.activeRoutineId = null;
      if (videoModal.classList.contains("active")) {
        closeVideoPlayer();
      }
      return;
    }
    
    const history = state.currentUser.routineHistory || [];
    history.push({
      routineId: state.activeRoutineId,
      timestamp: new Date().toISOString()
    });
    
    state.currentUser.routineHistory = history;
    
    // Save to local storage
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.email === state.currentUser.email);
    if (userIndex > -1) {
      users[userIndex].routineHistory = history;
      saveUsers(users);
    }
    
    // Reset active routine ID
    state.activeRoutineId = null;
    
    updateUIForLogin();
    
    // If video modal is active, close it and show a success message
    if (videoModal.classList.contains("active")) {
      closeVideoPlayer();
    }
    
    // Show a temporary success alert or toast
    alert("Congratulations! Routine completed and added to your history.");
  }

  // Render favorites list in Profile
  function renderFavorites() {
    if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") return;
    profileFavoritesList.innerHTML = "";
    if (!state.currentUser || !state.currentUser.favorites || state.currentUser.favorites.length === 0) {
      profileFavoritesList.innerHTML = `<p class="empty-text" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem 0;">No favorited poses yet.</p>`;
      return;
    }
    
    state.currentUser.favorites.forEach(poseId => {
      const pose = YOGA_POSES.find(p => p.id === poseId);
      if (pose) {
        const item = document.createElement("div");
        item.className = "fav-pose-item";
        item.innerHTML = `
          <div class="fav-pose-img-wrap" style="height: 50px; width: 50px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass);">
            ${pose.svgMarkup}
          </div>
          <div class="fav-pose-meta" style="flex-grow: 1;">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${pose.name}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted);">${pose.category} • ${pose.difficulty}</p>
          </div>
          <button class="btn btn-secondary btn-sm view-pose-btn" data-id="${pose.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">View</button>
        `;
        item.querySelector(".view-pose-btn").addEventListener("click", () => {
          openPoseModal(pose.id);
        });
        profileFavoritesList.appendChild(item);
      }
    });
  }

  // Render history in Profile
  function renderHistory() {
    if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") return;
    profileHistoryList.innerHTML = "";
    if (!state.currentUser || !state.currentUser.routineHistory || state.currentUser.routineHistory.length === 0) {
      profileHistoryList.innerHTML = `<p class="empty-text" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">No routines completed yet.</p>`;
      return;
    }
    
    // Sort history to show most recent first
    const sortedHistory = [...state.currentUser.routineHistory].reverse();
    
    sortedHistory.forEach(historyItem => {
      const routine = YOGA_ROUTINES.find(r => r.id === historyItem.routineId);
      if (routine) {
        const dateStr = new Date(historyItem.timestamp).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
        const item = document.createElement("div");
        item.className = "history-item";
        item.innerHTML = `
          <div class="history-routine-icon" style="font-size: 1.25rem;">🧘‍♂️</div>
          <div class="history-meta" style="flex-grow: 1;">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${routine.name}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Completed on ${dateStr}</p>
          </div>
          <span class="badge badge-difficulty-${routine.difficulty.toLowerCase()}" style="font-size: 0.65rem;">${routine.difficulty}</span>
        `;
        profileHistoryList.appendChild(item);
      }
    });
  }

  // Student Profile Dashboard Sub-tabs Routing
  function setProfileSubTab(panelName) {
    if (!profileDashboardTabBtn || !profilePracticeTabBtn) return;
    
    profileDashboardTabBtn.classList.remove("active");
    profilePracticeTabBtn.classList.remove("active");
    if (profileWellnessTabBtn) profileWellnessTabBtn.classList.remove("active");
    if (profileAppointmentsTabBtn) profileAppointmentsTabBtn.classList.remove("active");
    if (profileEmailTabBtn) profileEmailTabBtn.classList.remove("active");
    
    profileDashboardPanel.style.display = "none";
    profilePracticePanel.style.display = "none";
    if (profileWellnessPanel) profileWellnessPanel.style.display = "none";
    if (profileAppointmentsSection) profileAppointmentsSection.style.display = "none";
    if (profileEmailPanel) profileEmailPanel.style.display = "none";
    
    if (panelName === "dashboard") {
      profileDashboardTabBtn.classList.add("active");
      profileDashboardPanel.style.display = "block";
      renderClientDashboard();
    } else if (panelName === "practice") {
      profilePracticeTabBtn.classList.add("active");
      profilePracticePanel.style.display = "block";
      renderFavorites();
      renderHistory();
    } else if (panelName === "wellness") {
      if (profileWellnessTabBtn) profileWellnessTabBtn.classList.add("active");
      if (profileWellnessPanel) profileWellnessPanel.style.display = "block";
      if (profileGoalsInput) profileGoalsInput.value = state.currentUser.goals || "";
      if (profileHealthInput) profileHealthInput.value = state.currentUser.healthNotes || "";
    } else if (panelName === "appointments") {
      if (profileAppointmentsTabBtn) profileAppointmentsTabBtn.classList.add("active");
      if (profileAppointmentsSection) profileAppointmentsSection.style.display = "block";
      renderStudentAppointments();
    } else if (panelName === "email") {
      if (profileEmailTabBtn) profileEmailTabBtn.classList.add("active");
      if (profileEmailPanel) profileEmailPanel.style.display = "block";
      renderStudentEmailTab();
    }
  }

  // Render Client Dashboard Main
  function renderClientDashboard() {
    if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") return;
    renderClientBatchDetails();
    renderClientSessionsFeed();
    renderClientBillingHistory();
  }

  // Render Batch Details
  function renderClientBatchDetails() {
    if (!profileBatchDetails) return;
    profileBatchDetails.innerHTML = "";

    const batches = JSON.parse(localStorage.getItem("qy_batches") || "[]");
    const batchId = state.currentUser ? state.currentUser.batchId : null;
    const activeBatch = batchId ? batches.find(b => b.id === batchId) : null;

    if (!activeBatch) {
      profileBatchDetails.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
          <h4 id="profile-batch-title" style="display: none;">No Active Batch</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1rem;">You are not enrolled in any yoga batch cohort.</p>
          <button class="btn btn-primary btn-sm" id="client-join-batch-cta" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Explore Cohorts</button>
        </div>
      `;
      const cta = document.getElementById("client-join-batch-cta");
      if (cta) {
        cta.addEventListener("click", () => {
          alert("Please contact Quantum Yoga administration to enroll in a batch cohort.");
        });
      }
      return;
    }

    let timetableHTML = "";
    if (activeBatch.timetable && activeBatch.timetable.length > 0) {
      timetableHTML = activeBatch.timetable.map((slot, idx) => {
        const routineLinkHTML = slot.routineId
          ? `<a href="#" class="timetable-routine-link" data-routine-id="${slot.routineId}" style="color: var(--accent-primary); text-decoration: underline; cursor: pointer; font-size: 0.8rem; display: block; margin-top: 0.25rem;">Start: ${slot.routineName || "Yoga Flow"}</a>`
          : "";
        return `
          <div style="padding: 0.5rem 0; border-bottom: 1px dashed var(--border-glass); display: flex; flex-direction: column; gap: 0.15rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span>${slot.day}</span>
              <span style="font-weight: 600; color: var(--accent-primary);">${slot.time}</span>
            </div>
            ${routineLinkHTML}
          </div>
        `;
      }).join("");
    } else {
      timetableHTML = `<p style="font-size: 0.8rem; color: var(--text-muted);">No timetable defined.</p>`;
    }

    profileBatchDetails.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <h4 id="profile-batch-title" style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${activeBatch.name}</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          <strong>Instructor:</strong> ${activeBatch.instructor || "Master Coach"}<br>
          <strong>Batch Limit:</strong> ${activeBatch.capacity || "Unlimited"} students
        </p>
        <div style="background: rgba(0,0,0,0.15); border-radius: var(--radius-sm); padding: 0.75rem; border: 1px solid var(--border-glass);">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Timetable Schedule:</span>
          <div id="profile-timetable-list" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
            ${timetableHTML}
          </div>
        </div>
        <div id="profile-batch-countdown-box" style="margin-top: 0.5rem; text-align: center; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.15); border-radius: var(--radius-sm); padding: 0.75rem;">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Next Class Countdown:</span>
          <h4 id="profile-class-countdown" style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary); margin-top: 0.25rem;">Calculating...</h4>
        </div>
      </div>
    `;

    // Bind click events on routine links
    const routineLinks = profileBatchDetails.querySelectorAll(".timetable-routine-link");
    routineLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const routineId = link.getAttribute("data-routine-id");
        if (routineId) {
          openRoutineModal(routineId);
        }
      });
    });

    updateBatchCountdown(activeBatch);
  }

  // Live countdown updates
  function updateBatchCountdown(batch) {
    const countdownEl = document.getElementById("profile-class-countdown") || document.getElementById("profile-batch-countdown-time");
    if (!countdownEl || !batch.timetable || batch.timetable.length === 0) return;

    function tick() {
      const now = new Date();
      let soonestClass = null;
      let minDelta = Infinity;

      batch.timetable.forEach(slot => {
        const nextDate = getWeekdayTimestamp(slot.day, slot.time);
        if (nextDate.getTime() < now.getTime()) {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        const delta = nextDate.getTime() - now.getTime();
        if (delta < minDelta) {
          minDelta = delta;
          soonestClass = nextDate;
        }
      });

      if (!soonestClass) {
        countdownEl.textContent = "No upcoming classes";
        return;
      }

      const diffMs = soonestClass.getTime() - now.getTime();
      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      let displayStr = "";
      if (days > 0) displayStr += `${days}d `;
      displayStr += `${hours}h ${mins}m ${secs}s`;
      countdownEl.textContent = displayStr;
    }

    tick();
    if (window.batchCountdownInterval) clearInterval(window.batchCountdownInterval);
    window.batchCountdownInterval = setInterval(tick, 1000);
  }

  // Render Classes & Appointments Timeline Feed
  function renderClientSessionsFeed() {
    if (!profileSessionsFeed) return;
    profileSessionsFeed.innerHTML = "";

    const appointments = JSON.parse(localStorage.getItem("qy_appointments") || "[]");
    const batches = JSON.parse(localStorage.getItem("qy_batches") || "[]");
    const userEmail = state.currentUser ? state.currentUser.email : "";

    const mySessions = [];

    // Appointments
    appointments.forEach(a => {
      if (a.studentEmail === userEmail) {
        let dateObj;
        try {
          const time24 = convertTimeTo24h(a.time);
          dateObj = new Date(`${a.date}T${time24}`);
        } catch(e) {
          dateObj = new Date();
        }

        mySessions.push({
          id: a.id,
          source: "appointment",
          title: `Coaching: ${a.selectedRoutine || "Yoga Review"}`,
          timeDisplay: `${formatDateToIndian(a.date)} at ${a.time}`,
          status: a.status,
          timestamp: dateObj.getTime(),
          actions: a.status !== "Cancelled"
        });
      }
    });

    // Batch Classes
    const batchId = state.currentUser ? state.currentUser.batchId : null;
    const activeBatch = batchId ? batches.find(b => b.id === batchId) : null;
    if (activeBatch && activeBatch.timetable) {
      activeBatch.timetable.forEach((slot, idx) => {
        const nextDate = getWeekdayTimestamp(slot.day, slot.time);
        mySessions.push({
          id: `batch-${idx}`,
          source: "batch",
          title: `Class: ${activeBatch.name}`,
          timeDisplay: `Weekly ${slot.day} at ${slot.time}`,
          status: "Scheduled",
          timestamp: nextDate.getTime(),
          actions: true
        });
      });
    }

    // Sort timeline chronological ascending
    mySessions.sort((a, b) => a.timestamp - b.timestamp);

    if (mySessions.length === 0) {
      profileSessionsFeed.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.9rem;">No upcoming classes or coaching sessions scheduled.</p>`;
      return;
    }

    mySessions.forEach(sess => {
      const row = document.createElement("div");
      row.className = "profile-session-row";
      
      let actionButtons = "";
      if (sess.source === "appointment" && sess.actions) {
        actionButtons = `
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-secondary btn-sm checkin-session-btn" data-id="${sess.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Check In</button>
            <button class="btn btn-rose btn-sm cancel-session-btn" data-id="${sess.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Cancel</button>
          </div>
        `;
      } else if (sess.source === "batch") {
        actionButtons = `
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-secondary btn-sm checkin-session-btn" data-id="${sess.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Check In</button>
          </div>
        `;
      }

      const statusClass = `badge-${sess.status.toLowerCase()}`;

      row.innerHTML = `
        <div class="feed-item-left">
          <span class="feed-item-title" style="font-weight:600; color:var(--text-primary);">${sess.title}</span>
          <span class="feed-item-subtitle" style="font-size:0.8rem; color:var(--text-muted);">${sess.timeDisplay}</span>
          ${actionButtons}
        </div>
        <div class="feed-item-right" style="align-self: center;">
          <span class="feed-item-badge ${statusClass}">${sess.status}</span>
        </div>
      `;

      // Event listener check-in
      const checkinBtn = row.querySelector(".checkin-session-btn");
      if (checkinBtn) {
        checkinBtn.addEventListener("click", () => {
          alert("Check-in successful! Namaste.");
          checkinBtn.textContent = "Checked In";
          checkinBtn.disabled = true;
        });
      }

      // Event listener cancel
      const cancelBtn = row.querySelector(".cancel-session-btn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to cancel this appointment session?")) {
            cancelAppointmentSession(sess.id);
          }
        });
      }

      profileSessionsFeed.appendChild(row);
    });
  }

  function cancelAppointmentSession(apptId) {
    const appointments = JSON.parse(localStorage.getItem("qy_appointments") || "[]");
    const idx = appointments.findIndex(a => a.id === apptId);
    if (idx > -1) {
      const appt = appointments[idx];
      appt.status = "Cancelled";
      localStorage.setItem("qy_appointments", JSON.stringify(appointments));

      // Cancel or mark refund initiated for the related billing/payment record
      const payments = loadPayments();
      const pIdx = payments.findIndex(p => p.appointmentId === apptId);
      if (pIdx > -1) {
        if (payments[pIdx].status === "paid") {
          payments[pIdx].status = "refund initiated";
        } else {
          payments[pIdx].status = "cancelled";
        }
        savePayments(payments);
      } else {
        saveToServer();
      }

      alert("Appointment cancelled successfully.");

      sendTransactionalEmail("appointment", {
        appointmentId: appt.id,
        action: "Cancellation",
        date: appt.date,
        time: appt.time,
        routine: appt.selectedRoutine
      }, appt.studentEmail);

      sendWhatsAppNotification("cancellation", {
        message: `Hi {{name}}, your private coaching for ${appt.selectedRoutine} on ${appt.date} at ${appt.time} has been cancelled.`
      }, appt.studentEmail);

      renderClientDashboard();
      renderStudentAppointments();
      renderAdminAppointments();
    }
  }

  function syncCancelledAppointmentsWithBilling() {
    try {
      const appointments = JSON.parse(localStorage.getItem("qy_appointments") || "[]");
      const payments = loadPayments();
      let modified = false;

      appointments.forEach(appt => {
        if (appt.status === "Cancelled" || appt.status === "cancelled") {
          const pIdx = payments.findIndex(p => p.appointmentId === appt.id || (appt.invoiceId && p.id === appt.invoiceId));
          if (pIdx > -1) {
            const pay = payments[pIdx];
            if ((pay.status === "cancelled" || pay.status === "cancelled") && (pay.utr || pay.paymentDate)) {
              pay.status = "refund initiated";
              modified = true;
            } else if (pay.status === "paid" && pay.status !== "refund initiated") {
              pay.status = "refund initiated";
              modified = true;
            } else if (pay.status !== "paid" && pay.status !== "refund initiated" && pay.status !== "cancelled" && pay.status !== "refunded") {
              pay.status = "cancelled";
              modified = true;
            }
          }
        }
      });

      if (modified) {
        savePayments(payments);
      }
    } catch (e) {
      console.warn("Failed to sync historical cancelled appointments with billing:", e);
    }
  }

  // Render Billing Subscription & Receipt History
  function renderClientBillingHistory() {
    if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") return;
    if (!profileBillingTableBody) return;
    profileBillingTableBody.innerHTML = "";

    const payments = loadPayments();
    const userEmail = state.currentUser ? state.currentUser.email : "";
    const myPayments = payments.filter(p => p.userEmail === userEmail);

    // Search and filter inputs for student billing
    const billingSearchInput = document.getElementById("student-billing-search-input");
    const billingStatusFilter = document.getElementById("student-billing-status-filter");
    const searchVal = billingSearchInput ? billingSearchInput.value.toLowerCase().trim() : "";
    const statusVal = billingStatusFilter ? billingStatusFilter.value : "all";

    const filteredPayments = myPayments.filter(p => {
      const matchesSearch = !searchVal || 
        (p.description && p.description.toLowerCase().includes(searchVal)) ||
        (p.id && p.id.toLowerCase().includes(searchVal));

      const matchesStatus = statusVal === "all" || 
        p.status.replace(/\s+/g, '-').toLowerCase() === statusVal.replace(/\s+/g, '-').toLowerCase();

      return matchesSearch && matchesStatus;
    });

    if (filteredPayments.length === 0) {
      profileBillingTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
            No billing records match the search query or status filter.
          </td>
        </tr>
      `;
      return;
    }

    filteredPayments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

    filteredPayments.forEach(p => {
      const row = document.createElement("tr");
      const statusClass = `badge-${p.status.replace(/\s+/g, '-')}`;
      
      let receiptAction = "";
      if (p.status === "paid") {
        receiptAction = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            ${p.utr ? `<span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); font-family: monospace;">UTR: ${p.utr}</span>` : ""}
            <button class="btn btn-secondary btn-sm print-receipt-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Print Receipt</button>
          </div>
        `;
      } else if (p.status === "pending" || p.status === "overdue") {
        receiptAction = `<button class="btn btn-primary btn-sm pay-upi-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Pay via UPI</button>`;
      } else if (p.status === "review") {
        receiptAction = `<span style="font-size: 0.8rem; color: #fbbf24; font-weight: 500;">Reviewing Reference</span>`;
      } else {
        receiptAction = `<span style="font-size: 0.8rem; color: var(--text-muted);">Unavailable</span>`;
      }

      row.innerHTML = `
        <td><span style="font-weight: 600; font-family: monospace;">#${p.id || 'INV-001'}</span></td>
        <td><span style="font-weight: 500;">${p.description || "Subscription"}</span></td>
        <td><span style="color: var(--text-secondary); font-size: 0.9rem;">${formatDateToIndian(p.dueDate)}</span></td>
        <td><span style="font-weight: 700; color: var(--text-primary);">₹${p.amount}</span></td>
        <td><span class="feed-item-badge ${statusClass}">${p.status}</span></td>
        <td style="text-align: right;">${receiptAction}</td>
      `;

      const printBtn = row.querySelector(".print-receipt-btn");
      if (printBtn) {
        printBtn.addEventListener("click", () => {
          openReceiptModal(p);
        });
      }

      const payUpiBtn = row.querySelector(".pay-upi-btn");
      if (payUpiBtn) {
        payUpiBtn.addEventListener("click", () => {
          openUpiPaymentModal(p);
        });
      }

      profileBillingTableBody.appendChild(row);
    });
  }

  // Storage helpers for payments
  function loadPayments() {
    let payments = JSON.parse(localStorage.getItem("qy_payments") || "[]");
    const todayStr = new Date().toISOString().split('T')[0];
    let modified = false;
    payments = payments.map(p => {
      if (p.status === "pending" && p.dueDate < todayStr) {
        p.status = "overdue";
        modified = true;
      }
      return p;
    });
    if (modified) {
      localStorage.setItem("qy_payments", JSON.stringify(payments));
      saveToServer();
    }
    return payments;
  }

  function savePayments(payments) {
    localStorage.setItem("qy_payments", JSON.stringify(payments));
    saveToServer();
  }

  // Storage helpers for batches
  function loadBatches() {
    const data = localStorage.getItem("qy_batches");
    if (!data) {
      const initialBatches = [
        {
          id: "batch-vinyasa-mornings",
          name: "Morning Vinyasa Flow",
          instructor: "David Vance",
          capacity: 15,
          timetable: [
            { day: "Monday", time: "08:00 AM" },
            { day: "Wednesday", time: "08:00 AM" },
            { day: "Friday", time: "08:00 AM" }
          ]
        }
      ];
      localStorage.setItem("qy_batches", JSON.stringify(initialBatches));
      return initialBatches;
    }
    return JSON.parse(data);
  }

  function saveBatches(batches) {
    localStorage.setItem("qy_batches", JSON.stringify(batches));
    saveToServer();
  }

  // Storage helpers for appointments
  function loadAppointments() {
    const data = localStorage.getItem("qy_appointments");
    if (!data) {
      const initialAppointments = [
        {
          id: "appt-1",
          studentEmail: "member@quantumyoga.xyz",
          selectedRoutine: "Morning Energizing Flow",
          date: "2026-06-20",
          time: "10:00 AM",
          status: "scheduled"
        }
      ];
      localStorage.setItem("qy_appointments", JSON.stringify(initialAppointments));
      return initialAppointments;
    }
    return JSON.parse(data);
  }

  function saveAppointments(appointments) {
    localStorage.setItem("qy_appointments", JSON.stringify(appointments));
    saveToServer();
  }

  function openAppointmentModal(appointmentId = null) {
    if (!appointmentModal) return;
    
    if (appointmentRoutineSelect) {
      appointmentRoutineSelect.innerHTML = '<option value="">Select a Routine...</option>';
      YOGA_ROUTINES.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.name;
        opt.textContent = r.name;
        appointmentRoutineSelect.appendChild(opt);
      });
    }

    if (appointmentId) {
      const appointments = loadAppointments();
      const appt = appointments.find(a => a.id === appointmentId);
      if (!appt) return;

      if (appointmentModalTitle) appointmentModalTitle.textContent = "Reschedule Private Session";
      if (appointmentRoutineSelect) {
        appointmentRoutineSelect.value = appt.selectedRoutine;
        appointmentRoutineSelect.disabled = true;
      }
      if (appointmentDateInput) appointmentDateInput.value = appt.date;
      if (appointmentTimeSelect) appointmentTimeSelect.value = appt.time;
      if (saveAppointmentBtn) saveAppointmentBtn.textContent = "Save Changes";
      
      if (appointmentStudentGroup) appointmentStudentGroup.style.display = "none";
      if (appointmentStudentSelect) appointmentStudentSelect.required = false;
      
      appointmentForm.dataset.appointmentId = appointmentId;
    } else {
      if (appointmentModalTitle) appointmentModalTitle.textContent = "Book Private Coaching Session";
      if (appointmentRoutineSelect) {
        appointmentRoutineSelect.value = "";
        appointmentRoutineSelect.disabled = false;
      }
      if (appointmentDateInput) appointmentDateInput.value = "";
      if (appointmentTimeSelect) appointmentTimeSelect.value = "";
      if (saveAppointmentBtn) saveAppointmentBtn.textContent = "Schedule Appointment";
      
      const isAdmin = state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz";
      if (isAdmin && appointmentStudentGroup && appointmentStudentSelect) {
        appointmentStudentGroup.style.display = "flex";
        appointmentStudentSelect.required = true;
        
        const users = loadUsers();
        const students = users.filter(u => u.email !== "admin@quantumyoga.xyz");
        appointmentStudentSelect.innerHTML = '<option value="">Select a Student...</option>';
        students.forEach(student => {
          const opt = document.createElement("option");
          opt.value = student.email;
          opt.textContent = `${student.name} (${student.email})`;
          appointmentStudentSelect.appendChild(opt);
        });
      } else {
        if (appointmentStudentGroup) appointmentStudentGroup.style.display = "none";
        if (appointmentStudentSelect) appointmentStudentSelect.required = false;
      }
      
      if (appointmentForm) delete appointmentForm.dataset.appointmentId;
    }

    appointmentModal.style.display = "flex";
    appointmentModal.classList.add("active");
    appointmentModal.setAttribute("aria-hidden", "false");
  }

  function closeAppointmentModal() {
    if (!appointmentModal) return;
    appointmentModal.style.display = "none";
    appointmentModal.classList.remove("active");
    appointmentModal.setAttribute("aria-hidden", "true");
    if (appointmentForm) appointmentForm.reset();
    if (appointmentForm) delete appointmentForm.dataset.appointmentId;
  }

  function renderStudentAppointments() {
    if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") return;
    if (!profileUpcomingAppointments || !profilePastAppointments) return;
    
    profileUpcomingAppointments.innerHTML = "";
    profilePastAppointments.innerHTML = "";
    
    const appointments = loadAppointments();
    const paymentsList = loadPayments();
    const userEmail = state.currentUser ? state.currentUser.email : "";
    const myAppts = appointments.filter(a => a.studentEmail === userEmail);
    
    myAppts.sort((a, b) => {
      const dateTimeA = `${a.date}T${convertTimeTo24h(a.time)}`;
      const dateTimeB = `${b.date}T${convertTimeTo24h(b.time)}`;
      return dateTimeA.localeCompare(dateTimeB);
    });
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    let upcomingCount = 0;
    let pastCount = 0;
    const defaultFee = loadAppointmentFee();

    // Search and filter logic for student appointments
    const searchApptInput = document.getElementById("student-appointments-search-input");
    const statusApptFilter = document.getElementById("student-appointments-status-filter");
    const searchVal = searchApptInput ? searchApptInput.value.toLowerCase().trim() : "";
    const statusVal = statusApptFilter ? statusApptFilter.value : "all";

    const filteredAppts = myAppts.filter(a => {
      const matchesSearch = !searchVal || 
        (a.selectedRoutine && a.selectedRoutine.toLowerCase().includes(searchVal));

      const matchesStatus = statusVal === "all" || 
        a.status.toLowerCase() === statusVal.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    filteredAppts.forEach(appt => {
      const isUpcoming = appt.status !== "Cancelled" && appt.date >= todayStr;
      const apptFee = appt.fee !== undefined ? appt.fee : defaultFee;
      
      const card = document.createElement("div");
      card.className = "profile-session-row";
      card.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--glass-light-bg); border: 1px solid var(--glass-light-border); border-radius: var(--radius-sm); margin-bottom: 0.5rem;";
      
      let actionButtons = "";
      if (isUpcoming) {
        actionButtons = `
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-secondary btn-sm reschedule-appt-btn" data-id="${appt.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Reschedule</button>
            <button class="btn btn-rose btn-sm cancel-appt-btn" data-id="${appt.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Cancel</button>
          </div>
        `;
      }
      
      const relatedPayment = paymentsList.find(p => p.appointmentId === appt.id || (appt.invoiceId && p.id === appt.invoiceId));
      const isPaid = relatedPayment && (relatedPayment.status === "paid" || relatedPayment.status === "refund initiated" || relatedPayment.status === "refunded");
      const feeDisplay = (appt.status === "Cancelled" && !isPaid) ? "None" : `\u20b9${apptFee}`;
      
      card.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <span style="font-weight: 600; color: var(--text-primary);">${appt.selectedRoutine}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">\uD83D\uDCC5 ${formatDateToIndian(appt.date)} at \u23F0 ${appt.time}</span>
          <span style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 600;">Fee: ${feeDisplay}</span>
          ${actionButtons}
        </div>
        <div>
          <span class="feed-item-badge badge-${appt.status.toLowerCase()}">${appt.status}</span>
        </div>
      `;
      
      if (isUpcoming) {
        profileUpcomingAppointments.appendChild(card);
        upcomingCount++;
      } else {
        profilePastAppointments.appendChild(card);
        pastCount++;
      }
    });
    
    if (upcomingCount === 0) {
      profileUpcomingAppointments.innerHTML = `<p class="empty-text" style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem 0;">No upcoming appointments scheduled.</p>`;
    }
    if (pastCount === 0) {
      profilePastAppointments.innerHTML = `<p class="empty-text" style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem 0;">No past sessions.</p>`;
    }
    
    document.querySelectorAll(".reschedule-appt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        openAppointmentModal(id);
      });
    });
    
    document.querySelectorAll(".cancel-appt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (confirm("Are you sure you want to cancel this appointment session?")) {
          cancelAppointmentSession(id);
        }
      });
    });
  }

  function renderAdminAppointments() {
    if (!adminAppointmentsTableBody) return;
    
    adminAppointmentsTableBody.innerHTML = "";
    
    const appointments = loadAppointments();
    const paymentsList = loadPayments();
    const query = adminAppointmentsSearchInput ? adminAppointmentsSearchInput.value.toLowerCase().trim() : "";
    
    appointments.sort((a, b) => {
      const dateTimeA = `${a.date}T${convertTimeTo24h(a.time)}`;
      const dateTimeB = `${b.date}T${convertTimeTo24h(b.time)}`;
      return dateTimeB.localeCompare(dateTimeA);
    });
    
    let renderedCount = 0;
    
    appointments.forEach(appt => {
      const matchesQuery = !query || 
        appt.studentEmail.toLowerCase().includes(query) || 
        appt.selectedRoutine.toLowerCase().includes(query);
        
      if (!matchesQuery) return;
      
      const tr = document.createElement("tr");
      const apptFee = appt.fee !== undefined ? appt.fee : loadAppointmentFee();
      
      let actionButtons = "";
      if (appt.status !== "Cancelled") {
        actionButtons = `
          <button class="btn btn-secondary btn-sm admin-reschedule-appt-btn" data-id="${appt.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Reschedule</button>
          <button class="btn btn-rose btn-sm admin-cancel-appt-btn" data-id="${appt.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;">Cancel</button>
          <button class="btn btn-primary btn-sm admin-charge-appt-btn" data-id="${appt.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem; background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: #10b981;">Charge \u20b9${apptFee}</button>
        `;
      } else {
        actionButtons = `<span style="color: var(--text-muted); font-size: 0.8rem;">None</span>`;
      }

      const relatedPayment = paymentsList.find(p => p.appointmentId === appt.id || (appt.invoiceId && p.id === appt.invoiceId));
      const isPaid = relatedPayment && (relatedPayment.status === "paid" || relatedPayment.status === "refund initiated" || relatedPayment.status === "refunded");
      const feeLabel = (appt.status === "Cancelled" && !isPaid) ? `<span style="color:var(--text-muted);">-</span>` : `<span style="font-weight:600;color:var(--accent-primary);">\u20b9${apptFee}</span>`;
      
      const usersList = loadUsers();
      const studentUser = usersList.find(u => u.email === appt.studentEmail);
      const waIcon = studentUser && studentUser.phone ? ` <a href="${getWhatsAppLink(studentUser.phone, studentUser.name)}" target="_blank" title="Chat on WhatsApp" style="text-decoration:none; font-size: 0.85rem; cursor: pointer;">💬</a>` : "";

      tr.innerHTML = `
        <td><span style="font-weight: 500;">${appt.studentEmail}</span>${waIcon}</td>
        <td>${appt.selectedRoutine}</td>
        <td>${formatDateToIndian(appt.date)}</td>
        <td>${appt.time}</td>
        <td>${feeLabel}</td>
        <td><span class="feed-item-badge badge-${appt.status.toLowerCase()}">${appt.status}</span></td>
        <td style="text-align: right;">${actionButtons}</td>
      `;
      
      adminAppointmentsTableBody.appendChild(tr);
      renderedCount++;
    });
    
    if (renderedCount === 0) {
      adminAppointmentsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
            No appointments found.
          </td>
        </tr>
      `;
    }
    
    document.querySelectorAll(".admin-reschedule-appt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        openAppointmentModal(id);
      });
    });
    
    document.querySelectorAll(".admin-cancel-appt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (confirm("Are you sure you want to cancel this appointment session?")) {
          cancelAppointmentSession(id);
        }
      });
    });

    document.querySelectorAll(".admin-charge-appt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        chargeForAppointment(id);
      });
    });
  }

  // Pre-fill invoice form and switch to Payments tab to charge for an appointment
  function chargeForAppointment(apptId) {
    const appointments = loadAppointments();
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;

    const fee = appt.fee !== undefined ? appt.fee : loadAppointmentFee();

    if (fee === 0) {
      alert("\u26a0\ufe0f The appointment fee is \u20b90. Please configure the default session fee in System Settings before charging.");
    }

    // Pre-fill invoice form
    const invoiceEmailEl = document.getElementById("admin-invoice-email");
    const invoiceAmountEl = document.getElementById("admin-invoice-amount");
    const invoiceDescEl = document.getElementById("admin-invoice-desc");
    if (invoiceEmailEl) invoiceEmailEl.value = appt.studentEmail;
    if (invoiceAmountEl) invoiceAmountEl.value = fee;
    if (invoiceDescEl) invoiceDescEl.value = `Private coaching class fee`;

    // Switch to Payments tab
    setAdminSubTab("payments");

    // Scroll invoice form into view
    const invoiceForm = document.getElementById("admin-issue-invoice-form");
    if (invoiceForm) {
      setTimeout(() => invoiceForm.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    }
  }

  // Open receipt modal overlay
  function openReceiptModal(payment) {
    if (!receiptModal || !receiptModalBody) return;
    
    const paymentDateStr = payment.paymentDate || new Date().toISOString().split('T')[0];
    
    receiptModalBody.innerHTML = `
      <div class="receipt-details-container">
        <div class="receipt-header">
          <h2>Quantum Yoga Receipt</h2>
          <p>Namaste! Thank you for practicing with us.</p>
        </div>
        <div class="receipt-row">
          <strong>Invoice Number:</strong>
          <span>#${payment.id}</span>
        </div>
        <div class="receipt-row">
          <strong>Description:</strong>
          <span>${payment.description || 'Monthly Gold Membership'}</span>
        </div>
        <div class="receipt-row">
          <strong>Student Email:</strong>
          <span>${payment.userEmail}</span>
        </div>
        <div class="receipt-row">
          <strong>Due Date:</strong>
          <span>${formatDateToIndian(payment.dueDate)}</span>
        </div>
        <div class="receipt-row">
          <strong>Payment Date:</strong>
          <span>${formatDateToIndian(paymentDateStr)}</span>
        </div>
        ${payment.utr ? `
        <div class="receipt-row">
          <strong>UTR Number (UPI):</strong>
          <span style="font-family: monospace;">${payment.utr}</span>
        </div>
        ` : ""}
        <div class="receipt-row">
          <strong>Status:</strong>
          <span style="color: #10B981; text-transform: uppercase;">PAID</span>
        </div>
        <div class="receipt-total">
          <strong>Total Paid:</strong>
          <span>₹${payment.amount}</span>
        </div>
        
        <div class="receipt-stamp-container">
          <div class="receipt-stamp">PAID • QUANTUM YOGA</div>
        </div>
        
        <div class="print-btn-container">
          <button class="btn btn-primary btn-print-receipt">Print Receipt</button>
        </div>
      </div>
    `;
    
    receiptModalBody.querySelector(".btn-print-receipt").addEventListener("click", () => {
      window.print();
    });
    
    receiptModal.classList.add("active");
    receiptModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeReceiptModal() {
    if (receiptModal) {
      receiptModal.classList.remove("active");
      receiptModal.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  }

  if (closeReceiptModalBtn) {
    closeReceiptModalBtn.addEventListener("click", closeReceiptModal);
  }
  if (receiptModal) {
    receiptModal.addEventListener("click", (e) => {
      if (e.target === receiptModal) closeReceiptModal();
    });
  }

  // Admin Billing Panel Render
  function renderAdminPayments() {
    if (!adminPaymentsTableBody) return;
    
    const payments = loadPayments();
    const users = loadUsers();
    
    payments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    
    const totalInvoiced = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const collectedRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const pendingDues = payments.filter(p => p.status === "pending" || p.status === "review").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const overdueBalance = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    
    if (adminBillingKpiTotalInvoiced) adminBillingKpiTotalInvoiced.textContent = `₹${totalInvoiced.toFixed(2)}`;
    if (adminBillingKpiPaid) adminBillingKpiPaid.textContent = `₹${collectedRevenue.toFixed(2)}`;
    if (adminBillingKpiPending) adminBillingKpiPending.textContent = `₹${pendingDues.toFixed(2)}`;
    if (adminBillingKpiOverdue) adminBillingKpiOverdue.textContent = `₹${overdueBalance.toFixed(2)}`;
    
    if (adminInvoiceEmail) {
      adminInvoiceEmail.innerHTML = "";
      const regularUsers = users.filter(u => u.email !== "admin@quantumyoga.xyz");
      regularUsers.forEach(u => {
        const option = document.createElement("option");
        option.value = u.email;
        option.textContent = `${u.name} (${u.email})`;
        adminInvoiceEmail.appendChild(option);
      });
    }

    // Search and filter logic for Ledger Table
    const searchLedgerInput = document.getElementById("admin-payments-search-input");
    const statusLedgerFilter = document.getElementById("admin-payments-status-filter");
    const searchVal = searchLedgerInput ? searchLedgerInput.value.toLowerCase().trim() : "";
    const statusVal = statusLedgerFilter ? statusLedgerFilter.value : "all";

    const filteredPayments = payments.filter(p => {
      const userObj = users.find(u => u.email === p.userEmail);
      const userName = userObj ? userObj.name : "";
      
      const matchesSearch = !searchVal || 
        p.userEmail.toLowerCase().includes(searchVal) || 
        (userName && userName.toLowerCase().includes(searchVal)) ||
        (p.description && p.description.toLowerCase().includes(searchVal)) ||
        (p.id && p.id.toLowerCase().includes(searchVal));

      const matchesStatus = statusVal === "all" || 
        p.status.replace(/\s+/g, '-').toLowerCase() === statusVal.replace(/\s+/g, '-').toLowerCase();

      return matchesSearch && matchesStatus;
    });
    
    adminPaymentsTableBody.innerHTML = "";
    if (filteredPayments.length === 0) {
      adminPaymentsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem 0;">
            No studio invoices match the search query or filters.
          </td>
        </tr>
      `;
      return;
    }
    
    filteredPayments.forEach(p => {
      const userObj = users.find(u => u.email === p.userEmail);
      const userName = userObj ? userObj.name : p.userEmail;
      const statusClass = `badge-${p.status.replace(/\s+/g, '-')}`;
      
      let actionButtons = "";
      if (p.status === "paid") {
        actionButtons = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            ${p.utr ? `<span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); font-family: monospace; letter-spacing: 0.02em;">UTR: ${p.utr}</span>` : ""}
            <button class="btn btn-secondary btn-sm print-receipt-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Print Receipt</button>
          </div>
        `;
      } else if (p.status === "review") {
        actionButtons = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 600; color: #fbbf24; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); padding: 0.2rem 0.4rem; border-radius: var(--radius-sm); font-family: monospace; letter-spacing: 0.02em;">UTR: ${p.utr || "N/A"}</span>
            <button class="btn btn-primary btn-sm approve-payment-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #10b981; border: none; color: white;">Approve</button>
            <button class="btn btn-secondary btn-sm reject-payment-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #ef4444; border: none; color: white;">Reject</button>
          </div>
        `;
      } else if (p.status === "refund initiated") {
        actionButtons = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            <button class="btn btn-primary btn-sm approve-refund-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #8b5cf6; border: none; color: white;">Issue Refund</button>
          </div>
        `;
      } else {
        actionButtons = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm record-payment-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Record Payment</button>
            <button class="btn btn-secondary btn-sm check-email-payment-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(167, 139, 250, 0.15); border-color: rgba(167, 139, 250, 0.35); color: #a78bfa;">Check Email</button>
            <button class="btn btn-secondary btn-sm send-reminder-btn" data-id="${p.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Send Reminder</button>
          </div>
        `;
      }
      
      const waLink = userObj && userObj.phone ? ` <a href="${getWhatsAppLink(userObj.phone, userObj.name)}" target="_blank" title="Chat on WhatsApp" style="text-decoration:none; font-size: 0.85rem; cursor: pointer;">💬</a>` : "";
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span style="font-weight: 600; font-family: monospace;">#${p.id}</span></td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 500;">${userName}${waLink}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${p.userEmail}</span>
          </div>
        </td>
        <td><span style="font-weight: 500;">${p.description || "Subscription"}</span></td>
        <td><span style="font-weight: 700; color: var(--text-primary);">₹${p.amount}</span></td>
        <td><span style="color: var(--text-secondary); font-size: 0.9rem;">${formatDateToIndian(p.dueDate)}</span></td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.2rem;">
            <span class="feed-item-badge ${statusClass}">${p.status}</span>
            ${p.lastReminderSent ? `<span style="font-size: 0.65rem; color: var(--accent-primary);">Reminder: ${formatDateToIndian(p.lastReminderSent)}</span>` : ""}
          </div>
        </td>
        <td style="text-align: right;">${actionButtons}</td>
      `;
      
      if (p.status === "paid") {
        row.querySelector(".print-receipt-btn").addEventListener("click", () => {
          openReceiptModal(p);
        });
      } else if (p.status === "review") {
        row.querySelector(".approve-payment-btn").addEventListener("click", () => {
          approvePayment(p.id);
        });
        row.querySelector(".reject-payment-btn").addEventListener("click", () => {
          rejectPayment(p.id);
        });
      } else if (p.status === "refund initiated") {
        row.querySelector(".approve-refund-btn").addEventListener("click", () => {
          approveRefund(p.id);
        });
      } else {
        row.querySelector(".record-payment-btn").addEventListener("click", () => {
          recordPayment(p.id);
        });
        row.querySelector(".check-email-payment-btn").addEventListener("click", () => {
          checkEmailPayment(p.id);
        });
        row.querySelector(".send-reminder-btn").addEventListener("click", () => {
          sendReminder(p.id);
        });
      }
      
      adminPaymentsTableBody.appendChild(row);
    });
  }

  async function checkEmailPayment(invoiceId) {
    const payments = loadPayments();
    const idx = payments.findIndex(p => p.id === invoiceId);
    if (idx === -1) return;
    const payment = payments[idx];

    const emails = loadEmails();
    const userEmails = emails.filter(e => {
      const fromEmail = (e.from || "").toLowerCase();
      const subject = (e.subject || "").toLowerCase();
      const isFromUser = fromEmail.includes(payment.userEmail.toLowerCase());
      const isVerification = subject.includes("upi payment verification");
      
      const matchesAppt = payment.appointmentId ? subject.includes(payment.appointmentId.toLowerCase()) : false;
      const matchesInvoice = subject.includes(invoiceId.toLowerCase());
      
      return isFromUser && isVerification && (matchesAppt || matchesInvoice);
    });

    if (userEmails.length === 0) {
      alert(`No payment verification emails found from ${payment.userEmail} for Invoice #${invoiceId}.`);
      return;
    }

    userEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestEmail = userEmails[0];

    const body = await emailGetMessageBody(latestEmail.id);
    let txId = "";
    if (body) {
      const txMatch = body.match(/(?:Transaction ID|UTR Number|Tx ID):\s*([a-zA-Z0-9\-]+)/i) || body.match(/\b\d{12}\b/);
      if (txMatch) {
        txId = txMatch[1] || txMatch[0];
        if (txId.includes("ENTER") || txId.includes("[") || txId.includes("]")) {
          txId = "";
        }
      }
    }

    if (txId) {
      payments[idx].status = "review";
      payments[idx].utr = txId;
      savePayments(payments);
      
      try {
        await sendTransactionalEmail("payment-under-review", {
          invoiceId: payments[idx].id,
          amount: payments[idx].amount,
          utr: payments[idx].utr
        }, payments[idx].userEmail);
      } catch (err) {
        console.error("Failed to send payment under review email:", err);
      }
      
      alert(`Found verification email! Extracted Tx ID: ${txId}. Invoice status updated to Under Review.`);
      renderAdminPayments();
      renderAdminOverview();
    } else {
      alert(`Found a verification email from ${payment.userEmail}, but could not extract a valid Transaction ID. Please check the email manually.`);
    }
  }

  async function recordPayment(invoiceId) {
    const payments = loadPayments();
    const idx = payments.findIndex(p => p.id === invoiceId);
    if (idx > -1) {
      const utr = prompt("Enter UPI Transaction ID / Ref (optional):");
      if (utr === null) return; // User cancelled
      
      payments[idx].status = "paid";
      if (utr.trim()) {
        payments[idx].utr = utr.trim();
      }
      payments[idx].paymentDate = new Date().toISOString().split('T')[0];
      savePayments(payments);
      
      try {
        await sendTransactionalEmail("payment-approved", {
          invoiceId: payments[idx].id,
          amount: payments[idx].amount,
          utr: payments[idx].utr,
          paymentDate: payments[idx].paymentDate
        }, payments[idx].userEmail);
        alert(`Payment of ₹${payments[idx].amount} for Invoice #${invoiceId} recorded successfully and confirmation email sent.`);
      } catch (err) {
        console.error("Failed to send payment approval email:", err);
        alert(`Payment of ₹${payments[idx].amount} for Invoice #${invoiceId} recorded, but email failed: ${err.message || err}`);
      }
      renderAdminPayments();
      renderAdminOverview();
    }
  }

  async function sendReminder(invoiceId) {
    const payments = loadPayments();
    const idx = payments.findIndex(p => p.id === invoiceId);
    if (idx > -1) {
      payments[idx].lastReminderSent = new Date().toISOString().split('T')[0];
      savePayments(payments);
      
      try {
        await sendTransactionalEmail("reminder", {
          invoiceId: payments[idx].id,
          description: payments[idx].description,
          amount: payments[idx].amount,
          dueDate: payments[idx].dueDate
        }, payments[idx].userEmail);
        alert(`Reminder for Invoice #${invoiceId} email and WhatsApp logged and sent to ${payments[idx].userEmail}.`);
      } catch (err) {
        console.error("Failed to send payment reminder email:", err);
        alert(`Reminder logged, but notification failed: ${err.message || err}`);
      }
      renderAdminPayments();
    }
  }

  async function approvePayment(invoiceId) {
    const payments = loadPayments();
    const idx = payments.findIndex(p => p.id === invoiceId);
    if (idx > -1) {
      payments[idx].status = "paid";
      payments[idx].paymentDate = new Date().toISOString().split('T')[0];
      savePayments(payments);
      
      try {
        await sendTransactionalEmail("payment-approved", {
          invoiceId: payments[idx].id,
          amount: payments[idx].amount,
          utr: payments[idx].utr,
          paymentDate: payments[idx].paymentDate
        }, payments[idx].userEmail);
        alert(`Payment for Invoice #${invoiceId} approved successfully and confirmation email sent.`);
      } catch (err) {
        console.error("Failed to send payment approval email:", err);
        alert(`Payment for Invoice #${invoiceId} approved, but email failed: ${err.message || err}`);
      }
      renderAdminPayments();
      renderAdminOverview();
    }
  }

  async function rejectPayment(invoiceId) {
    const payments = loadPayments();
    const idx = payments.findIndex(p => p.id === invoiceId);
    if (idx > -1) {
      payments[idx].status = "pending";
      delete payments[idx].utr;
      savePayments(payments);
      
      try {
        await sendTransactionalEmail("payment-declined", {
          invoiceId: payments[idx].id,
          amount: payments[idx].amount
        }, payments[idx].userEmail);
        alert(`Payment for Invoice #${invoiceId} rejected and notification email sent.`);
      } catch (err) {
        console.error("Failed to send payment decline email:", err);
        alert(`Payment for Invoice #${invoiceId} rejected, but email failed: ${err.message || err}`);
      }
      renderAdminPayments();
      renderAdminOverview();
    }
  }

  async function approveRefund(invoiceId) {
    if (confirm("Are you sure you want to approve and issue a refund for this invoice?")) {
      const payments = loadPayments();
      const idx = payments.findIndex(p => p.id === invoiceId);
      if (idx > -1) {
        payments[idx].status = "refunded";
        payments[idx].refundDate = new Date().toISOString().split('T')[0];
        savePayments(payments);
        
        try {
          await sendTransactionalEmail("refunded", {
            invoiceId: payments[idx].id,
            amount: payments[idx].amount,
            refundDate: payments[idx].refundDate
          }, payments[idx].userEmail);
          alert(`Refund for Invoice #${invoiceId} approved and processed successfully. Notification email sent.`);
        } catch (err) {
          console.error("Failed to send refund notification email:", err);
          alert(`Refund for Invoice #${invoiceId} approved, but email failed: ${err.message || err}`);
        }
        
        renderAdminPayments();
        renderAdminOverview();
      }
    }
  }

  if (adminIssueInvoiceForm) {
    adminIssueInvoiceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = adminInvoiceEmail.value;
      const desc = adminInvoiceDesc.value.trim();
      const amount = adminInvoiceAmount.value;
      const due = adminInvoiceDue.value;
      
      if (!email || !desc || !amount || !due) {
        alert("Please fill out all invoice fields.");
        return;
      }
      
      const payments = loadPayments();
      const randNum = Math.floor(Math.random() * 900) + 100;
      const nextId = `INV-${10000 + payments.length + randNum}`;
      
      const newInvoice = {
        id: nextId,
        userEmail: email,
        description: desc,
        amount: amount,
        dueDate: due,
        status: "pending"
      };
      
      payments.push(newInvoice);
      savePayments(payments);
      
      sendTransactionalEmail("invoice", {
        invoiceId: nextId,
        description: desc,
        amount: amount,
        dueDate: due
      }, email);
      
      // WhatsApp notification
      sendWhatsAppNotification("invoice", {
        invoiceId: nextId,
        description: desc,
        amount: amount,
        dueDate: due
      }, email);
      
      alert(`Invoice #${nextId} issued successfully to ${email}.`);
      adminIssueInvoiceForm.reset();
      
      const ledgerTabBtn = document.getElementById("admin-payments-ledger-tab-btn");
      if (ledgerTabBtn) {
        ledgerTabBtn.click();
      } else {
        renderAdminPayments();
      }
      renderAdminOverview();
    });
  }

  // ==========================================================================
  // Admin Panel Functionality
  // ==========================================================================

  function setAdminSubTab(panelName) {
    // Reset all aria-selected states
    document.querySelectorAll(".admin-sub-tab").forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    if (adminEmailTabBtn) adminEmailTabBtn.classList.remove("active");
    
    adminOverviewPanel.style.display = "none";
    adminUsersPanel.style.display = "none";
    if (adminPaymentsPanel) adminPaymentsPanel.style.display = "none";
    if (adminLeadsPanel) adminLeadsPanel.style.display = "none";
    if (adminBatchesPanel) adminBatchesPanel.style.display = "none";
    if (adminAppointmentsPanel) adminAppointmentsPanel.style.display = "none";
    adminReportsPanel.style.display = "none";
    adminSettingsPanel.style.display = "none";
    if (adminEmailPanel) adminEmailPanel.style.display = "none";
    
    if (panelName === "overview") {
      adminOverviewTabBtn.classList.add("active");
      adminOverviewTabBtn.setAttribute("aria-selected", "true");
      adminOverviewPanel.style.display = "block";
      renderAdminOverview();
    } else if (panelName === "users") {
      adminUsersTabBtn.classList.add("active");
      adminUsersTabBtn.setAttribute("aria-selected", "true");
      adminUsersPanel.style.display = "block";
      renderAdminUsersTable();
    } else if (panelName === "payments") {
      if (adminPaymentsTabBtn) { adminPaymentsTabBtn.classList.add("active"); adminPaymentsTabBtn.setAttribute("aria-selected", "true"); }
      if (adminPaymentsPanel) adminPaymentsPanel.style.display = "block";
      renderAdminPayments();
      refreshEmailCache().catch(err => console.warn("Auto email refresh error:", err));
    } else if (panelName === "leads") {
      if (adminLeadsTabBtn) { adminLeadsTabBtn.classList.add("active"); adminLeadsTabBtn.setAttribute("aria-selected", "true"); }
      if (adminLeadsPanel) adminLeadsPanel.style.display = "block";
      renderLeadsTable();
    } else if (panelName === "batches") {
      if (adminBatchesTabBtn) { adminBatchesTabBtn.classList.add("active"); adminBatchesTabBtn.setAttribute("aria-selected", "true"); }
      if (adminBatchesPanel) adminBatchesPanel.style.display = "block";
      renderAdminBatches();
    } else if (panelName === "appointments") {
      if (adminAppointmentsTabBtn) { adminAppointmentsTabBtn.classList.add("active"); adminAppointmentsTabBtn.setAttribute("aria-selected", "true"); }
      if (adminAppointmentsPanel) adminAppointmentsPanel.style.display = "block";
      renderAdminAppointments();
    } else if (panelName === "reports") {
      adminReportsTabBtn.classList.add("active");
      adminReportsTabBtn.setAttribute("aria-selected", "true");
      adminReportsPanel.style.display = "block";
      renderAdminReports();
    } else if (panelName === "email") {
      if (adminEmailTabBtn) { adminEmailTabBtn.classList.add("active"); adminEmailTabBtn.setAttribute("aria-selected", "true"); }
      if (adminEmailPanel) adminEmailPanel.style.display = "block";
      renderAdminEmailTab();
    } else if (panelName === "settings") {
      adminSettingsTabBtn.classList.add("active");
      adminSettingsTabBtn.setAttribute("aria-selected", "true");
      adminSettingsPanel.style.display = "block";
      renderEmailProviderSettings(); // Task 4.6
      if (adminDefaultThemeSelect) {

        adminDefaultThemeSelect.value = getSiteDefaultTheme();
      }
      const currentUpiSettings = loadUpiSettings();
      if (adminUpiVpaInput) {
        adminUpiVpaInput.value = currentUpiSettings.vpa;
      }
      if (adminUpiNameInput) {
        adminUpiNameInput.value = currentUpiSettings.name;
      }
      // Load appointment fee into input
      const apptFeeInput = document.getElementById("admin-appointment-fee-input");
      if (apptFeeInput) {
        const stored = localStorage.getItem(STORAGE_KEY_APPOINTMENT_FEE);
        apptFeeInput.value = stored !== null ? stored : "";
      }
      // Load Gmail Client ID into settings input
      if (adminGmailClientIdInput) {
        adminGmailClientIdInput.value = loadGmailSettings().clientId || "";
      }
    }
  }

  // 12-hour time format helper
  // ==========================================================================
  // Gmail Email Integration — Controller Functions (Tasks 6.x, 7.x, 8.x)
  // ==========================================================================

  /**
   * Updates the Gmail connection status UI in the admin Email tab.
   * Called after connect, disconnect, or page load.
   */
  // Task 4.2 — Renders the Email Provider settings card state
  function renderEmailProviderSettings() {
    const es = loadGmailSettings();
    const isResend = es.provider === "resend";
    // Toggle button active state
    if (emailProviderGmailBtn) {
      emailProviderGmailBtn.classList.toggle("active", !isResend);
    }
    if (emailProviderResendBtn) {
      emailProviderResendBtn.classList.toggle("active", isResend);
    }
    // Show/hide config sections
    if (gmailConfigSection) gmailConfigSection.style.display = isResend ? "none" : "block";
    if (resendConfigSection) resendConfigSection.style.display = isResend ? "block" : "none";
    // Pre-populate Resend inputs
    if (resendApiKeyInput) resendApiKeyInput.value = es.resendApiKey || "";
    if (resendFromAddressInput) resendFromAddressInput.value = es.resendFromAddress || "";
  }

  // Task 5.3 — Provider-agnostic replacement for updateGmailStatusUI
  function updateEmailProviderStatusUI() {
    const es = loadGmailSettings();
    const provider = es.provider || "resend";
    const isResend = provider === "resend";
    const connected = isGmailConnected();

    // Gmail controls visibility
    const gmailVisible = !isResend;
    if (adminGmailConnectedLabel) adminGmailConnectedLabel.style.display = (gmailVisible && connected) ? "flex" : "none";
    if (adminGmailDisconnectedLabel) adminGmailDisconnectedLabel.style.display = (gmailVisible && !connected) ? "block" : "none";
    if (adminGmailConnectedEmail) adminGmailConnectedEmail.textContent = es.connectedEmail || "";
    if (adminGmailConnectBtn) adminGmailConnectBtn.style.display = (gmailVisible && !connected) ? "inline-flex" : "none";
    if (adminGmailDisconnectBtn) adminGmailDisconnectBtn.style.display = (gmailVisible && connected) ? "inline-flex" : "none";
    const resendConfigured = !!(es.resendApiKey);
    if (adminGmailRefreshBtn) adminGmailRefreshBtn.style.display = ((gmailVisible && connected) || (isResend && resendConfigured)) ? "inline-flex" : "none";

    // Resend badge visibility (Task 5.3)
    if (adminResendActiveLabel) {
      adminResendActiveLabel.style.display = (isResend && resendConfigured) ? "flex" : "none";
      if (adminResendFromDisplay) adminResendFromDisplay.textContent = es.resendFromAddress || "";
    }
    if (adminResendUnconfiguredLabel) {
      adminResendUnconfiguredLabel.style.display = (isResend && !resendConfigured) ? "flex" : "none";
    }

    if (adminGmailStatusDetail) {
      adminGmailStatusDetail.textContent = isResend
        ? "Configure your Resend API settings to send & receive emails directly from this panel."
        : "Connect your Gmail account to send & receive emails directly from this panel.";
    }

    // Email tab visibility: show admin tab if clientId present OR resend configured (Task 6.9/8.8)
    if (adminEmailTabBtn) {
      adminEmailTabBtn.style.display = (es.clientId || (isResend && resendConfigured)) ? "inline-flex" : "none";
    }
    if (profileEmailTabBtn) {
      profileEmailTabBtn.style.display = (connected || (isResend && resendConfigured)) ? "inline-flex" : "none";
    }

    updateAdminUnreadBadge();
  }

  // Keep old name as alias for backward compat with any call sites not yet updated
  function updateGmailStatusUI() {
    updateEmailProviderStatusUI();
  }

  /**
   * Renders the entire admin Email panel (connection card + inbox + sent).
   */
  function renderAdminEmailTab() {
    updateEmailProviderStatusUI();
    renderAdminInbox();
    renderAdminSentList();
  }

  /**
   * Formats an email date string to a short readable format.
   */
  function formatEmailDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (e) { return dateStr; }
  }

  /**
   * Renders the inbox email list with search/filter support (Task 6.1).
   */
  function renderAdminInbox(filterMode = "all") {
    if (!adminInboxEmailList) return;
    const emails = loadEmails();
    const gs = loadGmailSettings();
    const connectedEmail = (gs.connectedEmail || "admin@quantumyoga.xyz").toLowerCase();

    let list = emails.filter(e => {
      const isIncoming = e.folder === "inbox" || e.direction === "received";
      const isToAdmin = (e.to || "").toLowerCase().includes(connectedEmail) || (e.to || "").toLowerCase().includes("admin@quantumyoga.xyz");
      const isFromAdmin = (e.from || "").toLowerCase().includes(connectedEmail) || (e.from || "").toLowerCase().includes("admin@quantumyoga.xyz");
      return isIncoming && isToAdmin && !isFromAdmin;
    });

    if (filterMode === "unread") list = list.filter(e => !e.isRead);

    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (list.length === 0) {
      const es = loadGmailSettings();
      const isResend = es.provider === "resend";
      const resendConfigured = !!(es.resendApiKey);
      const emailServiceAvailable = isResend ? resendConfigured : isGmailConnected();

      let msg = "";
      if (emailServiceAvailable) {
        msg = "Your inbox is empty.";
      } else {
        msg = isResend 
          ? "Configure Resend in Settings to see your inbox." 
          : "Connect Gmail above to see your inbox.";
      }
      adminInboxEmailList.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:2rem 0;">${msg}</p>`;
      updateAdminUnreadBadge();
      return;
    }

    adminInboxEmailList.innerHTML = "";
    list.forEach(email => {
      const item = document.createElement("div");
      item.className = `email-list-item${email.isRead ? "" : " unread"}`;
      item.dataset.emailId = email.id;
      item.innerHTML = `
        <div class="${email.isRead ? "email-read-dot" : "email-unread-dot"}"></div>
        <div class="email-content">
          <div class="email-sender">${escapeHtml(email.from || "Unknown Sender")}</div>
          <div class="email-subject">${escapeHtml(email.subject || "(No Subject)")}</div>
          <div class="email-snippet">${escapeHtml(email.snippet || "")}</div>
        </div>
        <div class="email-meta-right">
          <span class="email-date">${formatEmailDate(email.date)}</span>
        </div>
      `;
      item.addEventListener("click", () => openAdminEmailPreview(email.id));
      adminInboxEmailList.appendChild(item);
    });

    updateAdminUnreadBadge();
  }

  /**
   * Renders the sent email list (Task 6.1).
   */
  function renderAdminSentList() {
    if (!adminSentEmailList) return;
    const emails = loadEmails();
    const list = emails
      .filter(e => e.folder === "sent" || e.direction === "sent")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    if (adminSentCount) adminSentCount.textContent = list.length;

    if (list.length === 0) {
      adminSentEmailList.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0;">No sent emails yet.</p>`;
      return;
    }

    adminSentEmailList.innerHTML = "";
    list.forEach(email => {
      const item = document.createElement("div");
      item.className = "email-sent-item";
      item.innerHTML = `
        <div class="email-content">
          <div class="email-sender" style="color:var(--text-muted);">To: ${escapeHtml(email.to || "")}</div>
          <div class="email-subject">${escapeHtml(email.subject || "(No Subject)")}</div>
          <div class="email-snippet">${escapeHtml(email.snippet || "")}</div>
        </div>
        <div class="email-meta-right">
          <span class="email-date">${formatEmailDate(email.date)}</span>
        </div>
      `;
      adminSentEmailList.appendChild(item);
    });
  }

  /**
   * Opens the email preview overlay and loads the full body (Task 6.2).
   */
  let currentPreviewEmail = null;
  async function openAdminEmailPreview(emailId) {
    const emails = loadEmails();
    const email = emails.find(e => e.id === emailId);
    if (!email) return;
    currentPreviewEmail = email;

    if (adminPreviewSubject) adminPreviewSubject.textContent = email.subject || "(No Subject)";
    if (adminPreviewFrom) adminPreviewFrom.textContent = `From: ${email.from || ""}`;
    if (adminPreviewDate) adminPreviewDate.textContent = email.date ? new Date(email.date).toLocaleString() : "";
    if (adminPreviewBody) adminPreviewBody.innerHTML = `<div class="email-loading-spinner"><div class="spinner-dot"></div><div class="spinner-dot"></div><div class="spinner-dot"></div></div>`;
    if (adminEmailPreviewOverlay) adminEmailPreviewOverlay.style.display = "flex";

    // Fetch full body
    const body = await emailGetMessageBody(emailId);
    if (adminPreviewBody) {
      if (body) {
        // Render HTML or plain text safely
        if (body.trim().startsWith("<")) {
          const iframe = document.createElement("iframe");
          iframe.sandbox = "allow-same-origin";
          iframe.style.cssText = "width:100%;border:none;min-height:300px;background:#fff;border-radius:8px;";
          adminPreviewBody.innerHTML = "";
          adminPreviewBody.appendChild(iframe);
          iframe.contentDocument.open();
          iframe.contentDocument.write(body);
          iframe.contentDocument.close();
        } else {
          adminPreviewBody.textContent = body;
        }
      } else {
        adminPreviewBody.innerHTML = `<p style="color:var(--text-muted);">${escapeHtml(email.snippet || "No content available.")}</p>`;
      }
    }

    // UPI Payment Detection Widget integration
    const widget = document.getElementById("admin-preview-payment-widget");
    const badge = document.getElementById("admin-preview-payment-status-badge");
    const studentSpan = document.getElementById("admin-preview-payment-student");
    const amountSpan = document.getElementById("admin-preview-payment-amount");
    const idSpan = document.getElementById("admin-preview-payment-id");
    const txCode = document.getElementById("admin-preview-payment-tx");
    const approveBtn = document.getElementById("admin-preview-payment-approve-btn");
    const declineBtn = document.getElementById("admin-preview-payment-decline-btn");

    const subject = email.subject || "";
    const isUpiVerification = subject.includes("UPI Payment Verification");
    
    if (isUpiVerification && widget) {
      const apptMatch = subject.match(/Appointment\s+([a-zA-Z0-9\-]+)/i);
      const invMatch = subject.match(/Invoice\s+([a-zA-Z0-9\-]+)/i);
      const apptId = apptMatch ? apptMatch[1] : null;
      const invId = invMatch ? invMatch[1] : null;

      let txId = "";
      if (body) {
        const txMatch = body.match(/(?:Transaction ID|UTR Number|Tx ID):\s*([a-zA-Z0-9\-]+)/i) || body.match(/\b\d{12}\b/);
        if (txMatch) {
          txId = txMatch[1] || txMatch[0];
          if (txId.includes("ENTER") || txId.includes("[") || txId.includes("]")) {
            txId = "";
          }
        }
      }

      const payments = loadPayments();
      const payment = payments.find(p => 
        (apptId && (p.appointmentId === apptId || p.id === apptId)) ||
        (invId && (p.id === invId || p.appointmentId === invId))
      );
      
      if (payment) {
        widget.style.display = "flex";
        studentSpan.textContent = payment.userEmail;
        amountSpan.textContent = `₹${payment.amount}`;
        idSpan.textContent = payment.id;
        txCode.textContent = txId || "Not found in email";

        const statusClass = `badge-${payment.status.replace(/\s+/g, '-')}`;
        badge.className = `feed-item-badge ${statusClass}`;
        badge.textContent = payment.status.toUpperCase();

        const actionsDiv = approveBtn.parentElement;
        if (payment.status === "review") {
          actionsDiv.style.display = "flex";
        } else {
          actionsDiv.style.display = "none";
        }

        approveBtn.onclick = async () => {
          if (confirm(`Approve payment of ₹${payment.amount} for invoice #${payment.id}?`)) {
            payment.status = "paid";
            payment.utr = txId || "EMAIL_VERIFIED";
            payment.paymentDate = new Date().toISOString().split('T')[0];
            
            const appointments = JSON.parse(localStorage.getItem("qy_appointments") || "[]");
            const apptIdx = appointments.findIndex(a => a.id === payment.appointmentId);
            if (apptIdx > -1) {
              appointments[apptIdx].status = "Scheduled";
              localStorage.setItem("qy_appointments", JSON.stringify(appointments));
            }

            savePayments(payments);
            
            try {
              await sendTransactionalEmail("payment-approved", {
                invoiceId: payment.id,
                amount: payment.amount,
                utr: payment.utr,
                paymentDate: payment.paymentDate
              }, payment.userEmail);
              alert("Payment approved, recorded, and confirmation email sent!");
            } catch (err) {
              console.error("Failed to send payment approval email:", err);
              alert(`Payment approved and recorded, but email failed to send: ${err.message || err}`);
            }

            badge.className = `feed-item-badge badge-paid`;
            badge.textContent = "PAID";
            actionsDiv.style.display = "none";
            renderAdminPayments();
            renderAdminOverview();
            renderClientBillingHistory();
          }
        };

        declineBtn.onclick = async () => {
          if (confirm(`Decline/Reject this payment verification? This returns the invoice #${payment.id} to Pending.`)) {
            payment.status = "pending";
            delete payment.utr;
            savePayments(payments);
            
            try {
              await sendTransactionalEmail("payment-declined", {
                invoiceId: payment.id,
                amount: payment.amount
              }, payment.userEmail);
              alert("Verification declined, payment returned to pending, and notification email sent!");
            } catch (err) {
              console.error("Failed to send payment decline email:", err);
              alert(`Verification declined, but notification email failed to send: ${err.message || err}`);
            }

            badge.className = `feed-item-badge badge-pending`;
            badge.textContent = "PENDING";
            actionsDiv.style.display = "none";
            renderAdminPayments();
            renderAdminOverview();
            renderClientBillingHistory();
          }
        };
      } else {
        widget.style.display = "none";
      }
    } else if (widget) {
      widget.style.display = "none";
    }

    // Mark as read
    if (!email.isRead) {
      await emailMarkAsRead(emailId);
      renderAdminInbox();
    }
  }

  /**
   * Updates the unread count badge on the admin Email tab button (Task 6.7).
   */
  function updateAdminUnreadBadge() {
    const emails = loadEmails();
    const gs = loadGmailSettings();
    const connectedEmail = (gs.connectedEmail || "admin@quantumyoga.xyz").toLowerCase();

    const unread = emails.filter(e => {
      const isUnreadIncoming = !e.isRead && (e.folder === "inbox" || e.direction === "received");
      const isToAdmin = (e.to || "").toLowerCase().includes(connectedEmail) || (e.to || "").toLowerCase().includes("admin@quantumyoga.xyz");
      const isFromAdmin = (e.from || "").toLowerCase().includes(connectedEmail) || (e.from || "").toLowerCase().includes("admin@quantumyoga.xyz");
      return isUnreadIncoming && isToAdmin && !isFromAdmin;
    }).length;

    if (adminUnreadCount) adminUnreadCount.textContent = `${unread} unread`;
    if (adminEmailTabBtn) {
      const badge = adminEmailTabBtn.querySelector(".email-tab-badge");
      if (unread > 0) {
        if (!badge) {
          const b = document.createElement("span");
          b.className = "email-tab-badge";
          b.style.cssText = "background:#a78bfa;color:#111;border-radius:9999px;padding:0 5px;font-size:0.65rem;font-weight:700;margin-left:5px;";
          b.textContent = unread;
          adminEmailTabBtn.appendChild(b);
        } else {
          badge.textContent = unread;
        }
      } else if (badge) {
        badge.remove();
      }
    }
  }

  /**
   * Helper to escape HTML special characters.
   */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ==========================================================================
  // Student Email Controller (Tasks 8.x)
  // ==========================================================================

  /**
   * Renders the student email panel (Task 8.7).
   */
  function renderStudentEmailTab() {
    const es = loadGmailSettings();
    const isResend = es.provider === "resend";
    const resendConfigured = !!(es.resendApiKey);
    const gmailConnected = isGmailConnected();
    const emailServiceAvailable = gmailConnected || (isResend && resendConfigured);

    if (!emailServiceAvailable) {
      // Task 8.5 — show informational state
      if (studentInboxEmailList) {
        studentInboxEmailList.innerHTML = `
          <div style="text-align:center;padding:2rem;color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:0.75rem;">📭</div>
            <p style="font-weight:600;color:var(--text-secondary);">Email unavailable</p>
            <p style="font-size:0.8rem;margin-top:0.35rem;">Email feature is not currently enabled. Please contact your studio admin.</p>
          </div>
        `;
      }
      if (studentComposeEmailForm) {
        studentComposeEmailForm.style.opacity = "0.4";
        studentComposeEmailForm.style.pointerEvents = "none";
      }
      return;
    }

    if (studentComposeEmailForm) {
      studentComposeEmailForm.style.opacity = "1";
      studentComposeEmailForm.style.pointerEvents = "auto";
    }

    if (isResend) {
      // Show Resend inbox notice style for student inbox
      if (studentInboxEmailList) {
        studentInboxEmailList.innerHTML = `
          <div style="text-align:center;padding:2rem;color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:0.75rem;">✉️</div>
            <p style="font-weight:600;color:var(--text-secondary);">Inbox Unavailable</p>
            <p style="font-size:0.8rem;margin-top:0.35rem;">Inbox is not available with the Resend provider (send-only). Switch to Gmail in Settings to view inbox.</p>
          </div>
        `;
      }
      // Remove unread badge if any
      const badge = profileEmailTabBtn ? profileEmailTabBtn.querySelector(".email-tab-badge") : null;
      if (badge) badge.remove();
    } else {
      renderStudentInbox();
      updateStudentUnreadBadge();
    }
  }

  /**
   * Renders the student inbox list (Task 8.1) — messages directed to the current user.
   */
  function renderStudentInbox() {
    if (!studentInboxEmailList || !state.currentUser) return;
    const emails = loadEmails();
    const userEmail = state.currentUser.email;

    const list = emails
      .filter(e => {
        const toField = (e.to || "").toLowerCase();
        return toField.includes(userEmail.toLowerCase()) && (e.folder === "inbox" || e.direction === "received");
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (list.length === 0) {
      studentInboxEmailList.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:2rem 0;">No messages from the studio yet.</p>`;
      return;
    }

    studentInboxEmailList.innerHTML = "";
    list.forEach(email => {
      const item = document.createElement("div");
      item.className = `email-list-item${email.isRead ? "" : " unread"}`;
      item.innerHTML = `
        <div class="${email.isRead ? "email-read-dot" : "email-unread-dot"}"></div>
        <div class="email-content">
          <div class="email-sender">${escapeHtml(email.from || "Quantum Yoga Studio")}</div>
          <div class="email-subject">${escapeHtml(email.subject || "(No Subject)")}</div>
          <div class="email-snippet">${escapeHtml(email.snippet || "")}</div>
        </div>
        <div class="email-meta-right">
          <span class="email-date">${formatEmailDate(email.date)}</span>
        </div>
      `;
      item.addEventListener("click", async () => {
        if (!email.isRead) {
          await emailMarkAsRead(email.id);
          renderStudentInbox();
          updateStudentUnreadBadge();
        }
        // Show snippet below item as a simple detail view
        const existing = item.querySelector(".email-detail-expand");
        if (existing) { existing.remove(); return; }
        const detail = document.createElement("div");
        detail.className = "email-detail-expand";
        detail.style.cssText = "margin-top:0.5rem;padding:0.75rem;background:rgba(0,0,0,0.2);border-radius:8px;font-size:0.82rem;color:var(--text-secondary);line-height:1.6;";
        detail.textContent = email.snippet || "Loading…";
        item.appendChild(detail);
        // Attempt to load full body
        const body = await emailGetMessageBody(email.id);
        if (body) {
          if (body.trim().startsWith("<")) {
            detail.innerHTML = body;
          } else {
            detail.textContent = body;
          }
        }
      });
      studentInboxEmailList.appendChild(item);
    });
  }

  /**
   * Updates the student unread badge (Task 8.6).
   */
  function updateStudentUnreadBadge() {
    if (!state.currentUser) return;
    const emails = loadEmails();
    const userEmail = state.currentUser.email;
    const unread = emails.filter(e =>
      !e.isRead &&
      (e.to || "").toLowerCase().includes(userEmail.toLowerCase()) &&
      (e.folder === "inbox" || e.direction === "received")
    ).length;

    if (studentUnreadCount) studentUnreadCount.textContent = `${unread} unread`;
    if (profileEmailTabBtn) {
      const badge = profileEmailTabBtn.querySelector(".email-tab-badge");
      if (unread > 0) {
        if (!badge) {
          const b = document.createElement("span");
          b.className = "email-tab-badge";
          b.style.cssText = "background:#a78bfa;color:#111;border-radius:9999px;padding:0 5px;font-size:0.65rem;font-weight:700;margin-left:5px;";
          b.textContent = unread;
          profileEmailTabBtn.appendChild(b);
        } else {
          badge.textContent = unread;
        }
      } else if (badge) {
        badge.remove();
      }
    }
  }

  // ==========================================================================
  // Email Event Listener Bindings (Tasks 6.3–6.8, 8.4)
  // ==========================================================================

  // Close preview
  if (adminCloseEmailPreview) {
    adminCloseEmailPreview.addEventListener("click", (e) => {
      e.stopPropagation();
      if (adminEmailPreviewOverlay) adminEmailPreviewOverlay.style.display = "none";
      currentPreviewEmail = null;
    });
  }
  if (adminEmailPreviewOverlay) {
    adminEmailPreviewOverlay.addEventListener("click", (e) => {
      if (e.target === adminEmailPreviewOverlay) {
        adminEmailPreviewOverlay.style.display = "none";
        currentPreviewEmail = null;
      }
    });
  }

  // Reply button — pre-fill compose form (Task 6.6)
  if (adminPreviewReplyBtn) {
    adminPreviewReplyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentPreviewEmail) return;
      if (adminEmailPreviewOverlay) adminEmailPreviewOverlay.style.display = "none";
      if (adminEmailTo) {
        const fromAddr = currentPreviewEmail.from || "";
        const emailMatch = fromAddr.match(/<([^>]+)>/);
        adminEmailTo.value = emailMatch ? emailMatch[1] : fromAddr;
      }
      if (adminEmailSubject) adminEmailSubject.value = `Re: ${currentPreviewEmail.subject || ""}`;
      if (adminEmailBody) adminEmailBody.focus();
      currentPreviewEmail = null;
    });
  }

  // Inbox filter buttons
  document.querySelectorAll(".email-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".email-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderAdminInbox(btn.dataset.filter);
    });
  });

  // Gmail connect button (Task 6.4 style / 4.3)
  if (adminGmailConnectBtn) {
    adminGmailConnectBtn.addEventListener("click", () => {
      adminGmailConnectBtn.textContent = "Connecting…";
      adminGmailConnectBtn.disabled = true;
      connectGmail((success, email) => {
        adminGmailConnectBtn.disabled = false;
        adminGmailConnectBtn.textContent = "Connect Gmail";
        if (success) {
          updateGmailStatusUI();
          refreshEmailCache().then(() => renderAdminEmailTab());
        } else {
          alert("Could not connect to Gmail. Make sure your Client ID is set in Settings and try again.");
        }
      });
    });
  }

  // Gmail disconnect button (Task 4.4)
  if (adminGmailDisconnectBtn) {
    adminGmailDisconnectBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to disconnect Gmail? This will clear the local email cache.")) {
        disconnectGmail();
        renderAdminEmailTab();
      }
    });
  }

  // Gmail refresh button (Task 6.3)
  if (adminGmailRefreshBtn) {
    adminGmailRefreshBtn.addEventListener("click", async () => {
      adminGmailRefreshBtn.textContent = "Refreshing…";
      adminGmailRefreshBtn.disabled = true;
      await refreshEmailCache();
      renderAdminEmailTab();
      adminGmailRefreshBtn.textContent = "🔄 Refresh";
      adminGmailRefreshBtn.disabled = false;
    });
  }

  // Admin compose email form submit (Task 6.5)
  if (adminComposeEmailForm) {
    adminComposeEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const to = adminEmailTo ? adminEmailTo.value.trim() : "";
      const subject = adminEmailSubject ? adminEmailSubject.value.trim() : "";
      const bodyText = adminEmailBody ? adminEmailBody.value.trim() : "";
      const template = adminEmailTemplate ? adminEmailTemplate.value : "custom";

      if (!to || !subject) return;

      // Task 6.1/6.2 — provider-aware pre-flight check
      const es = loadGmailSettings();
      const provider = es.provider || "resend";
      if (provider === "resend") {
      // We proceed with sending, since the server will fall back to environment variables if the client key is empty
      } else {
        if (!isGmailConnected()) {
          if (adminEmailSendMsg) {
            adminEmailSendMsg.style.display = "block";
            adminEmailSendMsg.style.color = "#ef4444";
            adminEmailSendMsg.textContent = "Gmail not connected. Go to System Settings to connect.";
            setTimeout(() => { adminEmailSendMsg.style.display = "none"; }, 4000);
          }
          return;
        }
      }

      let bodyHtml = "";
      if (template !== "custom") {
        // Build transactional HTML body
        const users = JSON.parse(localStorage.getItem("qy_users") || "[]");
        const recipient = users.find(u => u.email === to);
        bodyHtml = buildTransactionalEmailBody(template, {
          name: recipient ? recipient.name : to,
          email: to,
          to,
          message: bodyText
        });
      } else {
        bodyHtml = `<div style="font-family:sans-serif;color:#333;line-height:1.6;">${bodyText.replace(/\n/g, "<br>")}</div>`;
      }

      const sendBtn = adminComposeEmailForm.querySelector("button[type=submit]");
      if (sendBtn) { sendBtn.textContent = "Sending…"; sendBtn.disabled = true; }

      // Task 6.1 — route to correct provider
      const result = provider === "resend"
        ? await resendSendEmail({ to, subject, bodyHtml, bodyText })
        : await gmailSendEmail({ to, subject, bodyHtml, bodyText });

      if (sendBtn) { sendBtn.textContent = "Send Email"; sendBtn.disabled = false; }

      if (adminEmailSendMsg) {
        adminEmailSendMsg.style.display = "block";
        if (result.success) {
          adminEmailSendMsg.style.color = "#10b981";
          adminEmailSendMsg.textContent = "✓ Email sent successfully!";
          adminComposeEmailForm.reset();
          renderAdminSentList();
        } else {
          adminEmailSendMsg.style.color = "#ef4444";
          adminEmailSendMsg.textContent = `Failed: ${result.error || "Unknown error"}`;
        }
        setTimeout(() => { adminEmailSendMsg.style.display = "none"; }, 5000);
      }
    });
  }

  // Gmail Settings form — save Client ID (Task 4.2)
  if (adminGmailSettingsForm) {
    adminGmailSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const clientId = adminGmailClientIdInput ? adminGmailClientIdInput.value.trim() : "";
      if (!clientId) return;
      const gs = loadGmailSettings();
      gs.clientId = clientId;
      saveGmailSettings(gs);
      if (adminGmailSettingsSuccessMsg) {
        adminGmailSettingsSuccessMsg.style.display = "block";
        setTimeout(() => { adminGmailSettingsSuccessMsg.style.display = "none"; }, 3000);
      }
      updateEmailProviderStatusUI();
    });
  }

  // Task 4.3 — Switch to Gmail provider
  if (emailProviderGmailBtn) {
    emailProviderGmailBtn.addEventListener("click", () => {
      const gs = loadGmailSettings();
      gs.provider = "gmail";
      saveGmailSettings(gs);
      renderEmailProviderSettings();
      updateEmailProviderStatusUI();
    });
  }

  // Task 4.4 — Switch to Resend provider
  if (emailProviderResendBtn) {
    emailProviderResendBtn.addEventListener("click", () => {
      const gs = loadGmailSettings();
      gs.provider = "resend";
      saveGmailSettings(gs);
      renderEmailProviderSettings();
      updateEmailProviderStatusUI();
    });
  }

  // Task 4.5 — Save Resend API key + from-address
  if (resendSettingsSaveBtn) {
    resendSettingsSaveBtn.addEventListener("click", () => {
      const apiKey = resendApiKeyInput ? resendApiKeyInput.value.trim() : "";
      const fromAddr = resendFromAddressInput ? resendFromAddressInput.value.trim() : "";
      if (!apiKey) {
        if (resendSettingsMsg) {
          resendSettingsMsg.textContent = "API key is required.";
          resendSettingsMsg.style.color = "#ef4444";
          resendSettingsMsg.style.display = "inline";
          setTimeout(() => { resendSettingsMsg.style.display = "none"; }, 3000);
        }
        return;
      }
      const gs = loadGmailSettings();
      gs.resendApiKey = apiKey;
      gs.resendFromAddress = fromAddr;
      saveGmailSettings(gs);
      if (resendSettingsMsg) {
        resendSettingsMsg.textContent = "Resend settings saved ✓";
        resendSettingsMsg.style.color = "#10B981";
        resendSettingsMsg.style.display = "inline";
        setTimeout(() => { resendSettingsMsg.style.display = "none"; }, 3000);
      }
      updateEmailProviderStatusUI();
    });
  }

  // Student compose form submit (Task 8.4)
  if (studentComposeEmailForm) {
    studentComposeEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const es = loadGmailSettings();
      const isResend = es.provider === "resend";
      const resendConfigured = !!(es.resendApiKey);
      const gmailConnected = isGmailConnected();

      if (!(gmailConnected || (isResend && resendConfigured)) || !state.currentUser) return;

      let adminEmail = "";
      if (isResend) {
        adminEmail = "admin@quantumyoga.xyz";
      } else {
        adminEmail = es.connectedEmail || "admin@quantumyoga.xyz";
      }
      if (!adminEmail) return;

      const subject = studentEmailSubject ? studentEmailSubject.value.trim() : "";
      const bodyText = studentEmailBody ? studentEmailBody.value.trim() : "";
      if (!subject || !bodyText) return;

      const bodyHtml = `<div style="font-family:sans-serif;color:#333;line-height:1.6;">
        <p><strong>From:</strong> ${state.currentUser.name} (${state.currentUser.email})</p>
        <hr style="border:none;border-top:1px solid #eee;margin:1rem 0;">
        ${bodyText.replace(/\n/g, "<br>")}
      </div>`;

      const sendBtn = studentComposeEmailForm.querySelector("button[type=submit]");
      if (sendBtn) { sendBtn.textContent = "Sending…"; sendBtn.disabled = true; }

      const result = isResend
        ? await resendSendEmail({ to: adminEmail, subject, bodyHtml, bodyText })
        : await gmailSendEmail({ to: adminEmail, subject, bodyHtml, bodyText });

      if (sendBtn) { sendBtn.textContent = "Send Message"; sendBtn.disabled = false; }
      if (studentEmailSendMsg) {
        studentEmailSendMsg.style.display = "block";
        if (result.success) {
          // Save a copy in local inbox for the admin to see
          const emails = loadEmails();
          emails.push({
            id: "local-inbox-" + Date.now(),
            from: `${state.currentUser.name} <${state.currentUser.email}>`,
            to: adminEmail,
            subject: subject,
            date: new Date().toUTCString(),
            snippet: bodyText.slice(0, 100),
            bodyHtml: bodyHtml,
            bodyText: bodyText,
            isRead: false,
            folder: "inbox",
            direction: "received",
            labelIds: ["UNREAD", "INBOX"]
          });
          saveEmails(emails);

          studentEmailSendMsg.style.color = "#10b981";
          studentEmailSendMsg.textContent = "✓ Message sent to the studio!";
          studentComposeEmailForm.reset();
        } else {
          studentEmailSendMsg.style.color = "#ef4444";
          studentEmailSendMsg.textContent = `Failed: ${result.error || "Unknown error"}`;
        }
        setTimeout(() => { studentEmailSendMsg.style.display = "none"; }, 5000);
      }
    });
  }

  // Template auto-populate hint for admin compose
  if (adminEmailTemplate) {
    adminEmailTemplate.addEventListener("change", () => {
      const tpl = adminEmailTemplate.value;
      if (tpl === "welcome") {
        if (adminEmailSubject) adminEmailSubject.value = "Welcome to Quantum Yoga! 🙏";
        if (adminEmailBody) adminEmailBody.value = "";
      } else if (tpl === "invoice") {
        if (adminEmailSubject) adminEmailSubject.value = "Invoice from Quantum Yoga 💳";
        if (adminEmailBody) adminEmailBody.value = "";
      } else if (tpl === "reminder") {
        if (adminEmailSubject) adminEmailSubject.value = "Payment Reminder — Quantum Yoga ⚠️";
        if (adminEmailBody) adminEmailBody.value = "";
      } else if (tpl === "appointment") {
        if (adminEmailSubject) adminEmailSubject.value = "Appointment Confirmation 🗓️";
        if (adminEmailBody) adminEmailBody.value = "";
      }
    });
  }

  // Init Gmail status UI on page load (Task 4.5 / 10.1)
  updateGmailStatusUI();

  // ==========================================================================
  // Transactional Email Helpers (Task 9.x)
  // ==========================================================================

  /**
   * Sends a transactional email if Gmail is connected. Shows a console note otherwise.
   */
  async function sendTransactionalEmail(template, data, toEmail) {
    const es = loadGmailSettings();
    const provider = es.provider || "resend";
    const gmailConnected = isGmailConnected();
    const resendConfigured = true; // Always attempt Resend, falling back to server environment variables if needed

    const users = JSON.parse(localStorage.getItem("qy_users") || "[]");
    const recipient = users.find(u => u.email === toEmail);
    const bodyHtml = buildTransactionalEmailBody(template, {
      ...data,
      name: recipient ? recipient.name : toEmail,
      to: toEmail,
      email: toEmail
    });
    const subjects = {
      welcome: "Welcome to Quantum Yoga! 🙏",
      invoice: `Invoice #${data.invoiceId || ""} from Quantum Yoga`,
      reminder: `Payment Reminder — Invoice #${data.invoiceId || ""}`,
      appointment: `Appointment ${data.action || "Confirmation"} — Quantum Yoga`,
      "inquiry-received": "Thank you for your inquiry — Quantum Yoga",    // Task 2.1
      "lead-converted": "Welcome to Quantum Yoga — Your Account is Ready 🧘", // Task 2.2
      "payment-approved": `Payment Approved & Confirmed — Invoice #${data.invoiceId || ""}`,
      "payment-declined": `Payment Verification Update — Invoice #${data.invoiceId || ""}`,
      "refunded": `Refund Processed — Invoice #${data.invoiceId || ""}`,
      "payment-under-review": `Payment Under Review — Invoice #${data.invoiceId || ""}`
    };
    
    const subject = subjects[template] || "Message from Quantum Yoga";
    const bodyText = data.message || "";
    const payload = {
      to: toEmail,
      subject: subject,
      bodyHtml,
      bodyText: bodyText
    };

    // Attempt real delivery if configured
    let sentSuccess = false;
    let errorMsg = "";
    if (provider === "resend" && resendConfigured) {
      const res = await resendSendEmail(payload);
      if (res.success) {
        sentSuccess = true;
      } else {
        errorMsg = res.error || "Unknown Resend error";
      }
    } else if (provider === "gmail" && gmailConnected) {
      const res = await gmailSendEmail(payload);
      if (res.success) {
        sentSuccess = true;
      } else {
        errorMsg = res.error || "Unknown Gmail error";
      }
    }

    if ((provider === "resend" && resendConfigured && !sentSuccess) || 
        (provider === "gmail" && gmailConnected && !sentSuccess)) {
      throw new Error(errorMsg || "Email delivery failed");
    }

    // Always simulate local routing in mock DB for both inbox (recipient) and outbox (sender copy)
    const emails = loadEmails();
    
    // 1. Recipient Copy (received inbox message for the student)
    emails.push({
      id: "local-txn-inbox-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      from: "Quantum Yoga Studio <admin@quantumyoga.xyz>",
      to: toEmail,
      subject: subject,
      date: new Date().toUTCString(),
      snippet: (bodyText || bodyHtml).replace(/<[^>]*>/g, "").slice(0, 100),
      bodyHtml: bodyHtml,
      bodyText: bodyText,
      isRead: false,
      folder: "inbox",
      direction: "received",
      labelIds: ["UNREAD", "INBOX"]
    });

    // 2. Sender Copy (sent message for admin's Sent folder)
    if (!sentSuccess || provider === "resend") {
      emails.push({
        id: "local-txn-sent-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        from: es.connectedEmail || "admin@quantumyoga.xyz",
        to: toEmail,
        subject: subject,
        date: new Date().toUTCString(),
        snippet: (bodyText || bodyHtml).replace(/<[^>]*>/g, "").slice(0, 100),
        bodyHtml: bodyHtml,
        bodyText: bodyText,
        isRead: true,
        folder: "sent",
        direction: "sent",
        labelIds: ["SENT"]
      });
    }

    saveEmails(emails);

    // Automatically send WhatsApp notification alongside payment/reminder emails
    try {
      if (template === "payment-approved") {
        await sendWhatsAppNotification("payment-approved", {
          message: `Hi {{name}}, your payment of ₹${data.amount || ""} (UTR: ${data.utr || "N/A"}) for Invoice #${data.invoiceId || ""} has been approved and confirmed. Thank you!`
        }, toEmail);
      } else if (template === "payment-declined") {
        await sendWhatsAppNotification("payment-declined", {
          message: `Hello {{name}}, your payment verification request for Invoice #${data.invoiceId || ""} has been declined. Please log in and check your transaction details.`
        }, toEmail);
      } else if (template === "refunded") {
        await sendWhatsAppNotification("refunded", {
          message: `Hi {{name}}, your refund of ₹${data.amount || ""} for Invoice #${data.invoiceId || ""} has been processed successfully. Date: ${data.refundDate || ""}.`
        }, toEmail);
      } else if (template === "reminder") {
        await sendWhatsAppNotification("invoice", data, toEmail);
      } else if (template === "payment-under-review") {
        await sendWhatsAppNotification("payment-under-review", {
          message: `Hi {{name}}, we have received your payment reference (UTR: ${data.utr || "N/A"}) for Invoice #${data.invoiceId || ""} (₹${data.amount || ""}). Your payment status is now Under Review while we verify the transaction.`
        }, toEmail);
      }
    } catch (wErr) {
      console.error("[WhatsApp Auto-Send Error]", wErr);
    }
  }

  async function sendWhatsAppNotification(type, data, userEmail) {
    const rawSettings = localStorage.getItem(STORAGE_KEY_WHATSAPP_SETTINGS);
    if (!rawSettings) return;
    let settings;
    try {
      settings = JSON.parse(rawSettings);
    } catch (e) {
      return;
    }
    if (!settings || !settings.enabled) return;

    // Fetch user or lead detail to get name & phone number
    const users = JSON.parse(localStorage.getItem("qy_users") || "[]");
    let recipient = users.find(u => u.email === userEmail);
    if (!recipient) {
      // Check leads
      const leads = JSON.parse(localStorage.getItem("qy_leads") || "[]");
      recipient = leads.find(l => l.email === userEmail);
    }

    const phone = recipient ? recipient.phone : null;
    if (!phone) {
      console.log(`[WhatsApp Trigger] No phone number found for ${userEmail}. Skipping.`);
      return;
    }

    const name = recipient ? recipient.name : (userEmail || "Student");

    // Build the message body using templates
    let templateText = "";
    if (type === "booking") {
      templateText = settings.templates?.booking || "Hi {{name}}, your private coaching for {{routine}} is confirmed for {{date}} at {{time}}. Session Fee: ₹{{amount}}. Pay via UPI VPA: {{upiVpa}} ({{upiName}}) or tap here: {{upiLink}}";
    } else if (type === "invoice") {
      templateText = settings.templates?.invoice || "Hello {{name}}, a new invoice {{invoiceId}} for ₹{{amount}} is due on {{dueDate}}. Pay via UPI VPA: {{upiVpa}} ({{upiName}}) or tap here: {{upiLink}}";
    } else if (type === "welcome") {
      templateText = settings.templates?.welcome || "Hello {{name}}, welcome to Quantum Yoga! Your temporary password is {{tempPass}}.";
    } else {
      templateText = data.message || "";
    }

    const upi = loadUpiSettings();
    const upiVpa = upi ? upi.vpa : "quantumyoga@upi";
    const upiName = upi ? upi.name : "Quantum Yoga Studio";
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiName)}&am=${encodeURIComponent(data.amount || "")}&tn=${encodeURIComponent("Invoice: " + (data.invoiceId || ""))}`;

    // Replace templates placeholders
    let message = templateText
      .replace(/{{name}}/g, name)
      .replace(/{{routine}}/g, data.routine || "")
      .replace(/{{date}}/g, data.date || "")
      .replace(/{{time}}/g, data.time || "")
      .replace(/{{invoiceId}}/g, data.invoiceId || "")
      .replace(/{{amount}}/g, data.amount || "")
      .replace(/{{dueDate}}/g, data.dueDate || "")
      .replace(/{{tempPass}}/g, data.tempPass || "")
      .replace(/{{upiVpa}}/g, upiVpa)
      .replace(/{{upiName}}/g, upiName)
      .replace(/{{upiLink}}/g, upiLink)
      .replace(/{{link}}/g, window.location.origin + "/#profile-section");

    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: phone, message })
      });
      const result = await response.json();
      console.log("[WhatsApp Dispatch Result]", result);
    } catch (err) {
      console.error("[WhatsApp Trigger Error]", err);
    }
  }

  function getWhatsAppLink(phone, name = "") {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");
    if (clean.length === 10) {
      clean = "91" + clean;
    }
    const text = encodeURIComponent(`Hello ${name}, warm greetings from Quantum Yoga!`);
    return `https://wa.me/${clean}?text=${text}`;
  }

  function format12HourTime(time24) {
    if (!time24) return "";
    const [hoursStr, minutesStr] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${minutesStr} ${ampm}`;
  }

  // Render Admin Batches panel
  function renderAdminBatches() {
    if (!adminBatchesTableBody) return;
    adminBatchesTableBody.innerHTML = "";
    
    const batches = loadBatches();
    
    // Clear and populate batch scheduling select
    if (adminScheduleBatchSelect) {
      const currentVal = adminScheduleBatchSelect.value;
      adminScheduleBatchSelect.innerHTML = `<option value="">Choose a Batch...</option>`;
      batches.forEach(b => {
        const option = document.createElement("option");
        option.value = b.id;
        option.textContent = b.name;
        adminScheduleBatchSelect.appendChild(option);
      });
      adminScheduleBatchSelect.value = currentVal;
    }
    
    // Populate routine select if empty
    if (adminScheduleRoutineSelect && adminScheduleRoutineSelect.children.length <= 1) {
      adminScheduleRoutineSelect.innerHTML = `<option value="">Select Routine...</option>`;
      YOGA_ROUTINES.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        adminScheduleRoutineSelect.appendChild(option);
      });
    }
    
    if (batches.length === 0) {
      adminBatchesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">
            No batches defined yet. Use the form on the left to create one.
          </td>
        </tr>
      `;
      return;
    }
    
    batches.forEach(b => {
      let timetableHTML = "";
      if (b.timetable && b.timetable.length > 0) {
        timetableHTML = b.timetable.map(slot => {
          return `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
            <strong>${slot.day}</strong> at ${slot.time} (${slot.routineName || "Yoga Flow"})
          </div>`;
        }).join("");
      } else {
        timetableHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">No sessions scheduled.</span>`;
      }

      const feeDisplay = (b.sessionFee && b.sessionFee > 0)
        ? `<span style="font-weight: 700; color: var(--accent-primary);">\u20b9${b.sessionFee}</span>`
        : `<span style="font-size: 0.8rem; color: var(--text-muted);">\u20b90 &mdash; not set</span>`;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${b.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${b.id}</div>
        </td>
        <td style="color: var(--text-secondary);">${b.instructor || "Master Coach"}</td>
        <td>${timetableHTML}</td>
        <td>${feeDisplay}</td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm delete-batch-btn" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;" data-id="${b.id}">Delete</button>
        </td>
      `;
      adminBatchesTableBody.appendChild(tr);
    });
    
    // Add event listeners to delete buttons
    const deleteBtns = adminBatchesTableBody.querySelectorAll(".delete-batch-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const batchId = btn.getAttribute("data-id");
        deleteBatch(batchId);
      });
    });
  }

  // Delete Batch
  function deleteBatch(batchId) {
    if (confirm("Are you sure you want to delete this batch cohort? This will remove all students currently enrolled in this batch and delete all class timetables associated with it.")) {
      let batches = loadBatches();
      batches = batches.filter(b => b.id !== batchId);
      saveBatches(batches);
      
      // Clear user associations
      const users = loadUsers();
      users.forEach(u => {
        if (u.batchId === batchId) {
          u.batchId = null;
        }
      });
      saveUsers(users);
      
      // Update state.currentUser if affected
      if (state.currentUser && state.currentUser.batchId === batchId) {
        state.currentUser.batchId = null;
        updateUIForLogin();
      }

      renderAdminBatches();
      renderAdminOverview();
    }
  }

  // Load and render admin panel
  function renderAdminDashboard() {
    setAdminSubTab("overview");
  }

  // Render User Management Table
  function renderAdminUsersTable() {
    adminUsersTableBody.innerHTML = "";
    const users = loadUsers();
    const batches = loadBatches();
    
    // Filter out the active admin account to prevent self-deletion
    const regularUsers = users.filter(u => u.email !== "admin@quantumyoga.xyz");

    // Search and filter logic
    const searchInput = document.getElementById("admin-users-search-input");
    const tierFilter = document.getElementById("admin-users-tier-filter");
    const statusFilter = document.getElementById("admin-users-status-filter");
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const tierVal = tierFilter ? tierFilter.value : "all";
    const statusVal = statusFilter ? statusFilter.value : "all";

    const filteredUsers = regularUsers.filter(u => {
      const matchesSearch = !searchVal || 
        (u.name && u.name.toLowerCase().includes(searchVal)) || 
        (u.email && u.email.toLowerCase().includes(searchVal));

      const uTier = (u.membership && u.membership.tier) || "Basic";
      const matchesTier = tierVal === "all" || 
        (tierVal === "VIP" && uTier.includes("VIP")) || 
        uTier.toLowerCase() === tierVal.toLowerCase();

      const uStatus = (u.membership && u.membership.status) || "Active";
      const matchesStatus = statusVal === "all" || uStatus.toLowerCase() === statusVal.toLowerCase();

      return matchesSearch && matchesTier && matchesStatus;
    });
    
    if (filteredUsers.length === 0) {
      adminUsersTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">
            No users match the search query or filters.
          </td>
        </tr>
      `;
      return;
    }
    
    filteredUsers.forEach(user => {
      const row = document.createElement("tr");
      
      const favCount = user.favorites ? user.favorites.length : 0;
      const compCount = user.routineHistory ? user.routineHistory.length : 0;
      
      const safeName = (user.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      const safeEmail = (user.email || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

      // Batch + fee display
      let batchDisplay = "\u2014";
      if (user.batchId) {
        const userBatch = batches.find(b => b.id === user.batchId);
        if (userBatch) {
          const fee = userBatch.sessionFee && userBatch.sessionFee > 0 ? `\u20b9${userBatch.sessionFee}/session` : "\u20b90";
          batchDisplay = `<span style="font-size:0.85rem;color:var(--text-primary);font-weight:500;">${userBatch.name}</span><br><span style="font-size:0.75rem;color:var(--text-muted);">${fee}</span>`;
        } else {
          batchDisplay = `<span style="font-size:0.8rem;color:var(--text-muted);">Unknown batch</span>`;
        }
      }

      row.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="background: rgba(167, 139, 250, 0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 1rem; border: 1px solid rgba(167, 139, 250, 0.2);">\uD83E\uDDD8</div>
            <span style="font-weight: 500;">${safeName}</span>
          </div>
        </td>
        <td><span style="color: var(--text-secondary); font-size: 0.9rem;">${safeEmail}</span></td>
        <td><span class="badge badge-category" style="font-size: 0.75rem; border-color: rgba(167, 139, 250, 0.25); color: var(--accent-primary);">${favCount} Poses</span></td>
        <td><span class="badge badge-category" style="font-size: 0.75rem; border-color: rgba(244, 63, 94, 0.25); color: var(--accent-secondary);">${compCount} Routines</span></td>
        <td>${batchDisplay}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
            ${user.phone ? `<a href="${getWhatsAppLink(user.phone, safeName)}" target="_blank" class="btn btn-secondary btn-sm" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; text-decoration: none;" title="Chat on WhatsApp">💬</a>` : ""}
            <button class="btn btn-secondary btn-sm inspect-user-btn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">View Profile</button>
            <button class="btn btn-primary btn-sm delete-user-btn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: rgba(244, 63, 94, 0.1); border-color: rgba(244, 63, 94, 0.3); color: var(--accent-secondary);">Delete</button>
          </div>
        </td>
      `;
      
      row.querySelector(".inspect-user-btn").addEventListener("click", () => {
        openInspectModal(user.email);
      });
      
      row.querySelector(".delete-user-btn").addEventListener("click", () => {
        deleteUser(user.email);
      });
      
      adminUsersTableBody.appendChild(row);
    });
  }

  // Render Leads Management Swimlanes
  function renderLeadsTable() {
    if (!leadsSwimlaneBoard) return;
    leadsSwimlaneBoard.innerHTML = "";
    
    const leads = loadLeads();
    
    // Get search & filter values
    const query = (leadsSearchInput ? leadsSearchInput.value : "").trim().toLowerCase();
    const statusVal = leadsStatusFilter ? leadsStatusFilter.value : "all";
    
    // Standard statuses
    const statuses = ["New", "Contacted", "Converted", "Closed"];
    
    // Determine which columns to show (isolates column if a single filter is selected)
    const visibleStatuses = statusVal === "all" ? statuses : [statusVal];
    
    // Filter leads matching search query
    const filteredLeads = leads.filter(lead => {
      return !query || 
        (lead.name || "").toLowerCase().includes(query) || 
        (lead.email || "").toLowerCase().includes(query) || 
        (lead.message || "").toLowerCase().includes(query);
    });
    
    // Render columns
    visibleStatuses.forEach(status => {
      const statusLeads = filteredLeads.filter(l => (l.status || "New") === status);
      
      // Sort chronologically by date descending (newest first)
      statusLeads.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      
      const col = document.createElement("div");
      col.className = "swimlane-column";
      col.setAttribute("data-status", status);
      
      const header = document.createElement("div");
      header.className = "swimlane-header";
      header.innerHTML = `
        <h3>${status}</h3>
        <span class="swimlane-count">${statusLeads.length}</span>
      `;
      col.appendChild(header);
      
      const cardsContainer = document.createElement("div");
      cardsContainer.className = "swimlane-cards-container";
      
      if (statusLeads.length === 0) {
        cardsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2.5rem 0; font-size: 0.8rem;">No inquiries</p>`;
      } else {
        statusLeads.forEach(lead => {
          const card = document.createElement("div");
          card.className = "lead-card";
          card.setAttribute("data-lead-id", lead.id);
          
          const safeName = (lead.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
          const safeEmail = (lead.email || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
          const safePhone = formatIndianPhone(lead.phone || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
          const safeMsg = (lead.message || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
          
          const statusIdx = statuses.indexOf(status);
          const leftBtn = statusIdx > 0 ? `<button class="lead-move-btn move-left" data-id="${lead.id}" title="Move to ${statuses[statusIdx - 1]}">◀</button>` : "";
          const rightBtn = statusIdx < 3 ? `<button class="lead-move-btn move-right" data-id="${lead.id}" title="Move to ${statuses[statusIdx + 1]}">▶</button>` : "";
          
          card.innerHTML = `
            <div class="lead-card-header">
              <span class="lead-card-name">${safeName}</span>
              <span class="lead-card-date">${formatDateToIndian(lead.date) || "N/A"}</span>
            </div>
            <div class="lead-card-details">
              <span>📧 ${safeEmail}</span>
              <span>📞 ${safePhone} <a href="${getWhatsAppLink(lead.phone, safeName)}" target="_blank" title="Chat on WhatsApp" style="text-decoration:none; margin-left: 0.25rem; font-size: 0.85rem; cursor: pointer;">💬</a></span>
              <p class="lead-card-msg">${safeMsg}</p>
            </div>
            <div class="lead-card-actions">
              <span class="lead-inspect-link inspect-lead-btn" data-id="${lead.id}">Inspect</span>
              <div class="lead-card-move-btns">
                ${leftBtn}
                ${rightBtn}
              </div>
            </div>
          `;
          
          // Move triggers
          const leftBtnEl = card.querySelector(".move-left");
          if (leftBtnEl) {
            leftBtnEl.addEventListener("click", (e) => {
              e.stopPropagation();
              moveLeadStatus(lead.id, statuses[statusIdx - 1]);
            });
          }
          
          const rightBtnEl = card.querySelector(".move-right");
          if (rightBtnEl) {
            rightBtnEl.addEventListener("click", (e) => {
              e.stopPropagation();
              moveLeadStatus(lead.id, statuses[statusIdx + 1]);
            });
          }
          
          // Inspect triggers
          card.querySelector(".inspect-lead-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openInspectLeadModal(lead.id);
          });
          
          card.addEventListener("click", () => {
            openInspectLeadModal(lead.id);
          });
          
          cardsContainer.appendChild(card);
        });
      }
      
      col.appendChild(cardsContainer);
      leadsSwimlaneBoard.appendChild(col);
    });
  }

  // Update lead status and log comment inside LocalStorage
  function moveLeadStatus(leadId, targetStatus) {
    const leads = loadLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx > -1) {
      const oldStatus = leads[idx].status || "New";
      leads[idx].status = targetStatus;
      
      if (!leads[idx].logs) leads[idx].logs = [];
      leads[idx].logs.unshift({
        timestamp: new Date().toLocaleString(),
        note: `Status updated from ${oldStatus} to ${targetStatus} via Kanban controls.`
      });
      
      saveLeads(leads);
      renderLeadsTable();
    }
  }

  // Open Lead Inspection Modal
  function openInspectLeadModal(leadId) {
    inspectedLeadId = leadId;
    const leads = loadLeads();
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) return;
    
    // Populate simple displays
    if (inspectLeadName) inspectLeadName.textContent = lead.name;
    if (inspectLeadEmail) inspectLeadEmail.textContent = lead.email;
    if (inspectLeadPhone) {
      const phoneFormatted = formatIndianPhone(lead.phone || "N/A");
      if (lead.phone) {
        inspectLeadPhone.innerHTML = `Phone: ${phoneFormatted} <a href="${getWhatsAppLink(lead.phone, lead.name)}" target="_blank" title="Chat on WhatsApp" style="text-decoration:none; margin-left: 0.25rem; font-size: 0.95rem; cursor: pointer;">💬</a>`;
      } else {
        inspectLeadPhone.textContent = "Phone: " + phoneFormatted;
      }
    }
    if (inspectLeadDate) inspectLeadDate.textContent = formatDateToIndian(lead.date) || "N/A";
    if (inspectLeadMessage) inspectLeadMessage.textContent = lead.message;
    
    // Status select and badge
    if (inspectLeadStatus) inspectLeadStatus.value = lead.status || "New";
    updateLeadStatusBadgeDisplay(lead.status || "New");
    
    // Enable/disable conversion triggers
    if (convertLeadBtn) {
      if (lead.status === "Converted") {
        convertLeadBtn.style.display = "none";
      } else {
        convertLeadBtn.style.display = "inline-block";
      }
    }
    
    // Clear inputs and notes success message
    if (inspectLeadNoteInput) inspectLeadNoteInput.value = "";
    if (inspectLeadSuccessMsg) inspectLeadSuccessMsg.style.display = "none";
    
    // Render log timeline
    renderLeadLogsTimeline(lead.logs || []);
    
    // Show modal
    if (adminInspectLeadModal) {
      adminInspectLeadModal.style.display = "flex";
      adminInspectLeadModal.classList.add("active");
      adminInspectLeadModal.setAttribute("aria-hidden", "false");
    }
  }

  // Close Lead Inspection Modal
  function closeInspectLeadModal() {
    inspectedLeadId = null;
    if (adminInspectLeadModal) {
      adminInspectLeadModal.style.display = "none";
      adminInspectLeadModal.classList.remove("active");
      adminInspectLeadModal.setAttribute("aria-hidden", "true");
    }
  }

  // Update lead status badge dynamically inside modal
  function updateLeadStatusBadgeDisplay(status) {
    if (!inspectLeadStatusBadge) return;
    inspectLeadStatusBadge.textContent = status;
    inspectLeadStatusBadge.className = "badge"; // Reset classes
    
    if (status === "New") inspectLeadStatusBadge.classList.add("badge-status-new");
    else if (status === "Contacted") inspectLeadStatusBadge.classList.add("badge-status-contacted");
    else if (status === "Converted") inspectLeadStatusBadge.classList.add("badge-status-converted");
    else if (status === "Closed") inspectLeadStatusBadge.classList.add("badge-status-closed");
  }

  // Render log logs timeline dynamically inside modal
  function renderLeadLogsTimeline(logs) {
    if (!inspectLeadLogs) return;
    inspectLeadLogs.innerHTML = "";
    
    if (logs.length === 0) {
      inspectLeadLogs.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; margin-top: 1rem;">No follow-up notes logged yet.</p>`;
      return;
    }
    
    logs.forEach(log => {
      const item = document.createElement("div");
      item.style.borderLeft = "2px solid var(--glass-light-border)";
      item.style.paddingLeft = "1rem";
      item.style.position = "relative";
      item.style.marginBottom = "0.75rem";
      
      const dot = document.createElement("div");
      dot.style.position = "absolute";
      dot.style.left = "-6px";
      dot.style.top = "4px";
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.background = "var(--accent-primary)";
      dot.style.border = "2px solid var(--glass-medium-border)";
      
      const timeSpan = document.createElement("span");
      timeSpan.style.fontSize = "0.75rem";
      timeSpan.style.color = "var(--text-muted)";
      timeSpan.style.display = "block";
      timeSpan.style.fontWeight = "600";
      timeSpan.textContent = log.timestamp;
      
      const noteText = document.createElement("p");
      noteText.style.fontSize = "0.85rem";
      noteText.style.color = "var(--text-primary)";
      noteText.style.marginTop = "0.25rem";
      noteText.style.lineHeight = "1.4";
      noteText.textContent = log.note;
      
      item.appendChild(dot);
      item.appendChild(timeSpan);
      item.appendChild(noteText);
      inspectLeadLogs.appendChild(item);
    });
  }

  // Bind lead filter and search input events
  if (leadsSearchInput) {
    leadsSearchInput.addEventListener("input", renderLeadsTable);
  }
  if (leadsStatusFilter) {
    leadsStatusFilter.addEventListener("change", renderLeadsTable);
  }

  // Close button hooks for Lead Inspect Modal
  if (closeInspectLeadModalBtn) {
    closeInspectLeadModalBtn.addEventListener("click", closeInspectLeadModal);
  }
  if (adminInspectLeadModal) {
    adminInspectLeadModal.addEventListener("click", (e) => {
      if (e.target === adminInspectLeadModal) closeInspectLeadModal();
    });
  }

  // Inspect Lead Action Form submit handler
  if (inspectLeadActionForm) {
    inspectLeadActionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (!inspectedLeadId) return;
      
      const statusVal = inspectLeadStatus.value;
      const noteVal = inspectLeadNoteInput.value.trim();
      
      const leads = loadLeads();
      const leadIndex = leads.findIndex(l => l.id === inspectedLeadId);
      
      if (leadIndex > -1) {
        leads[leadIndex].status = statusVal;
        
        // Append log if note was written
        if (noteVal) {
          if (!leads[leadIndex].logs) leads[leadIndex].logs = [];
          leads[leadIndex].logs.unshift({
            timestamp: new Date().toLocaleString(),
            note: noteVal
          });
        }
        
        saveLeads(leads);
        
        // Reset note input field
        inspectLeadNoteInput.value = "";
        
        // Show success confirmation
        if (inspectLeadSuccessMsg) {
          inspectLeadSuccessMsg.style.display = "block";
          setTimeout(() => {
            inspectLeadSuccessMsg.style.display = "none";
          }, 3000);
        }
        
        // Update modal details
        updateLeadStatusBadgeDisplay(statusVal);
        renderLeadLogsTimeline(leads[leadIndex].logs || []);
        
        // Update table list
        renderLeadsTable();
        
        // If status changed to Converted, toggle button visibility
        if (convertLeadBtn) {
          if (statusVal === "Converted") {
            convertLeadBtn.style.display = "none";
          } else {
            convertLeadBtn.style.display = "inline-block";
          }
        }
      }
    });
  }

  // Convert lead to member click handler
  if (convertLeadBtn) {
    convertLeadBtn.addEventListener("click", async () => {
      if (!inspectedLeadId) return;
      
      const leads = loadLeads();
      const leadIndex = leads.findIndex(l => l.id === inspectedLeadId);
      
      if (leadIndex > -1) {
        const lead = leads[leadIndex];
        
        // Check if already registered
        const users = loadUsers();
        if (users.some(u => u.email === lead.email)) {
          alert("Error: This email address is already registered as a member.");
          return;
        }
        
        // Register standard account
        const today = new Date();
        const expiry = new Date();
        expiry.setDate(today.getDate() + 30);
        const expiryStr = expiry.toISOString().split('T')[0];
        
        const generatedPassword = generateRandomPassword(8);
        const convertedUser = {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || "",
          password: generatedPassword, // Set random generated password
          mustChangePassword: true,
          favorites: [],
          routineHistory: [],
          theme: "",
          membership: {
            tier: "Basic",
            status: "Active",
            expiryDate: expiryStr,
            notes: "Converted from lead registration."
          },
          goals: "",
          healthNotes: ""
        };
        
        users.push(convertedUser);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        
        // Update lead status
        lead.status = "Converted";
        if (!lead.logs) lead.logs = [];
        lead.logs.unshift({
          timestamp: new Date().toLocaleString(),
          note: `Lead converted to registered user account successfully. Temporary Password: ${generatedPassword}`
        });
        
        localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
        saveToServer();

        // Task 4.1 — fire welcome + credentials email to the new member
        await sendTransactionalEmail("lead-converted", { name: lead.name, tempPassword: generatedPassword }, lead.email);
        try {
          await sendWhatsAppNotification("welcome", { tempPass: generatedPassword }, lead.email);
        } catch (wErr) {
          console.error("WhatsApp welcome dispatch failed:", wErr);
        }

        if (inspectLeadSuccessMsg) {
          const originalText = inspectLeadSuccessMsg.textContent;
          inspectLeadSuccessMsg.innerHTML = `✓ Lead successfully converted to member account!<br><span style="font-weight: 500;">Generated Password:</span> <code style="background: rgba(255, 255, 255, 0.15); padding: 0.1rem 0.3rem; border-radius: 3px; font-family: monospace; font-size: 0.95rem; margin-top: 0.2rem; display: inline-block;">${generatedPassword}</code>`;
          inspectLeadSuccessMsg.style.display = "block";
          setTimeout(() => {
            inspectLeadSuccessMsg.textContent = originalText;
            inspectLeadSuccessMsg.style.display = "none";
          }, 5000);
        }
        
        // Refresh modal displays
        if (inspectLeadStatus) inspectLeadStatus.value = "Converted";
        updateLeadStatusBadgeDisplay("Converted");
        renderLeadLogsTimeline(lead.logs);
        if (convertLeadBtn) convertLeadBtn.style.display = "none";
        
        // Refresh leads table & admin users tables
        renderLeadsTable();
        renderAdminUsersTable();
      }
    });
  }

  // Delete User
  function deleteUser(email) {
    if (confirm(`Are you sure you want to delete the user account for "${email}"? This will permanently delete their profile, favorites, and routine history.`)) {
      const users = loadUsers();
      const updatedUsers = users.filter(u => u.email !== email);
      saveUsers(updatedUsers);
      renderAdminUsersTable();
    }
  }

  // Open inspection profile modal
  function openInspectModal(email) {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) return;
    
    inspectedUserEmail = email;
    
    inspectUserName.textContent = user.name;
    inspectUserEmail.textContent = user.email;
    if (inspectUserPhone) inspectUserPhone.textContent = user.phone ? `Phone: ${user.phone}` : "Phone: -";
    if (inspectUserPhoneInput) inspectUserPhoneInput.value = user.phone || "";
    inspectStatCompleted.textContent = user.routineHistory ? user.routineHistory.length : 0;
    inspectStatFavorites.textContent = user.favorites ? user.favorites.length : 0;
    
    if (user.membership) {
      if (inspectMembershipTierSelect) inspectMembershipTierSelect.value = user.membership.tier || "Basic";
      if (inspectMembershipStatusSelect) inspectMembershipStatusSelect.value = user.membership.status || "Active";
      if (inspectMembershipExpiryInput) inspectMembershipExpiryInput.value = user.membership.expiryDate || "";
      if (inspectCoachingNotes) inspectCoachingNotes.value = user.membership.notes || "";
    }
    
    // Populate batch dropdown inside inspection modal
    if (inspectUserBatchSelect) {
      const batches = loadBatches();
      inspectUserBatchSelect.innerHTML = `<option value="">No Batch Assigned</option>`;
      batches.forEach(b => {
        const option = document.createElement("option");
        option.value = b.id;
        option.textContent = b.name;
        inspectUserBatchSelect.appendChild(option);
      });
      inspectUserBatchSelect.value = user.batchId || "";
    }
    
    if (inspectMembershipSuccessMsg) inspectMembershipSuccessMsg.style.display = "none";
    
    // Render Inspected user's Favorites
    inspectFavoritesList.innerHTML = "";
    if (!user.favorites || user.favorites.length === 0) {
      inspectFavoritesList.innerHTML = `<p class="empty-text" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.9rem;">No favorited poses yet.</p>`;
    } else {
      user.favorites.forEach(poseId => {
        const pose = YOGA_POSES.find(p => p.id === poseId);
        if (pose) {
          const item = document.createElement("div");
          item.className = "fav-pose-item";
          item.innerHTML = `
            <div class="fav-pose-img-wrap" style="height: 40px; width: 40px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass);">
              ${pose.svgMarkup}
            </div>
            <div class="fav-pose-meta" style="flex-grow: 1;">
              <h4 style="font-size: 0.9rem; font-weight: 600;">${pose.name}</h4>
              <p style="font-size: 0.7rem; color: var(--text-muted);">${pose.category} • ${pose.difficulty}</p>
            </div>
          `;
          inspectFavoritesList.appendChild(item);
        }
      });
    }
    
    // Render Inspected user's History
    inspectHistoryList.innerHTML = "";
    if (!user.routineHistory || user.routineHistory.length === 0) {
      inspectHistoryList.innerHTML = `<p class="empty-text" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.9rem;">No routines completed yet.</p>`;
    } else {
      const sortedHistory = [...user.routineHistory].reverse();
      sortedHistory.forEach(historyItem => {
        const routine = YOGA_ROUTINES.find(r => r.id === historyItem.routineId);
        if (routine) {
          const dateStr = new Date(historyItem.timestamp).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          const item = document.createElement("div");
          item.className = "history-item";
          item.innerHTML = `
            <div class="history-routine-icon" style="font-size: 1.1rem;">🧘‍♂️</div>
            <div class="history-meta" style="flex-grow: 1;">
              <h4 style="font-size: 0.9rem; font-weight: 600;">${routine.name}</h4>
              <p style="font-size: 0.7rem; color: var(--text-muted);">Completed on ${dateStr}</p>
            </div>
            <span class="badge badge-difficulty-${routine.difficulty.toLowerCase()}" style="font-size: 0.65rem;">${routine.difficulty}</span>
          `;
          inspectHistoryList.appendChild(item);
        }
      });
    }
    
    adminInspectModal.classList.add("active");
    adminInspectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Close inspection profile modal
  function closeInspectModal() {
    adminInspectModal.classList.remove("active");
    adminInspectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Render Analytics Reports
  function renderAdminReports() {
    const users = loadUsers();
    const regularUsers = users.filter(u => u.email !== "admin@quantumyoga.xyz");
    
    // Total users count
    adminStatTotalUsers.textContent = regularUsers.length;
    
    // Calculate total completions and frequency map of routines and poses
    let totalCompletions = 0;
    const routineCompletionsCount = {};
    const poseFavoritesCount = {};
    const allCompletionLogs = [];
    
    regularUsers.forEach(user => {
      // Routine History completions
      if (user.routineHistory) {
        totalCompletions += user.routineHistory.length;
        user.routineHistory.forEach(historyItem => {
          routineCompletionsCount[historyItem.routineId] = (routineCompletionsCount[historyItem.routineId] || 0) + 1;
          
          allCompletionLogs.push({
            userName: user.name,
            userEmail: user.email,
            routineId: historyItem.routineId,
            timestamp: historyItem.timestamp
          });
        });
      }
      
      // Favorites count
      if (user.favorites) {
        user.favorites.forEach(poseId => {
          poseFavoritesCount[poseId] = (poseFavoritesCount[poseId] || 0) + 1;
        });
      }
    });
    
    adminStatTotalCompletions.textContent = totalCompletions;
    
    // Find most completed routine
    let popularRoutineName = "None";
    let maxRoutineCompletions = 0;
    Object.keys(routineCompletionsCount).forEach(routineId => {
      const count = routineCompletionsCount[routineId];
      if (count > maxRoutineCompletions) {
        maxRoutineCompletions = count;
        const routineObj = YOGA_ROUTINES.find(r => r.id === routineId);
        if (routineObj) popularRoutineName = `${routineObj.name} (${count})`;
      }
    });
    adminStatPopularRoutine.textContent = popularRoutineName;
    
    // Find most favorited pose
    let popularPoseName = "None";
    let maxPoseFavorites = 0;
    Object.keys(poseFavoritesCount).forEach(poseId => {
      const count = poseFavoritesCount[poseId];
      if (count > maxPoseFavorites) {
        maxPoseFavorites = count;
        const poseObj = YOGA_POSES.find(p => p.id === poseId);
        if (poseObj) popularPoseName = `${poseObj.name} (${count})`;
      }
    });
    adminStatPopularPose.textContent = popularPoseName;
    
    // Render Chronological completion history table
    adminReportsTableBody.innerHTML = "";
    
    if (allCompletionLogs.length === 0) {
      adminReportsTableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 2.5rem 0;">
            No routine completions logged yet.
          </td>
        </tr>
      `;
      return;
    }
    
    // Sort log in descending order (most recent first)
    allCompletionLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    allCompletionLogs.forEach(logItem => {
      const routineObj = YOGA_ROUTINES.find(r => r.id === logItem.routineId);
      const routineName = routineObj ? routineObj.name : "Unknown Routine";
      const dateStr = new Date(logItem.timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 500;">${logItem.userName}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${logItem.userEmail}</span>
          </div>
        </td>
        <td><span style="font-weight: 500;">${routineName}</span></td>
        <td><span style="color: var(--text-secondary); font-size: 0.9rem;">${dateStr}</span></td>
      `;
      adminReportsTableBody.appendChild(row);
    });
  }

  // Helper function to convert 12h time to 24h format for ISO parsing
  function convertTimeTo24h(timeStr) {
    if (!timeStr) return "00:00";
    const cleanTime = timeStr.trim().toUpperCase();
    const parts = cleanTime.match(/^(\d+):(\d+)\s*(AM|PM)$/);
    if (!parts) return timeStr; // fallback if already 24h
    let hours = parseInt(parts[1], 10);
    const minutes = parts[2];
    const ampm = parts[3];
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    const hoursStr = hours < 10 ? `0${hours}` : hours;
    return `${hoursStr}:${minutes}`;
  }

  // Helper function to get upcoming date timestamp for a given weekday name and time
  function getWeekdayTimestamp(dayName, timeStr) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    if (targetDayIndex === -1) return new Date();
    
    const now = new Date();
    const currentDayIndex = now.getDay();
    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7; // next week
    
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + daysToAdd);
    
    const time24 = convertTimeTo24h(timeStr);
    const [h, m] = time24.split(":");
    targetDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    return targetDate;
  }

  // Render Admin Overview Dashboard
  function renderAdminOverview() {
    const users = loadUsers();
    const payments = JSON.parse(localStorage.getItem("qy_payments") || "[]");
    const appointments = JSON.parse(localStorage.getItem("qy_appointments") || "[]");
    const batches = JSON.parse(localStorage.getItem("qy_batches") || "[]");

    const todayStr = new Date().toISOString().split('T')[0];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDay = daysOfWeek[new Date().getDay()];

    // 1. KPI Counts
    const activeMembersCount = users.filter(u => u.email !== "admin@quantumyoga.xyz").length;
    
    const totalPaidRevenue = payments
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const apptsTodayCount = appointments.filter(a => a.date === todayStr && a.status !== "cancelled").length;
    
    let batchSessionsToday = 0;
    users.forEach(u => {
      if (u.batchId) {
        const userBatch = batches.find(b => b.id === u.batchId);
        if (userBatch && userBatch.timetable) {
          const hasClassToday = userBatch.timetable.some(slot => slot.day === todayDay);
          if (hasClassToday) {
            batchSessionsToday++;
          }
        }
      }
    });
    const totalSessionsToday = apptsTodayCount + batchSessionsToday;

    const unpaidInvoicesCount = payments.filter(p => p.status === "pending" || p.status === "overdue" || p.status === "review").length;

    // Update KPI UI
    if (adminKpiMembers) adminKpiMembers.textContent = activeMembersCount;
    if (adminKpiRevenue) adminKpiRevenue.textContent = `₹${totalPaidRevenue}`;
    if (adminKpiSessions) adminKpiSessions.textContent = totalSessionsToday;
    if (adminKpiUnpaid) adminKpiUnpaid.textContent = unpaidInvoicesCount;

    // 2. Insights Recommendations
    const insights = [];

    // Alert: Payments under review
    const reviewCount = payments.filter(p => p.status === "review").length;
    if (reviewCount > 0) {
      insights.push({
        type: "warning",
        icon: "🔍",
        title: "Payments Under Review",
        description: `There are ${reviewCount} payment(s) waiting for transaction UTR verification in the Payments Panel.`
      });
    }

    // Alert: Low Enrollment
    batches.forEach(b => {
      const enrolledCount = users.filter(u => u.batchId === b.id).length;
      if (enrolledCount < 2) {
        insights.push({
          type: "warning",
          icon: "⚠️",
          title: `Low Enrollment: ${b.name}`,
          description: `This batch has only ${enrolledCount} enrolled member(s). Consider merging cohorts or initiating follow-ups.`
        });
      }
    });

    // Alert: Overdue invoices
    const overdueCount = payments.filter(p => p.status === "overdue").length;
    if (overdueCount > 0) {
      insights.push({
        type: "warning",
        icon: "💳",
        title: "Overdue Dues Pending",
        description: `There are ${overdueCount} overdue subscription payment(s). Prompt students to complete shavasana transactions.`
      });
    }

    // Alert: Pending invoices
    const pendingCount = payments.filter(p => p.status === "pending").length;
    if (pendingCount > 0) {
      insights.push({
        type: "info",
        icon: "✉️",
        title: "Unresolved Invoices",
        description: `There are ${pendingCount} pending payment invoices. Use the Payments Panel to update or send reminders.`
      });
    }

    // Daily Schedule Insights
    if (totalSessionsToday > 5) {
      insights.push({
        type: "success",
        icon: "🔥",
        title: "Busy Schedule Today",
        description: `The studio has a busy lineup today with ${totalSessionsToday} total sessions. Prepare props and check-in rosters.`
      });
    } else if (totalSessionsToday > 0) {
      insights.push({
        type: "success",
        icon: "🧘‍♀️",
        title: "Daily Attendance Flow",
        description: `${totalSessionsToday} session(s) scheduled for today. Track alignment feedback on member cards.`
      });
    } else {
      insights.push({
        type: "info",
        icon: "🍃",
        title: "Quiet Day at the Studio",
        description: "No private sessions or batch classes scheduled today. Great day to update pose libraries or adjust settings."
      });
    }

    // Render Insights UI
    if (adminInsightsList) {
      adminInsightsList.innerHTML = "";
      insights.forEach(ins => {
        const card = document.createElement("div");
        card.className = `admin-insight-card alert-${ins.type}`;
        card.innerHTML = `
          <div class="admin-insight-icon">${ins.icon}</div>
          <div class="admin-insight-content">
            <h4>${ins.title}</h4>
            <p>${ins.description}</p>
          </div>
        `;
        adminInsightsList.appendChild(card);
      });
    }

    // 3. Today's Studio Timeline
    const timelineItems = [];

    // Fetch active appointments
    appointments.forEach(a => {
      if (a.status !== "cancelled") {
        const userObj = users.find(u => u.email === a.studentEmail);
        const userName = userObj ? userObj.name : a.studentEmail;
        
        let dateObj;
        try {
          const time24 = convertTimeTo24h(a.time);
          dateObj = new Date(`${a.date}T${time24}`);
        } catch(e) {
          dateObj = new Date();
        }

        timelineItems.push({
          title: `Coaching: ${a.selectedRoutine || "Yoga Review"}`,
          subtitle: `Student: ${userName} (${a.studentEmail})`,
          timeDisplay: `${formatDateToIndian(a.date)} at ${a.time}`,
          badgeText: a.status,
          badgeClass: "badge-scheduled",
          timestamp: dateObj.getTime()
        });
      }
    });

    // Fetch user batch classes
    users.forEach(u => {
      if (u.batchId) {
        const batchObj = batches.find(b => b.id === u.batchId);
        if (batchObj && batchObj.timetable) {
          batchObj.timetable.forEach(slot => {
            const nextDate = getWeekdayTimestamp(slot.day, slot.time);
            timelineItems.push({
              title: `Class: ${batchObj.name}`,
              subtitle: `Enrolled: ${u.name} (${u.email})`,
              timeDisplay: `${slot.day} at ${slot.time}`,
              badgeText: "Batch",
              badgeClass: "badge-paid",
              timestamp: nextDate.getTime()
            });
          });
        }
      }
    });

    // Sort timelines ascending (soonest first)
    timelineItems.sort((a, b) => a.timestamp - b.timestamp);

    // Render Timeline Feed UI
    if (adminTimelineFeed) {
      adminTimelineFeed.innerHTML = "";
      const topTimeline = timelineItems.slice(0, 5);
      if (topTimeline.length === 0) {
        adminTimelineFeed.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.9rem;">No upcoming student sessions scheduled.</p>`;
      } else {
        topTimeline.forEach(item => {
          const feedRow = document.createElement("div");
          feedRow.className = "admin-timeline-item";
          feedRow.innerHTML = `
            <div class="feed-item-left">
              <span class="feed-item-title">${item.title}</span>
              <span class="feed-item-subtitle">${item.subtitle}</span>
            </div>
            <div class="feed-item-right">
              <span class="feed-item-badge ${item.badgeClass}">${item.badgeText}</span>
              <span class="feed-item-meta">${item.timeDisplay}</span>
            </div>
          `;
          adminTimelineFeed.appendChild(feedRow);
        });
      }
    }

    // 4. Recent Payment Activity
    if (adminPaymentsFeed) {
      adminPaymentsFeed.innerHTML = "";
      const paymentsFeedList = [...payments];
      // Sort payments descending (latest due or issued first)
      paymentsFeedList.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      const topPayments = paymentsFeedList.slice(0, 5);

      if (topPayments.length === 0) {
        adminPaymentsFeed.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.9rem;">No recent payment billing logged.</p>`;
      } else {
        topPayments.forEach(pay => {
          const userObj = users.find(u => u.email === pay.userEmail);
          const userName = userObj ? userObj.name : pay.userEmail;
          const statusClass = `badge-${pay.status.replace(/\s+/g, '-')}`;

          const feedRow = document.createElement("div");
          feedRow.className = "admin-payment-item";
          feedRow.innerHTML = `
            <div class="feed-item-left">
              <span class="feed-item-title">${pay.description || "Subscription Invoice"}</span>
              <span class="feed-item-subtitle">Student: ${userName} (${pay.userEmail})</span>
            </div>
            <div class="feed-item-right">
              <span class="feed-item-badge ${statusClass}">${pay.status}</span>
              <span class="feed-item-meta" style="font-weight: 700; color: var(--text-primary);">₹${pay.amount}</span>
            </div>
          `;
          adminPaymentsFeed.appendChild(feedRow);
        });
      }
    }
  }

  // Bind admin sub-tabs click events
  adminOverviewTabBtn.addEventListener("click", () => setAdminSubTab("overview"));
  adminUsersTabBtn.addEventListener("click", () => setAdminSubTab("users"));
  if (adminPaymentsTabBtn) {
    adminPaymentsTabBtn.addEventListener("click", () => setAdminSubTab("payments"));
  }
  if (adminLeadsTabBtn) {
    adminLeadsTabBtn.addEventListener("click", () => setAdminSubTab("leads"));
  }
  adminReportsTabBtn.addEventListener("click", () => setAdminSubTab("reports"));
  adminSettingsTabBtn.addEventListener("click", () => setAdminSubTab("settings"));
  
  if (adminBatchesTabBtn) {
    adminBatchesTabBtn.addEventListener("click", () => setAdminSubTab("batches"));
  }

  if (adminAppointmentsTabBtn) {
    adminAppointmentsTabBtn.addEventListener("click", () => setAdminSubTab("appointments"));
  }

  // Payments sub-tabs binding
  const adminPaymentsLedgerTabBtn = document.getElementById("admin-payments-ledger-tab-btn");
  const adminPaymentsIssueTabBtn = document.getElementById("admin-payments-issue-tab-btn");
  const adminPaymentsLedgerPanel = document.getElementById("admin-payments-ledger-tab-panel");
  const adminPaymentsIssuePanel = document.getElementById("admin-payments-issue-tab-panel");

  if (adminPaymentsLedgerTabBtn && adminPaymentsIssueTabBtn && adminPaymentsLedgerPanel && adminPaymentsIssuePanel) {
    adminPaymentsLedgerTabBtn.addEventListener("click", () => {
      adminPaymentsLedgerTabBtn.classList.add("active");
      adminPaymentsIssueTabBtn.classList.remove("active");
      adminPaymentsLedgerPanel.style.display = "block";
      adminPaymentsIssuePanel.style.display = "none";
      renderAdminPayments();
    });
    
    adminPaymentsIssueTabBtn.addEventListener("click", () => {
      adminPaymentsIssueTabBtn.classList.add("active");
      adminPaymentsLedgerTabBtn.classList.remove("active");
      adminPaymentsIssuePanel.style.display = "block";
      adminPaymentsLedgerPanel.style.display = "none";
      renderAdminPayments();
    });
  }

  if (adminEmailTabBtn) {
    adminEmailTabBtn.addEventListener("click", () => setAdminSubTab("email"));
  }

  // Create Batch Form Handler
  const adminBatchFeeInput = document.getElementById("admin-batch-fee-input");

  if (adminCreateBatchForm) {
    adminCreateBatchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = adminBatchNameInput.value.trim();
      const instructor = adminBatchInstructorInput ? adminBatchInstructorInput.value.trim() || "Master Coach" : "Master Coach";
      const capacity = adminBatchCapacityInput ? parseInt(adminBatchCapacityInput.value) || 15 : 15;
      const sessionFee = adminBatchFeeInput ? Number(adminBatchFeeInput.value) || 0 : 0;
      
      if (!name) return;
      
      const batches = loadBatches();
      const id = "batch-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      if (batches.some(b => b.id === id)) {
        alert("A batch with a similar name already exists.");
        return;
      }
      
      const newBatch = {
        id: id,
        name: name,
        instructor: instructor,
        capacity: capacity,
        sessionFee: sessionFee,
        timetable: []
      };
      
      batches.push(newBatch);
      saveBatches(batches);
      
      adminCreateBatchForm.reset();
      renderAdminBatches();
      alert(`Batch "${name}" created successfully.`);
    });
  }

  // Schedule Weekly Class Form Handler
  if (adminScheduleClassForm) {
    adminScheduleClassForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const batchId = adminScheduleBatchSelect.value;
      const weekday = adminScheduleWeekdaySelect.value;
      const rawTime = adminScheduleTimeInput.value;
      const routineId = adminScheduleRoutineSelect.value;
      
      if (!batchId || !weekday || !rawTime || !routineId) {
        alert("Please fill in all scheduling fields.");
        return;
      }
      
      const formattedTime = format12HourTime(rawTime);
      const routine = YOGA_ROUTINES.find(r => r.id === routineId);
      const routineName = routine ? routine.name : "Yoga Class";
      
      const batches = loadBatches();
      const batchIndex = batches.findIndex(b => b.id === batchId);
      
      if (batchIndex > -1) {
        if (!batches[batchIndex].timetable) {
          batches[batchIndex].timetable = [];
        }
        
        batches[batchIndex].timetable.push({
          day: weekday,
          time: formattedTime,
          routineId: routineId,
          routineName: routineName
        });
        
        saveBatches(batches);
        adminScheduleClassForm.reset();
        
        if (state.currentUser && state.currentUser.batchId === batchId) {
          renderClientBatchDetails();
          renderClientSessionsFeed();
        }
        
        renderAdminBatches();
        alert(`Class scheduled successfully for ${batches[batchIndex].name}.`);
      }
    });
  }
  
  if (closeOverdueBannerBtn) {
    closeOverdueBannerBtn.addEventListener("click", () => {
      if (overduePaymentBanner) overduePaymentBanner.style.display = "none";
    });
  }
  
  // Bind close buttons for inspect modal
  closeInspectModalBtn.addEventListener("click", closeInspectModal);
  adminInspectModal.addEventListener("click", (e) => {
    if (e.target === adminInspectModal) closeInspectModal();
  });

  const SITE_DEFAULT_THEME_KEY = "qy_site_default_theme";

  function getSiteDefaultTheme() {
    return localStorage.getItem(SITE_DEFAULT_THEME_KEY) || "midnight";
  }

  // Apply visual theme class to root
  function applyTheme(themeName) {
    document.documentElement.classList.remove("theme-light", "theme-sunset");
    if (themeName === "light") {
      document.documentElement.classList.add("theme-light");
    } else if (themeName === "sunset") {
      document.documentElement.classList.add("theme-sunset");
    }
  }

  // Theme dropdown change listener
  if (profileThemeSelect) {
    profileThemeSelect.addEventListener("change", () => {
      const selectedTheme = profileThemeSelect.value;
      applyTheme(selectedTheme);
      
      if (state.currentUser) {
        state.currentUser.theme = selectedTheme;
        
        // Save back to local storage
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.email === state.currentUser.email);
        if (userIndex > -1) {
          users[userIndex].theme = selectedTheme;
          saveUsers(users);
        }
      }
    });
  }

  // Phone save button listener
  if (profilePhoneSaveBtn) {
    profilePhoneSaveBtn.addEventListener("click", () => {
      if (!state.currentUser) return;
      const phoneVal = profilePhoneInput ? profilePhoneInput.value.trim() : "";
      
      // Indian mobile format check regex
      const phoneRegex = /^(?:\+91|0)?[\s\-]?[6-9](?:[\s\-]?\d){9}$/;
      if (phoneVal && !phoneRegex.test(phoneVal)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }

      const users = loadUsers();
      const userIndex = users.findIndex(u => u.email === state.currentUser.email);
      if (userIndex > -1) {
        users[userIndex].phone = phoneVal;
        state.currentUser.phone = phoneVal;
        saveUsers(users);
        
        if (profileUserPhone) {
          profileUserPhone.textContent = phoneVal ? `Phone: ${phoneVal}` : "Phone: -";
        }
        
        if (profileSandboxOptinWidget) {
          profileSandboxOptinWidget.style.display = phoneVal ? "block" : "none";
        }
        
        if (profilePhoneSuccessMsg) {
          profilePhoneSuccessMsg.style.display = "inline";
          setTimeout(() => {
            profilePhoneSuccessMsg.style.display = "none";
          }, 3000);
        }
      }
    });
  }

  // Admin default theme change listener
  if (adminDefaultThemeSelect) {
    adminDefaultThemeSelect.addEventListener("change", () => {
      const selectedTheme = adminDefaultThemeSelect.value;
      localStorage.setItem(SITE_DEFAULT_THEME_KEY, selectedTheme);
      saveToServer();
      
      // If no logged in user or user has no custom theme override, update view immediately
      if (!state.currentUser || !state.currentUser.theme) {
        applyTheme(selectedTheme);
      }
    });
  }

  // Admin UPI settings form submit listener
  if (adminUpiSettingsForm) {
    adminUpiSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const vpa = adminUpiVpaInput.value.trim();
      const name = adminUpiNameInput.value.trim();
      
      if (!vpa || !name) {
        alert("Please enter a valid UPI VPA and Payee Name.");
        return;
      }
      
      saveUpiSettings({ vpa, name });
      
      if (adminUpiSuccessMsg) {
        adminUpiSuccessMsg.style.display = "block";
        setTimeout(() => {
          adminUpiSuccessMsg.style.display = "none";
        }, 3000);
      }
    });
  }

  // Admin WhatsApp settings form submit listener
  const adminWhatsAppSettingsForm = document.getElementById("admin-whatsapp-settings-form");
  if (adminWhatsAppSettingsForm) {
    adminWhatsAppSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enabled = document.getElementById("whatsapp-enabled-checkbox").checked;
      const apiKey = document.getElementById("whatsapp-api-key").value.trim();
      const gatewayUrl = document.getElementById("whatsapp-gateway-url").value.trim();
      const bookingTemplate = document.getElementById("whatsapp-template-booking").value.trim();
      
      const settings = {
        enabled,
        apiKey,
        gatewayUrl,
        templates: {
          welcome: "Hello {{name}}, welcome to Quantum Yoga! Your temporary password is {{tempPass}}.",
          invoice: "Hello {{name}}, a new invoice {{invoiceId}} for {{amount}} is due on {{dueDate}}. Pay here: {{link}}",
          booking: bookingTemplate
        }
      };
      
      localStorage.setItem(STORAGE_KEY_WHATSAPP_SETTINGS, JSON.stringify(settings));
      saveToServer();
      
      const successMsg = document.getElementById("admin-whatsapp-settings-success-msg");
      if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 3000);
      }
    });
  }

  // Appointment fee save button listener
  const adminSaveApptFeeBtn = document.getElementById("admin-save-appointment-fee-btn");
  if (adminSaveApptFeeBtn) {
    adminSaveApptFeeBtn.addEventListener("click", () => {
      const apptFeeInput = document.getElementById("admin-appointment-fee-input");
      if (!apptFeeInput || apptFeeInput.value.trim() === "") return;
      const fee = Number(apptFeeInput.value);
      if (isNaN(fee) || fee < 0) {
        alert("Please enter a valid fee amount (0 or greater).");
        return;
      }
      saveAppointmentFee(fee);
      const successMsg = document.getElementById("admin-appointment-fee-success-msg");
      if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => { successMsg.style.display = "none"; }, 3000);
      }
    });
  }

  // UPI Bank Ledger File Upload Listener
  const adminLedgerUploadBtn = document.getElementById("admin-ledger-upload-btn");
  const adminLedgerFileInput = document.getElementById("admin-ledger-file-input");
  const adminLedgerUploadMsg = document.getElementById("admin-ledger-upload-msg");

  if (adminLedgerUploadBtn && adminLedgerFileInput) {
    adminLedgerUploadBtn.addEventListener("click", async () => {
      const file = adminLedgerFileInput.files[0];
      if (!file) {
        alert("Please select a CSV statement file first.");
        return;
      }

      adminLedgerUploadBtn.textContent = "Uploading...";
      adminLedgerUploadBtn.disabled = true;
      if (adminLedgerUploadMsg) {
        adminLedgerUploadMsg.style.display = "none";
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        try {
          const response = await fetch('/api/admin/upload-ledger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileContent })
          });

          if (!response.ok) {
            let errMsg = `Server returned status ${response.status}`;
            try { const errObj = await response.json(); errMsg = errObj.error || errMsg; } catch (_) {}
            throw new Error(errMsg);
          }

          const result = await response.json();
          if (result.success) {
            // Re-load state from server (includes the newly updated ledger cache)
            await loadFromServer();
            
            if (adminLedgerUploadMsg) {
              adminLedgerUploadMsg.style.color = "#10B981";
              adminLedgerUploadMsg.textContent = `✓ ${result.summary}`;
              adminLedgerUploadMsg.style.display = "block";
            }
            alert(`Ledger statement processed successfully!\n${result.summary}`);
            adminLedgerFileInput.value = ""; // clear input
          } else {
            alert(`Failed to import ledger: ${result.error || 'Unknown error'}`);
          }
        } catch (err) {
          console.error("Error uploading ledger:", err);
          alert(`Error uploading statement: ${err.message}`);
        } finally {
          adminLedgerUploadBtn.textContent = "Upload & Parse Ledger";
          adminLedgerUploadBtn.disabled = false;
        }
      };
      reader.onerror = () => {
        alert("Failed to read the local file.");
        adminLedgerUploadBtn.textContent = "Upload & Parse Ledger";
        adminLedgerUploadBtn.disabled = false;
      };
      reader.readAsText(file);
    });
  }

  // UPI QR Payment Modal logic
  function closeUpiPaymentModal() {
    if (upiPaymentModal) {
      upiPaymentModal.classList.remove("active");
      upiPaymentModal.setAttribute("aria-hidden", "true");
      if (upiPaymentUtrForm) {
        upiPaymentUtrForm.reset();
        delete upiPaymentUtrForm.dataset.invoiceId;
      }
    }
  }

  function openUpiPaymentModal(p) {
    const upiSettings = loadUpiSettings();
    
    if (upiPayInvoiceId) upiPayInvoiceId.textContent = "#" + p.id;
    if (upiPayInvoiceDesc) upiPayInvoiceDesc.textContent = p.description || "Subscription Fee";
    if (upiPayInvoiceAmount) upiPayInvoiceAmount.textContent = "₹" + p.amount;
    if (upiPayRecipientName) upiPayRecipientName.textContent = upiSettings.name;
    if (upiPayRecipientVpa) upiPayRecipientVpa.textContent = upiSettings.vpa;
    
    // Generate UPI URL scheme and QR code URL
    const vpa = encodeURIComponent(upiSettings.vpa);
    const payee = encodeURIComponent(upiSettings.name);
    const amount = encodeURIComponent(p.amount);
    const transactionNote = encodeURIComponent(p.id);
    const upiUrl = `upi://pay?pa=${vpa}&pn=${payee}&am=${amount}&tn=${transactionNote}`;
    
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUrl)}`;
    if (upiQrImage) {
      upiQrImage.src = qrApiUrl;
    }
    
    if (upiPaymentUtrForm) {
      upiPaymentUtrForm.reset();
      upiPaymentUtrForm.dataset.invoiceId = p.id;
    }
    
    if (upiPaymentModal) {
      upiPaymentModal.classList.add("active");
      upiPaymentModal.setAttribute("aria-hidden", "false");
    }
  }

  if (closeUpiPaymentModalBtn) {
    closeUpiPaymentModalBtn.addEventListener("click", closeUpiPaymentModal);
  }

  if (upiPaymentModal) {
    upiPaymentModal.addEventListener("click", (e) => {
      if (e.target === upiPaymentModal) closeUpiPaymentModal();
    });
  }

  if (upiPaymentUtrForm) {
    upiPaymentUtrForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const invoiceId = upiPaymentUtrForm.dataset.invoiceId;
      const utr = upiPaymentUtrInput.value.trim();
      
      if (!/^\d{12}$/.test(utr)) {
        alert("Please enter a valid 12-digit UPI Transaction Ref / UTR number.");
        return;
      }

      const submitBtn = upiPaymentUtrForm.querySelector("button[type=submit]");
      if (submitBtn) {
        submitBtn.textContent = "Verifying...";
        submitBtn.disabled = true;
      }
      
      try {
        const payments = loadPayments();
        const payment = payments.find(p => p.id === invoiceId);
        if (!payment) {
          alert("Invoice not found.");
          if (submitBtn) {
            submitBtn.textContent = "Submit Reference";
            submitBtn.disabled = false;
          }
          return;
        }

        const response = await fetch('/api/verify-upi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId, utr, amount: payment.amount })
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Sync database from server to get updated state
          await loadFromServer();
          
          closeUpiPaymentModal();
          renderClientBillingHistory();
          renderClientDashboard();

          if (result.status === 'paid') {
            alert("✓ Payment auto-approved! Your invoice has been marked as paid.");
            // Send transactional notifications (Note: server doesn't send them, app.js usually triggers or server does? Let's check: the spec/proposal says: "Directly trigger payment-approved email and WhatsApp notifications containing the verified UTR.")
            try {
              await sendTransactionalEmail("payment-approved", {
                invoiceId: payment.id,
                amount: payment.amount,
                utr: utr,
                paymentDate: new Date().toISOString().split('T')[0]
              }, payment.userEmail);
            } catch (err) {
              console.error("Failed to send transactional email:", err);
            }
          } else if (result.status === 'discrepancy') {
            alert("⚠️ Payment discrepancy flagged! UTR matched but amount differs. Admin notified.");
          } else {
            alert("ℹ️ UTR not found in bank ledger. Payment submitted under review.");
            try {
              await sendTransactionalEmail("payment-under-review", {
                invoiceId: payment.id,
                amount: payment.amount,
                utr: utr
              }, payment.userEmail);
            } catch (err) {
              console.error("Failed to send transactional email:", err);
            }
          }
        } else {
          alert(`Verification failed: ${result.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("Error verifying UPI payment:", err);
        alert(`Error communicating with verification server: ${err.message}. Your payment was not submitted.`);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = "Submit Reference";
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Bind profile sub-tabs click events
  if (profileDashboardTabBtn) {
    profileDashboardTabBtn.addEventListener("click", () => setProfileSubTab("dashboard"));
  }
  if (profilePracticeTabBtn) {
    profilePracticeTabBtn.addEventListener("click", () => setProfileSubTab("practice"));
  }
  if (profileWellnessTabBtn) {
    profileWellnessTabBtn.addEventListener("click", () => setProfileSubTab("wellness"));
  }

  if (profileAppointmentsTabBtn) {
    profileAppointmentsTabBtn.addEventListener("click", () => setProfileSubTab("appointments"));
  }

  // Profile email tab binding
  if (profileEmailTabBtn) {
    profileEmailTabBtn.addEventListener("click", () => setProfileSubTab("email"));
  }

  // Wellness form submit listener
  if (profileWellnessForm) {
    profileWellnessForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const goalsVal = profileGoalsInput.value.trim();
      const healthVal = profileHealthInput.value.trim();
      
      if (state.currentUser) {
        state.currentUser.goals = goalsVal;
        state.currentUser.healthNotes = healthVal;
        
        // Save to LocalStorage
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.email === state.currentUser.email);
        if (userIndex > -1) {
          users[userIndex].goals = goalsVal;
          users[userIndex].healthNotes = healthVal;
          saveUsers(users);
        }
        
        // Show success alert
        if (profileWellnessSuccessMsg) {
          profileWellnessSuccessMsg.style.display = "block";
          setTimeout(() => {
            profileWellnessSuccessMsg.style.display = "none";
          }, 3000);
        }
      }
    });
  }

  // Admin inspect user membership form submit listener
  if (adminInspectMembershipForm) {
    adminInspectMembershipForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (!inspectedUserEmail) return;
      
      const tierVal = inspectMembershipTierSelect.value;
      const statusVal = inspectMembershipStatusSelect.value;
      const expiryVal = inspectMembershipExpiryInput.value;
      const notesVal = inspectCoachingNotes.value.trim();
      const phoneVal = inspectUserPhoneInput ? inspectUserPhoneInput.value.trim() : "";
      const batchVal = inspectUserBatchSelect ? inspectUserBatchSelect.value : "";
      
      const users = loadUsers();
      const userIndex = users.findIndex(u => u.email === inspectedUserEmail);
      
      if (userIndex > -1) {
        users[userIndex].phone = phoneVal;
        if (inspectUserPhone) inspectUserPhone.textContent = phoneVal ? `Phone: ${phoneVal}` : "Phone: -";
        users[userIndex].membership = {
          tier: tierVal,
          status: statusVal,
          expiryDate: expiryVal,
          notes: notesVal
        };
        
        users[userIndex].batchId = batchVal || null;
        
        saveUsers(users);

        // Task 9.4 — send batch enrollment transactional email if a batch was assigned
        const previousBatchId = users[userIndex]?.batchId;
        if (batchVal && batchVal !== previousBatchId) {
          const batches = loadBatches();
          const assignedBatch = batches.find(b => b.id === batchVal);
          sendTransactionalEmail("welcome", {
            batchName: assignedBatch ? assignedBatch.name : batchVal,
            message: `You have been enrolled in the batch: ${assignedBatch ? assignedBatch.name : batchVal}.`
          }, inspectedUserEmail);
        }
        
        // Update state.currentUser if they match the inspected user
        if (state.currentUser && state.currentUser.email === inspectedUserEmail) {
          state.currentUser = users[userIndex];
          updateUIForLogin();
        }
        
        // Show success confirmation
        if (inspectMembershipSuccessMsg) {
          inspectMembershipSuccessMsg.style.display = "inline-block";
          setTimeout(() => {
            inspectMembershipSuccessMsg.style.display = "none";
          }, 3000);
        }
        
        // Re-render admin dashboard stats in case membership settings changed metrics
        renderAdminOverview();
      }
    });
  }

  // Appointment modal event listeners
  if (bookAppointmentBtn) {
    bookAppointmentBtn.addEventListener("click", () => openAppointmentModal());
  }
  if (adminBookApptBtn) {
    adminBookApptBtn.addEventListener("click", () => openAppointmentModal());
  }
  if (closeAppointmentModalBtn) {
    closeAppointmentModalBtn.addEventListener("click", closeAppointmentModal);
  }
  if (appointmentModal) {
    appointmentModal.addEventListener("click", (e) => {
      if (e.target === appointmentModal) {
        closeAppointmentModal();
      }
    });
  }
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const date = appointmentDateInput ? appointmentDateInput.value : "";
      const time = appointmentTimeSelect ? appointmentTimeSelect.value : "";
      
      let studentEmail = "";
      const isAdmin = state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz";
      const apptId = appointmentForm.dataset.appointmentId;
      
      let routine = "";
      const appointments = loadAppointments();
      
      if (apptId) {
        const appt = appointments.find(a => a.id === apptId);
        if (appt) {
          studentEmail = appt.studentEmail;
          routine = appt.selectedRoutine;
        } else {
          studentEmail = state.currentUser ? state.currentUser.email : "";
          routine = appointmentRoutineSelect ? appointmentRoutineSelect.value : "";
        }
      } else {
        routine = appointmentRoutineSelect ? appointmentRoutineSelect.value : "";
        if (isAdmin && appointmentStudentSelect) {
          studentEmail = appointmentStudentSelect.value;
        } else {
          studentEmail = state.currentUser ? state.currentUser.email : "";
        }
      }
      
      if (studentEmail === "admin@quantumyoga.xyz") {
        alert("Administrators cannot book appointments for themselves.");
        return;
      }
      
      if (!studentEmail) {
        alert("Please select a student.");
        return;
      }
      if (!routine) {
        alert("Please select a routine.");
        return;
      }
      if (!date || !time) {
        alert("Please specify a date and time slot.");
        return;
      }
      
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      if (date < todayStr) {
        alert("Cannot schedule appointments in the past.");
        return;
      }
      
      const hasConflict = appointments.some(a => 
        a.studentEmail === studentEmail && 
        a.date === date && 
        a.time === time && 
        a.status !== "Cancelled" && 
        a.id !== apptId
      );
      if (hasConflict) {
        alert("This time slot is already booked for this student. Please choose another date or time.");
        return;
      }
      
      if (apptId) {
        const idx = appointments.findIndex(a => a.id === apptId);
        if (idx > -1) {
          appointments[idx].date = date;
          appointments[idx].time = time;
          appointments[idx].status = "Rescheduled";
          saveAppointments(appointments);
          alert("Appointment rescheduled successfully.");
          
          sendWhatsAppNotification("booking", {
            routine: routine,
            date: date,
            time: time,
            message: `Hi {{name}}, your private coaching for {{routine}} has been rescheduled to {{date}} at {{time}}.`
          }, studentEmail);
        }
      } else {
        const apptFee = loadAppointmentFee();
        const apptId = "appt-" + Date.now();
        const invoiceId = "INV-" + Date.now();
        const newAppt = {
          id: apptId,
          studentEmail: studentEmail,
          selectedRoutine: routine,
          date: date,
          time: time,
          status: "Scheduled",
          fee: apptFee,
          invoiceId: invoiceId
        };
        appointments.push(newAppt);
        localStorage.setItem("qy_appointments", JSON.stringify(appointments));

        // Auto-billing creation logic for private coaching session
        const payments = loadPayments();
        payments.push({
          id: invoiceId,
          userEmail: studentEmail,
          description: "Private coaching class fee",
          amount: String(apptFee),
          dueDate: date,
          status: "pending",
          appointmentId: apptId
        });
        localStorage.setItem("qy_payments", JSON.stringify(payments));
        saveToServer();

        alert("Appointment scheduled successfully.");

        // Task 9.2 — send appointment confirmation transactional email
        sendTransactionalEmail("appointment", {
          appointmentId: newAppt.id,
          action: "Confirmation",
          date: date,
          time: time,
          routine: routine
        }, studentEmail);

        sendWhatsAppNotification("booking", {
          routine: routine,
          date: date,
          time: time,
          amount: String(apptFee),
          invoiceId: invoiceId
        }, studentEmail);
      }
      
      closeAppointmentModal();
      
      renderClientDashboard();
      renderStudentAppointments();
      renderAdminAppointments();
      
      // Update admin views if logged in as administrator
      if (state.currentUser && state.currentUser.email === "admin@quantumyoga.xyz") {
        renderAdminOverview();
        renderAdminPayments();
      }
    });
  }

  if (adminAppointmentsSearchInput) {
    adminAppointmentsSearchInput.addEventListener("input", () => {
      renderAdminAppointments();
    });
  }

  // User Management filters
  const adminUsersSearchInput = document.getElementById("admin-users-search-input");
  const adminUsersTierFilter = document.getElementById("admin-users-tier-filter");
  const adminUsersStatusFilter = document.getElementById("admin-users-status-filter");

  if (adminUsersSearchInput) {
    adminUsersSearchInput.addEventListener("input", renderAdminUsersTable);
  }
  if (adminUsersTierFilter) {
    adminUsersTierFilter.addEventListener("change", renderAdminUsersTable);
  }
  if (adminUsersStatusFilter) {
    adminUsersStatusFilter.addEventListener("change", renderAdminUsersTable);
  }

  // Payments filters
  const adminPaymentsSearchInput = document.getElementById("admin-payments-search-input");
  const adminPaymentsStatusFilter = document.getElementById("admin-payments-status-filter");

  if (adminPaymentsSearchInput) {
    adminPaymentsSearchInput.addEventListener("input", renderAdminPayments);
  }
  if (adminPaymentsStatusFilter) {
    adminPaymentsStatusFilter.addEventListener("change", renderAdminPayments);
  }

  // Student Billing filters
  const studentBillingSearchInput = document.getElementById("student-billing-search-input");
  const studentBillingStatusFilter = document.getElementById("student-billing-status-filter");

  if (studentBillingSearchInput) {
    studentBillingSearchInput.addEventListener("input", renderClientBillingHistory);
  }
  if (studentBillingStatusFilter) {
    studentBillingStatusFilter.addEventListener("change", renderClientBillingHistory);
  }

  // Student Appointments filters
  const studentApptsSearchInput = document.getElementById("student-appointments-search-input");
  const studentApptsStatusFilter = document.getElementById("student-appointments-status-filter");

  if (studentApptsSearchInput) {
    studentApptsSearchInput.addEventListener("input", renderStudentAppointments);
  }
  if (studentApptsStatusFilter) {
    studentApptsStatusFilter.addEventListener("change", renderStudentAppointments);
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
    // Throttled activity tracker for idle session timeout
    let lastActivityUpdate = 0;
    function updateActivity() {
      const now = Date.now();
      if (now - lastActivityUpdate > 2000) {
        localStorage.setItem("qy_last_activity", now.toString());
        lastActivityUpdate = now;
      }
    }

    // Attach listeners
    ["mousemove", "mousedown", "keypress", "scroll", "click", "touchstart"].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Initialize activity on startup
    localStorage.setItem("qy_last_activity", Date.now().toString());

    // Check query params for idleTest mode
    const urlParams = new URLSearchParams(window.location.search);
    const isIdleTest = urlParams.get("idleTest") === "1";
    const idleTimeoutLimit = isIdleTest ? 10000 : 15 * 60 * 1000; // 10s or 15m

    setInterval(() => {
      if (localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION)) {
        const lastActivity = parseInt(localStorage.getItem("qy_last_activity") || "0");
        const timeElapsed = Date.now() - lastActivity;
        if (timeElapsed > idleTimeoutLimit) {
          updateUIForLogout();
          alert("Your session has expired due to inactivity. Please log in again.");
        }
      }
    }, 5000);

    checkSession();
    renderPoses();
    renderRoutines();
    await loadFromServer();
  } catch (err) {
    console.error("FATAL ERROR IN DOMContentLoaded:", err, err.stack);
  }
});
