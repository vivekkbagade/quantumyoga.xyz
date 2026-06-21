# Core Yoga Directory Spec

## Overview
The Core Yoga capability provides users with a comprehensive directory of yoga poses and pre-defined yoga routines. It includes search, filter, and detailed walkthroughs of poses alongside a video player to guide practice.

## Directory Structure & Properties

### Yoga Poses (`YOGA_POSES`)
Each pose object has the following properties:
- `id` (string): Unique identifier (e.g., `"mountain-pose"`).
- `name` (string): Common English name.
- `sanskrit` (string): Sanskrit translation of the pose name.
- `category` (string): Yoga style/category (e.g., `Hatha`, `Vinyasa`, `Restorative`, `Yin`).
- `difficulty` (string): Skill level needed (`Beginner`, `Intermediate`, `Advanced`).
- `duration` (string): Recommended duration to hold the pose (e.g., `"60s"`).
- `benefits` (array of strings): Health/physiological benefits of the pose.
- `instructions` (array of strings): Step-by-step instructions.
- `videoUrl` (string): URL to the video demonstration file.
- `posterUrl` (string): URL to the cover image for video preview.
- `description` (string): Brief introduction/description of the pose.
- `svgMarkup` (string): SVG markup containing line-art illustration of the pose structure.

### Yoga Routines (`YOGA_ROUTINES`)
Routines bundle multiple poses into guided practice flows:
- `id` (string): Unique identifier (e.g., `"morning-energizer"`).
- `name` (string): Routine title.
- `duration` (string): Total estimated routine time.
- `difficulty` (string): Overall difficulty rating (`Beginner`, `Intermediate`, `Advanced`).
- `focus` (string): Purpose/focus of the routine.
- `videoUrl` (string): Demo/guided flow video url.
- `posterUrl` (string): Poster preview image url.
- `description` (string): Explanatory text summarizing the routine's focus.
- `poses` (array of objects): Sequence of poses, where each item contains:
  - `poseId` (string): Reference to a pose's ID.
  - `duration` (string): Custom hold duration for this step.

---

## User Interactions

### 1. Poses Directory Tab
- **Search bar**: Performs case-insensitive matching against a pose's `name`, `sanskrit`, `category`, and `description`.
- **Category Filter**: Dropdown menu filtering poses by category or "all".
- **Difficulty Filter**: Dropdown menu filtering poses by difficulty or "all".
- **Empty State**: Displays a helper button to reset all search queries and filters when no poses match.
- **Pose Cards**:
  - Displays difficulty badge and category badge.
  - Interactive "Favorite" button (requires authenticated user).
  - "Details" button opens the detailed view modal.

### 2. Pose Details Modal
- Displays SVG illustration alongside complete metadata (Sanskrit, Category, Duration).
- Lists key benefits and step-by-step instructions.
- Provides a **"Play Guide"** button that launches the custom HTML5 video overlay with the pose's demo video.

### 3. Routines Directory Tab
- Displays card list showing title, poster image, difficulty, focus, overall duration, and step count.
- **"Start Routine"** button opens the Routine modal.

### 4. Routine Modal & Sequence Flow
- Displays step-by-step sequence listing each pose name, category, and step duration in chronological order.
- **"Start Guided Flow"** opens the custom video player.
- **"Complete"** button records routine completion in user's profile history (requires user login).

### 5. Custom HTML5 Video Player Overlay
- Overlaid video container with support for:
  - Play/Pause controls.
  - Custom progress bar reflecting elapsed time and buffered range.
  - Mute/Unmute toggle and volume slider.
  - Current time / total duration display.
  - Fullscreen expansion.
  - Automatically handles routine completion when the video plays to the end.
