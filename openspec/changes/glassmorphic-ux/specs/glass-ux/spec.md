## ADDED Requirements

### Requirement: Tiered Glassmorphic Styling
The system SHALL support three tiers of glassmorphic styles with responsive translucent borders, backdrop filters, and hardware acceleration:
- **Light Glass**: A highly transparent frosting (e.g., 20% opacity card backdrop) for inner sections.
- **Medium Glass**: The standard frosted glass effect (e.g., 40% opacity) with backdrop blur (12px to 20px) for layout cards, header, and controls.
- **Dark Glass**: A deep, low-transparency frosted glass backdrop (e.g., 70% opacity) for detail modals and the custom video player interface.

#### Scenario: Displaying Tiered Glass Layouts
- **WHEN** the user views the dashboard
- **THEN** the header, card grid, controls card, and overlay modals SHALL render using their respective tiered glass backdrop filters and translucent borders.

### Requirement: Interactive Cursor Spotlight Reflection
The system SHALL calculate the cursor position relative to glassmorphic containers (such as pose cards) and update their styling dynamically to render a moving radial spotlight highlight, simulating a light beam reflecting off the glass surface.

#### Scenario: Interactive Hover Spotlight
- **WHEN** the user moves the cursor over a pose card
- **THEN** the system SHALL dynamically update the background gradient origin point matching the cursor coordinate on the hovered card.

### Requirement: Glass Shimmer and Glowing Border Animations
The system SHALL animate the border color opacity and background refraction layer of glassmorphic containers during hover states to show a frosted reflection shimmer and glowing border effect.

#### Scenario: Card Hover Animation
- **WHEN** the user hovers over a pose card
- **THEN** the card's border color SHALL transition from a muted white border to a glowing lavender border, and a subtle shimmer transition SHALL pass across the card background.
