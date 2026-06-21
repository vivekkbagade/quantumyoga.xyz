## Context

Users who forget their password currently have no self-service recovery mechanism. We will add a "Forgot Password" trigger in the login card that opens a modal dialog, letting users submit their email to get a new temporary password on screen. Additionally, the application currently persists sessions indefinitely in `localStorage`. We will add a "Remember Me" checkbox to allow storing sessions in `sessionStorage` instead when persistence is not wanted.

## Goals / Non-Goals

**Goals:**
* Implement a "Forgot Password" modal and link on the login screen.
* Generate and store temporary passwords in the user array and sync with the mock server (`db.json`).
* Introduce a "Remember Me" checkbox to toggle session storage between `localStorage` (persistent) and `sessionStorage` (temporary).
* Support clean logout by purging session tokens from both storages.

**Non-Goals:**
* Building actual email sending backend endpoints (temporary passwords will be shown in the UI modal).

## Decisions

### 1. Forgot Password Modal Overlay
* **UI Trigger:** A small anchor link placed directly inside `#login-form` (adjacent to the password label/input).
* **Modal Structure:** Add `#forgot-password-modal` into `index.html`. It will match existing overlay modals (`#appointment-modal`, `#pose-modal`) using glassmorphism styling.
* **Flow:** 
  - Submit email → search the client-side users database.
  - If email is found: generate an 8-character password using the existing `generateRandomPassword(8)` function, update user records, commit to `localStorage`, execute `saveToServer()` once, and show a success message containing the temporary password.
  - If email is not found: render a styled error message.

### 2. Dual-Storage Session Architecture
* **Checking Session:** Modify `checkSession()` to look up the session token (`qy_session`) in both `localStorage` and `sessionStorage`:
  ```javascript
  const data = localStorage.getItem("qy_session") || sessionStorage.getItem("qy_session");
  ```
* **Saving Session:**
  - If "Remember Me" checkbox (`#login-remember`) is checked: save token in `localStorage`, remove from `sessionStorage`.
  - If unchecked: save token in `sessionStorage`, remove from `localStorage`.
* **Clearing Session:** On logout, remove `qy_session` from both `localStorage` and `sessionStorage`.

## Risks / Trade-offs

* **[Risk]** User could manually inject values into storage.
  * **[Mitigation]** The server database `/api/db` remains the source of truth, and startup session checking loads fresh data from the server.
* **[Risk]** Showing temporary passwords directly on-screen is a security bad practice.
  * **[Mitigation]** We will add a visual notice in the UI explaining that this is a simulated local test reset flow.
