## 1. Database Model and Persistence

- [x] 1.1 Update `saveToServer()` in `app.js` to serialize `practice_logs` array
- [x] 1.2 Update `loadFromServer()` in `app.js` to retrieve and store `practice_logs` array

## 2. Dashboard UI Elements

- [x] 2.1 Add the practice calendar container (`#practice-calendar-container`) and streak boxes to the student profile section in `index.html`
- [x] 2.2 Add milestone badge containers with glassmorphic styles in `index.html`
- [x] 2.3 Implement the Check-In checkbox or button widget inside `index.html` to allow checking off today's practice

## 3. Habit Tracker Logic

- [x] 3.1 Implement calendar grid generation logic in `app.js` to dynamically draw the 365 contribution days
- [x] 3.2 Implement streak counter calculator (current streak and longest streak) in `app.js` based on `practice_logs`
- [x] 3.3 Implement check-in button click handler in `app.js` to update `practice_logs`, save to server, trigger check-off animations, and recalculate streaks
- [x] 3.4 Implement badge illumination logic in `app.js` when milestone targets are hit

## 4. Testing and Verification

- [x] 4.1 Run `npm run build` to verify the frontend compilation
- [x] 4.2 Verify calendar grids render correctly and check-ins increment daily streaks on mock login
