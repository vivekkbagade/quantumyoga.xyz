## Why

Studio administrators need high-level dashboard visualizations and download capabilities to monitor monthly booking counts, financial collection progress, and posture popularity metrics. Adding dynamic interactive SVG graphs and CSV/PDF report download endpoints will provide administrators with immediate business growth insights.

## What Changes

*   **Analytics Sub-tab in Admin Panel**: Introduce a new "Studio Analytics" sub-view inside the Admin Panel.
*   **Interactive SVG Charts**: Render SVG-based monthly payment revenue bar charts and class booking line charts with hover tooltip animations.
*   **Postures Popularity Metrics**: Add statistics displaying favorited pose counts and routine execution frequencies.
*   **CSV/PDF Export Options**: Add buttons to export financial ledger files (CSV) and attendance logs.

## Capabilities

### New Capabilities
- `admin-reports-analytics`: Visualizes monthly booking trends, collections, and posture rankings using raw SVG charts. Provides one-click CSV and receipt printing/PDF formatting logs.

### Modified Capabilities
<!-- None -->

## Impact

*   **Frontend**: Adds a sub-navigation tab under the Admin Panel view (`index.html` & `app.js`).
*   **Database/Storage**: Reads payments, appointments, users, and routines datasets. No schema changes are required.
