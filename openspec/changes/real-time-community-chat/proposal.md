## Why

Quantum Yoga currently lacks a live interaction channel for active members to communicate directly with instructors and peers. Adding a real-time community chat room will foster student engagement, enable instructors to share motivation instantly, and build a connected community.

## What Changes

*   Introduce a new WebSocket-enabled chat server module on the Express backend.
*   Create a clean, glassmorphic UI tab in the student and admin dashboards named "Community Chat".
*   Display real-time messages, user statuses, and user roles (Student vs. Administrator/Instructor).

## Capabilities

### New Capabilities
- `community-chat`: A real-time WebSocket-based community chat room allowing active students and instructors to chat, share motivation, and ask questions.

### Modified Capabilities
- `user-auth-profile`: User profiles will be integrated to map nicknames and avatars dynamically into active chat sessions.

## Impact

*   **Express Backend (`server.js`):** Will incorporate a WebSocket server (`ws`) handling live connection hooks, broadcast sessions, and safety limits.
*   **Frontend UI (`index.html` & `app.js`):** A new "Community Chat" navigation link and panel will render chat streams, message input, and list active users.
*   **Database:** A history log structure for the last 50-100 messages will persist chat feeds across socket restarts.
