## 1. Dashboard UI Elements

- [ ] 1.1 Add the "Studio Analytics" sub-navigation tab and content panels inside `#admin-section` in `index.html`
- [ ] 1.2 Add container divs for SVG charts (billing collections and booking trends) in `index.html`
- [ ] 1.3 Add CSV Export and Attendance Printing buttons in the analytics panel inside `index.html`

## 2. Interactive SVG Logic

- [ ] 2.1 Write JavaScript helper functions in `app.js` to compile monthly payment data and draw an SVG bar chart
- [ ] 2.2 Write JavaScript helper functions in `app.js` to compile monthly booking dates and draw an SVG line chart
- [ ] 2.3 Implement posture popularity calculator (aggregating favorited counts from `qy_users`) and render a ranking table

## 3. CSV & Receipt PDF Generators

- [ ] 3.1 Implement the CSV billing exporter click handler in `app.js` utilizing `Blob` downloads
- [ ] 3.2 Implement print view styles in `index.css` targeting `@media print` to present a receipt-like log table
- [ ] 3.3 Implement the Print Attendance handler in `app.js` to toggle a print view overlay and call `window.print()`

## 4. Verification and Build

- [ ] 4.1 Run `npm run build` to verify frontend compiling
- [ ] 4.2 Validate charts load and hover values update on mock admin dashboard
