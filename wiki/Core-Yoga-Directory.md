# Core Yoga Directory

The Core Yoga module serves as the primary wellness repository for studio members, offering curated paths to inspect alignment, study benefits, and flow through sequences.

---

## 🧘 Posture Directory Schema (`YOGA_POSES`)

Each pose contains properties mapped out to optimize instruction and UI layouts:

*   **Identifiers:** Common English `name` and translation `sanskrit` keys.
*   **Taxonomy:** `category` (*Hatha*, *Vinyasa*, *Restorative*, *Yin*) and `difficulty` level (*Beginner*, *Intermediate*, *Advanced*).
*   **Guides:** Recommended hold `duration`, a list of physiological `benefits`, step-by-step `instructions`.
*   **Media Assets:** `videoUrl` for demo clips, `posterUrl` for thumbnail images, and `svgMarkup` which renders the posture's vector wireframe illustration directly in the UI.

---

## 📅 Guided Practice Sequences (`YOGA_ROUTINES`)

Routines structure poses into logical practice runs:

*   Displays difficulty, overall duration, target focus, and descriptive introductory summaries.
*   Maps a chronological sequence array containing referenced `poseId` fields alongside customized step-hold durations.
*   Tracking completes by posting records directly to the member's profile completions log.

---

## 🎥 Custom HTML5 Video Player

To avoid relying on generic external players, Quantum Yoga implements a customized HTML5 media overlay:

*   **Controls:** Clean custom progress scrubber bar, buffered media ranges, and Volume Sliders.
*   **Synchronization:** Displays elapsed duration vs total track runtime.
*   **Automated Events:** Listens to video termination handlers to instantly trigger routine completion records without requiring manual button clicks.
