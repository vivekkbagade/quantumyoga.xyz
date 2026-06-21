## 1. Glassmorphism CSS Design Tokens

- [x] 1.1 Define custom CSS variables for tiered glassmorphism (light, medium, and dark glass) inside `index.css`, including backdrops, border colors, and GPU composite layers.
- [x] 1.2 Update the dashboard headers, search/controls card, and footers to use the new medium glassmorphism tokens.
- [x] 1.3 Update detail modal bodies, player overlays, and inner card contents to use dark and light glassmorphic styles respectively.

## 2. Dynamic Spotlight Interaction

- [x] 2.1 Implement a mousemove event listener in `app.js` to calculate client coordinates relative to hovered cards and set `--mouse-x` and `--mouse-y` CSS properties.
- [x] 2.2 Add a responsive background radial-gradient layer in `index.css` that follows the custom CSS variables to create the interactive cursor reflection.

## 3. Shimmer and Border Glow Animations

- [x] 3.1 Add a CSS pseudo-element shimmer reflection sweep animation in `index.css` triggered by hover on cards and action buttons.
- [x] 3.2 Implement smooth transitions for border-color and box-shadow glows on all glassmorphic components on hover.

## 4. Verification and Performance Testing

- [x] 4.1 Verify spotlight tracking alignment and card interactivity in the browser.
- [x] 4.2 Validate backdrop filter rendering performance, ensuring overlays animate smoothly at 60FPS without visual layout lag.
