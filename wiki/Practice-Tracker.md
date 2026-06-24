# Interactive Practice Calendar & Streak Grid

Quantum Yoga features an interactive Practice Tracker designed to help students build consistent daily habits.

---

## 📅 Practice Contribution Grid

The Practice Grid displays the user's practice density over the past 365 days, color-coded by intensity:
*   **Grid Layout**: Formatted as a 7x52 CSS grid mimicking the GitHub contribution chart.
*   **Density Mapping**:
    *   `contrib-0` (Grey): No practice logged.
    *   `contrib-1` (Light Green): 1 practice session logged.
    *   `contrib-2` (Medium Green): 2 practice sessions logged.
    *   `contrib-3` (Dark Green): 3 practice sessions logged.
    *   `contrib-4` (Vibrant Green with Glow): 4+ practice sessions logged.
*   **Tooltips**: Hovering over any cell displays the date and total practice sessions completed on that day.

---

## 🔥 Daily Streak Counting

The client dynamically calculates and displays:
1.  **Current Daily Streak**: The number of consecutive days of practice leading up to today (or yesterday). A streak is maintained as long as the student logs a practice at least once every 24-48 hours.
2.  **Longest Practice Streak**: The longest contiguous sequence of practice days achieved historically.

---

## 🏆 Milestone Badges

Virtual milestone badges are awarded when the student reaches key streak thresholds:
*   **🌱 Sprout**: 3-day streak.
*   **🔥 Spark**: 7-day streak.
*   **🧘 Master**: 14-day streak.
*   **👑 Champion**: 30-day streak.

Unlocked badges change from a locked/translucent state to an illuminated state with subtle pulsing animations.

---

## 💾 Storage & Sync

*   **LocalStorage Key**: Saved under `qy_users` within each user record as a `practice_logs` array of ISO timestamps.
*   **Database Synchronization**: Synced automatically to the server database via the `/api/db` endpoint, persisting progress across all client platforms.
