## Why

Currently, the admin panel renders the leads pipeline as a traditional flat table. This makes it difficult for administrators to quickly visualize the progress of prospective student inquiries through different relationship states. Converting this pipeline into a kanban-style swimlane board organizes leads into functional columns based on status, improving pipeline tracking and visual feedback.

## What Changes

- **Kanban Swimlane View**: Replace the static flat table layout in the Leads Pipeline sub-panel with a horizontal board of four swimlane columns: `New`, `Contacted`, `Converted`, and `Closed`.
- **Lead Cards**: Render each lead as an interactive card displaying the lead's name, email, phone, inquiry date, and excerpt message.
- **Card Action Movements**: Allow administrators to update a lead's pipeline status via interactive movement controls on cards to advance or regress their status.
- **Conversion and Details Overlays**: Ensure clicking a card triggers the Lead Inspection Modal, allowing logging notes and converting status.

## Capabilities

### New Capabilities
- `leads-swimlane`: Introduces a kanban-style swimlane board UI for tracking inquiry leads by status, adding column groupings, status change actions, and visual status update animations.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Modifies `index.html` to update the structure of the Leads Pipeline tab from a `table` to a column-based swimlane wrapper.
- Modifies `index.css` to add grid/flexbox styles for horizontal kanban swimlanes, card designs, hover effects, and modern drag/move animations.
- Modifies `app.js` to render the swimlane columns dynamically, manage the card interactions, update statuses in LocalStorage database, and refresh the UI upon updates.
