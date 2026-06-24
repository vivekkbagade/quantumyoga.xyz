## 1. Backend Server Setup

- [ ] 1.1 Integrate WebSocket server (`ws`) package in `server.js` and bind it to the main HTTP server
- [ ] 1.2 Implement connection hooks, connection counting, and active user tracking
- [ ] 1.3 Implement message broadcast logic and message schema verification

## 2. Storage & History Cache

- [ ] 2.1 Integrate chat messages cache structure into database adapters (local `db.json`, PG/Supabase)
- [ ] 2.2 Write retrieval logic to load and send last 50 messages on user join
- [ ] 2.3 Write message archiving logic to push new incoming messages into database state and slice over limit

## 3. Frontend Chat UI Layout

- [ ] 3.1 Create "Community Chat" tab in `index.html` navigation bar and content section
- [ ] 3.2 Implement glassmorphic message thread layout, user list, and chat input controls
- [ ] 3.3 Add active user connection lifecycle updates to UI client script in `app.js`

## 4. Chat Client Websocket Integration

- [ ] 4.1 Implement WebSocket client setup and connection handlers in `app.js`
- [ ] 4.2 Implement outbound message packaging (sending name, role, body, timestamp)
- [ ] 4.3 Implement inbound message parsing and DOM insertion for message updates and online user list
