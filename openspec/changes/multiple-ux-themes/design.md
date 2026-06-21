## Context

Currently, the Quantum Yoga website features a static premium dark glassmorphic theme. We need to introduce a customizable theme selection system, allowing users to transition between Midnight Aura (dark), Ethereal Light (light), and Zen Sunset (warm sunset) modes.

## Goals / Non-Goals

**Goals:**
- Define color, border, and blur CSS variables on the root document level for Midnight, Light, and Sunset palettes.
- Add a theme selector dropdown in the user's Profile card view.
- Persist the chosen theme in LocalStorage within the user's profile database (`qy_users`).
- Dynamically toggle root CSS classes (e.g., `.theme-light` and `.theme-sunset`) to shift colors immediately when selected.

**Non-Goals:**
- Changing structural layout markup, elements, or functionality.

## Decisions

### 1. Root Variable Cascade
- **Decision**: Define colors and gradients as CSS variables on `:root` (defaulting to Midnight Aura), and override them inside `.theme-light` and `.theme-sunset` selectors.
- **Rationale**: Leverages native CSS variable cascading, making dynamic switches fast and preventing page redraw layout shifts.
- **Alternative considered**: Swapping stylesheet links. Rejected because it slows down transitions and adds file request latency.

### 2. Database Integration
- **Decision**: Store a `theme` field in the user object structure. If absent, fallback to `midnight` on user load/session check.
- **Rationale**: Keeps customization bound to the specific user profile, supporting personalization across restarts.

## Risks / Trade-offs

- **[Risk]** Theme variables not applying to dynamic cards or modals.
  - *Mitigation*: Ensure all borders, shadows, blur cards, and alerts use the defined theme variables (e.g., `var(--glass-medium-bg)`) instead of hardcoded hex values.
