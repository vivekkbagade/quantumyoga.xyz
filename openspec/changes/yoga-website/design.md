## Context

The workspace currently contains no frontend codebase. We will build a premium, highly responsive, single-page application (SPA) styled with Vanilla CSS and animated using Vanilla JS. The website will provide yoga poses and structured routines, accompanied by high-quality illustrations/pictures and video guides.

## Goals / Non-Goals

**Goals:**
- **Premium Dark Aesthetics**: Establish a sleek, dark-themed, glassmorphic UI using standard CSS variables and backdrop filters.
- **Pose & Routine Database**: Provide structured poses (with step-by-step instructions, benefits, categories) and routines.
- **Search & Filters**: Allow instantaneous client-side filtering by difficulty level (Beginner, Intermediate, Advanced) and category (Vinyasa, Hatha, Restorative), as well as keyword searching.
- **Interactive Media Player**: Implement a custom HTML5 video overlay player with custom controls (play, pause, timeline scrub, mute, volume).
- **Responsive Layout**: Support mobile, tablet, and desktop viewports with a fluid grid/flexbox system.

**Non-Goals:**
- **Database/Backend integration**: A backend database is out of scope. Data will be defined in a clean client-side JavaScript object/JSON module.
- **User Authentication**: Creating accounts or tracking user logins is excluded from this iteration.
- **Live Video Streaming**: Real-time streaming is not required; standard HTML5 video elements loading stock/placeholder video sources will be used.

## Decisions

### 1. Architectural Pattern: Single Page Application (SPA) with Vanilla JS
- **Decision**: Build the application as a client-side SPA with standard DOM-rendering views (Home, Poses Directory, Routines Detail, and Video Overlay).
- **Rationale**: Keeps the codebase lightweight and highly responsive without setup/build complexity. Allows for smooth page transitions and seamless audio/video overlay playback.
- **Alternative considered**: Multi-page HTML files. Rejected because transitioning between pages interrupts the custom video playback state and prevents sleek CSS transition animations.

### 2. Styling: Vanilla CSS with Custom Properties (Variables)
- **Decision**: Avoid utility classes/Tailwind and write pure, semantic CSS with custom properties for theme colors, spacing, and font sizes.
- **Rationale**: Follows the workspace styling rules and provides maximum control over gradients, complex hover transition curves, and glassmorphic styling (`backdrop-filter`).
- **Theme Variables**:
  - Background: `#09070f` (Midnight Purple)
  - Card Background: `rgba(25, 18, 38, 0.4)` with `backdrop-filter: blur(12px)`
  - Accent Primaries: `#9061f9` (Deep lavender) and `#e02424` (Crimson rose)
  - Typography: Google Font 'Inter' or 'Cabinet Grotesk' (via CDN link)

### 3. Media Assets Integration
- **Decision**: Incorporate a mock asset set. Pictures will use high-quality vector SVGs or generated images showing correct alignments. Videos will use standard high-definition, royalty-free MP4 loops (such as peaceful nature landscapes, ocean waves, or yoga poses) loaded via free CDN links.
- **Rationale**: Avoids bloating the repository with massive binary files while delivering a realistic and stunning visual experience.

## Risks / Trade-offs

- **Risk**: Video elements loading slowly on lower bandwidth connections.
  - *Mitigation*: Enable preloading (`preload="metadata"`), specify `poster` images for every video, and display a smooth loading spinner until the video can play (`canplay` event).
- **Risk**: Maintaining structured yoga data in pure JS code.
  - *Mitigation*: Organize the data in a dedicated module `data.js` containing clean, typed arrays of Poses and Routines.
