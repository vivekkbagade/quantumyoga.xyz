## Context

Currently, inquiry leads are rendered in a flat `table` format under the Leads Pipeline panel. Converting this to a swimlane board (Kanban style) requires changing the tabular HTML structure to a column-based layout, adding CSS grid/flex styles for the board, columns, and cards, and rewriting the JavaScript rendering logic to partition leads by status.

## Goals / Non-Goals

**Goals:**
- Replace the flat HTML `table` in the leads pipeline sub-panel with a horizontal board containing four swimlane columns: `New`, `Contacted`, `Converted`, and `Closed`.
- Render lead cards displaying crucial inquiry details (name, email, phone, date, message excerpt) inside columns.
- Add quick action buttons on cards to transition their status left/right or to adjacent status columns.
- Retain search filtering capabilities, filtering active cards across columns dynamically.
- Keep data synchronized with LocalStorage database stores.

**Non-Goals:**
- Full drag-and-drop HTML5 API implementation (we will focus on click-to-move interactive action controls for robustness and mobile friendliness, with drag-and-drop as an optional visual enhancement if needed).
- Changing the schema of leads in LocalStorage (we will keep the existing status attributes: `New`, `Contacted`, `Converted`, `Closed`).

## Decisions

### 1. Board Layout and Responsive Columns
- **Decision**: Lay out columns horizontally using CSS Grid (`grid-template-columns: repeat(4, 1fr)`) with a minimum width (`min-width: 250px`) on columns and horizontal scroll (`overflow-x: auto`) on the parent board wrapper.
- **Rationale**: CSS Grid provides clean, equal-width columns. The minimum width combined with overflow-x ensures responsiveness on smaller screens (tablet and mobile viewports) without breaking column layouts.

### 2. Action Controls on Cards
- **Decision**: Add quick chevron/arrow action buttons at the bottom of each card (e.g., `←` and `→` or descriptive buttons like `Move to Contacted`) to change status, plus an "Inspect" button to open the existing full detail modal.
- **Rationale**: Clickable button controls are highly reliable, accessible via keyboard/assistive technologies, and work seamlessly on touchscreen mobile devices compared to raw drag-and-drop event handlers.

### 3. Search and Status Filtering behavior
- **Decision**: When the search input is populated, cards that do not match the query are hidden or removed, while matching cards are rendered in their respective columns. If the status filter dropdown is set to a specific value (e.g. "Contacted"), other columns will be collapsed or hidden from view, showing only the active swimlane.
- **Rationale**: Keeps the existing search and filter DOM elements functional while adapting their output representation to the Kanban board structure.

## Risks / Trade-offs

- **[Risk]** Large volumes of inquiry leads could cause long vertical scroll feeds within a single column.
  - *Mitigation*: Limit columns to vertical scroll (`max-height: 500px; overflow-y: auto`) and display column header counters so administrators can see card volumes at a glance.
