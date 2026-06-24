# Community Chat & WebSockets

Quantum Yoga includes a real-time community chat room where students and instructors can interact. This feature is powered by a co-hosted WebSocket server running on the same port as the main HTTP application.

---

## 🔌 WebSocket Co-Hosting Architecture

To simplify deployment and avoid CORS/firewall complications, the WebSocket server is bound to the existing HTTP server instance:

```javascript
import ws from 'ws';
// ...
const server = app.listen(PORT, ...);
const wss = new ws.WebSocketServer({ server });
```

This configuration enables the WebSocket server to share port `80` (or `8080` in development) with Express. Clients connect using the relative protocol matching the page loading protocol:
*   `ws://<host>` for insecure HTTP connections.
*   `wss://<host>` for secure HTTPS connections.

---

## 📨 Message Protocol & Schemas

The client and server communicate via JSON-encoded string payloads. Below are the primary event types:

### 1. User Join (`join`)
**Direction:** Client ➔ Server  
Sent immediately after the connection is opened to register the user's name and role.
```json
{
  "type": "join",
  "name": "Jane Doe",
  "role": "Student" // or "Admin" for instructors
}
```

### 2. Message History (`history`)
**Direction:** Server ➔ Client  
Sent to the joining user immediately after registering. Contains the last 50 archived chat messages.
```json
{
  "type": "history",
  "messages": [
    {
      "id": "msg-1718000000000-123",
      "name": "Instructor Vivekk",
      "role": "Admin",
      "text": "Welcome to the class! Here is your daily motivation.",
      "timestamp": "2026-06-25T00:00:00.000Z"
    }
  ]
}
```

### 3. Send Message (`message`)
**Direction:** Client ➔ Server ➔ Broadcast to All Clients  
When a user submits a message, the client packages the input:
```json
{
  "type": "message",
  "name": "Jane Doe",
  "role": "Student",
  "text": "Hello, excited for the yoga flow!"
}
```
The server intercepts this, creates a message object with a unique ID and ISO timestamp, saves it to the unified database state, and broadcasts the structured event:
```json
{
  "type": "message",
  "message": {
    "id": "msg-1718000050000-456",
    "name": "Jane Doe",
    "role": "Student",
    "text": "Hello, excited for the yoga flow!",
    "timestamp": "2026-06-25T00:00:50.000Z"
  }
}
```

### 4. Active Online Users (`users`)
**Direction:** Server ➔ Broadcast to All Clients  
Sent whenever a client joins or disconnects (closes connection) to refresh the online users panel.
```json
{
  "type": "users",
  "users": [
    { "name": "Instructor Vivekk", "role": "Admin" },
    { "name": "Jane Doe", "role": "Student" }
  ]
}
```

---

## 💾 Storage & Persistence

Chat history is persisted in the unified database (`state.chatMessages` array) using the selected adapter (PostgreSQL, Supabase, or local `db.json` fallback).
*   **Capacity Limit:** The server caches and stores up to **50 messages**.
*   **Rotation:** When a new message arrives, if the history size exceeds 50, the oldest message is dropped (`slice(-50)`).

---

## 🛡️ Security & UX Controls

1.  **XSS Protection:** Client renders text securely. HTML tags within incoming chat messages are escaped using `escapeHtml()` in `app.js` prior to DOM insertion:
    ```javascript
    function escapeHtml(text) {
      return text.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      })[m]);
    }
    ```
2.  **Auto-Scroll:** The message container automatically scrolls down to display incoming messages if the user is active in the chat tab.
3.  **Role Styling:** Message headers are styled differently depending on the role (`Admin`/Instructors receive a gold-highlighted name and an `Instructor` badge; `Students` receive a standard student badge).
