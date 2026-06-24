# Studio Analytics & CSV/PDF Reports

The Quantum Yoga Admin Panel includes an interactive Reports and Analytics dashboard to monitor business operations, collections, and student progress.

---

## 📊 Interactive SVG Data Charts

To ensure fast load times and zero dependency overhead, charts are rendered using dynamic SVGs:
1.  **Monthly Collections (Bar Chart)**: Aggregates paid transactions over the past 6 months to display monthly revenue, complete with gradient fills and hover value overlays.
2.  **Monthly Booking Trends (Line Chart)**: Tracks scheduled class appointments over the past 6 months using clean SVG lines and coordinates.

---

## 🏆 Practice and Posture Rankings

*   **Most Favorited Postures**: Aggregates pose bookmark lists across all users to display a ranking table of the top 5 most favorited postures.
*   **Most Popular Routines**: Parses all student completion histories to rank the top 5 most completed routine workouts.

---

## 📥 File Exports & Reports Printing

*   **CSV Exporter**: Clicking "Export CSV Ledger" triggers a client-side Blob generation of all payment records in standard CSV format, instantly downloading the file.
*   **Printable Attendance logs**: Uses `@media print` style blocks in CSS to isolate the completion history tables, hiding navigation menus, KPI cards, and charts, allowing clean printing or saving to PDF.
