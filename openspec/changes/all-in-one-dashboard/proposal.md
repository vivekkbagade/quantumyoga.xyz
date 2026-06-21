## Why

Quantum Yoga administrators currently lack a unified overview dashboard to monitor studio business and daily operations in a single view. The all-in-one dashboard creates a central administrative landing page providing quick snapshot metrics, daily business insights, upcoming student appointments, and recent payment logs—enabling smarter studio management.

## What Changes

- **Admin Landing Dashboard**: Add an "Overview Dashboard" as the primary tab inside the Admin Console, displaying visual summary widgets and active feeds.
- **Real-Time Snapshot Widgets**: Display key performance indicators (KPIs) like total active members, revenue collected, scheduled appointments today, and outstanding payments.
- **Daily Insights Generator**: Render automated recommendations and analytics (e.g., peak batch times, pending follow-ups, or action items).
- **Consolidated Activity Feeds**: Show unified calendars of upcoming client bookings and recent payment/invoice updates in a clean timeline view.

## Capabilities

### New Capabilities
- `all-in-one-dashboard`: Introduces a consolidated overview dashboard inside the admin control panel containing KPI stats, daily insights, consolidated schedules, and recent payment logs.

### Modified Capabilities

## Impact

- Modifies `index.html` to inject the new administrative "Overview Dashboard" panel, including widget containers, feed sections, and styling grids.
- Modifies `app.js` to compute real-time metrics from `qy_users`, `qy_batches`, `qy_appointments`, and `qy_payments`, generating dynamic daily recommendations and populating admin lists.
