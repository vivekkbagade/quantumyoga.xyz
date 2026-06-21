## Context

The Quantum Yoga website is currently a premium, dark-themed Single Page Application (SPA). It uses basic glassmorphism in styling (via backdrop-filter and transparency), but it does not support multiple layers of glassmorphic surfaces, dynamic spotlight highlights matching cursor coordinates, or border glow transitions. We want to implement a comprehensive glassmorphic design language to make the dashboard look extremely interactive and premium.

## Goals / Non-Goals

**Goals:**
- Implement Tiered Glassmorphism Design Tokens in pure CSS (`index.css`), specifying Light, Medium, and Dark glass tiers.
- Implement a JavaScript-based mouse move event listener in `app.js` that tracks cursor coordinates and updates custom CSS properties (`--mouse-x`, `--mouse-y`) on glass cards to generate a dynamic radial gradient spotlight.
- Enhance card border styling, card background reflections, details modals, and media player controls using the new glassmorphism tier rules.
- Keep performance fluid (target 60FPS) by adding hardware-accelerated properties (`transform: translateZ(0)`) and optimizing backdrop-filter redraws.

**Non-Goals:**
- Redesigning the core layout structure or changing page routing.
- Adding a backend database or user session tracking.
- Implementing video guides/posters other than the CDN placeholders.

## Decisions

### 1. CSS Variables for Glass Tiers
- **Decision**: Define three dedicated CSS variable sets for Light Glass, Medium Glass, and Dark Glass in `:root` inside `index.css`.
- **Rationale**: Keeps styling consistent and makes it extremely simple to apply uniform overlays.
- **Alternative considered**: Implementing ad-hoc styling for each card/container. Rejected because it leads to design inconsistency and code duplication.

### 2. Coordinate-Based Radial Gradient for Spotlight Effect
- **Decision**: Bind a `mousemove` handler in `app.js` for elements with a class `.card` that updates `--mouse-x` and `--mouse-y` percentages. The cards will use a background overlay containing `radial-gradient(circle 180px at var(--mouse-x) var(--mouse-y), rgba(167, 139, 250, 0.15), transparent 80%)` combined with their glass backdrop.
- **Rationale**: Creates a very realistic, hardware-accelerated illumination reflection on the cards without extra DOM nodes.
- **Alternative considered**: Using an absolutely positioned glowing dot inside each card. Rejected because it adds extra DOM nodes and complex overflow/clipping logic.

### 3. Glass Shimmer Effect
- **Decision**: Use a CSS pseudo-element (`::after`) with a diagonal linear-gradient shimmer on interactive elements. On hover, translate this pseudo-element across the container using a smooth transition.
- **Rationale**: Highly performant transition computed directly by the browser's render compositor.
- **Alternative considered**: JavaScript-driven canvas or SVG-based light path sweep. Rejected due to unnecessary CPU overhead.

## Risks / Trade-offs

- **Risk**: Heavy backdrop-filter rendering on older GPU/CPU architectures causing layout lag.
  - *Mitigation*: Apply `transform: translateZ(0)` or `will-change: backdrop-filter, transform` to trigger GPU compositing layers, and limit blurs to a maximum of 24px.
- **Risk**: Spotlight gradient jitter during rapid cursor movements.
  - *Mitigation*: Let the browser handle standard coordinate mapping, and apply `will-change` on card backgrounds or use standard CSS custom properties.
