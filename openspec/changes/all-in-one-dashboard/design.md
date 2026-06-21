## Context

The current administrative panel is divided into separate list tables for users, analytics metrics, and general settings. An executive admin landing dashboard is missing. We will design a unified dashboard page containing KPI trackers, daily insights cards, chronological activity logs, and financial snapshots to provide a single cockpit view for studio administrators.

## Goals / Non-Goals

**Goals:**
- Insert an "Overview Dashboard" sub-tab in the Admin Console as the default view.
- Render visual KPI cards summarizing members count, revenue totals, scheduled appointments, and pending invoice counts.
- Build a daily insights generator card containing recommendations on class capacity and billing operations.
- Construct unified timelines showing upcoming bookings and payment adjustments across the studio.

**Non-Goals:**
- Integrating external email services for reminders (warnings are simulated on-screen alerts).
- Writing complex backend aggregation routines (computations are handled on-the-fly from LocalStorage).

## Decisions

### 1. Default Sub-Tab Integration
- **Decision**: Add a new sub-tab button `#admin-overview-tab-btn` at the beginning of the admin sub-navigation in `index.html`, routing administrators to `#admin-overview-panel` by default.
- **Rationale**: Elevates high-level metrics to the first view, aligning with modern dashboard management tools.

### 2. Live Aggregated Metric Widgets
- **Decision**: Create a summary function in `app.js` that computes counts and sums:
  - Active Members: Length of `qy_users` excluding the admin email.
  - Total Revenue: Sum of paid invoices inside `qy_payments`.
  - Today's Classes/Sessions: Merged schedule items from `qy_appointments` and active user batch classes occurring today.
  - Outstanding Payments: Unpaid records inside `qy_payments`.
- **Rationale**: Computing metrics on-the-fly ensures statistics remain fully synchronized with database states.

### 3. Client-Side Rules-Based Insights
- **Decision**: Implement a rules utility in `app.js` that checks for specific system warnings:
  - Generates alert cards if any active batch has less than 2 members.
  - Generates prompt alerts listing outstanding balances that have passed their payment due date.
- **Rationale**: Translates standard tables into high-value actionable guidance.

## Risks / Trade-offs

- **[Risk]** Heavy metrics calculations on huge LocalStorage arrays could block the main UI thread.
  - *Mitigation*: Cap records or only run metrics calculations when the administrator actively opens the Admin Overview tab.
