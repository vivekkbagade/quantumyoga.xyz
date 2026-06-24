## Context

Studio administrators want to view high-level metrics for their business. Instead of integrating bulky charting libraries, we will use raw inline SVGs dynamically populated by JavaScript.

## Goals / Non-Goals

**Goals:**
*   Add a "Studio Analytics" sub-navigation view to the Admin Panel.
*   Draw SVG charts representing monthly billing collections and scheduled classes.
*   Add a ranking table of favorited postures and routine counts.
*   Implement CSV file generators on the client-side using `data:text/csv` URI blobs.
*   Implement clean print-friendly CSS formatting for PDF printing of attendance logs.

**Non-Goals:**
*   Server-side PDF rendering using third-party packages. All document generation happens on the client-side.

## Decisions

### 1. SVG Rendering of Charts
*   **Decision**: Calculate coordinates dynamically and append SVG elements (rects for bars, paths/polylines for charts) using Vanilla JS.
*   **Rationale**: Minimizes dependencies, keeps bundling lightweight, and ensures responsive rendering.

### 2. Client-Side CSV Downloads
*   **Decision**: Generate CSV format strings from localStorage array variables dynamically, convert to Blobs, and trigger downloads using mock anchor links.
*   **Rationale**: Secure and instant download without requiring backend API generation overhead.

## Risks / Trade-offs

*   **Risk**: SVG chart coordinates can scale incorrectly on screen resize.
    *   *Mitigation*: Use responsive `viewBox` settings on target SVGs.
