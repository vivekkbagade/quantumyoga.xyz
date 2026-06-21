## Why

Currently, Quantum Yoga features a static premium dark glassmorphic theme. While visually striking, some users prefer alternative themes, such as a crisp light glassmorphic theme or a warm sunset/zen theme, to match different times of day or personal aesthetic preferences. Adding a selectable theme manager enhances personal customizability and UX accessibility.

## What Changes

- Provide a "Theme Selector" control panel within the user's Profile tab dashboard.
- Support at least three distinct visual themes:
  - **Midnight Aura**: Default dark glassmorphism theme.
  - **Ethereal Light**: Soft light glassmorphism theme with high-contrast text and warm-gray backdrops.
  - **Zen Sunset**: Sunset aesthetic theme featuring rose and amber gradients.
- Save the selected theme persistently under the user's settings profile in LocalStorage (so the theme loads immediately on page load and session checks).
- Dynamically apply theme transitions by modifying CSS variables defined on the root element.

## Capabilities

### New Capabilities
- `theme-selector`: Introduces user-specific visual theme customization settings, letting users choose, save, and dynamically transition between Midnight, Light, and Sunset palettes.

### Modified Capabilities

## Impact

- Modifies `index.html` to add the Theme Selection layout controls in the Profile panel.
- Modifies `app.js` to manage user theme states, handle selector change events, update LocalStorage user details, and apply stylesheet variable shifts.
- Modifies `index.css` to define root CSS variables for light, dark, and sunset themes, and support smooth transitions.
