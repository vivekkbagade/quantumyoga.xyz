## Context

The Quantum Yoga application currently runs an Express-based server backend to handle APIs and static asset delivery. To add real-time community chat capability, we must incorporate a bi-directional messaging solution. We will use the existing `ws` npm dependency to run a WebSocket server co-hosted on the main HTTP server port.

## Goals / Non-Goals

**Goals:**
*   Implement a WebSocket connection endpoint co-hosted with the Express API server.
*   Store the last 50 messages locally (in `db.json` or database pools) to maintain history during app restarts.
*   Introduce a new glassmorphic "Community Chat" tab in the frontend layout.
*   Broadcast message streams, connection lists, and message history feeds securely.

**Non-Goals:**
*   Implementing private 1-on-1 direct messaging (only a single shared community room is in scope).
*   Rich text messaging or file uploads (text-only messages are supported).
*   Chat moderation tools (mute, ban, block) or user reporting.

## Decisions

### 1. Unified HTTP & WebSocket Co-Hosting
*   **Choice:** Co-host the WebSocket server (`ws`) on the same Express server port using Node's standard `http` server instance.
*   **Rationale:** Avoids configuring additional ports, simplifying firewall setups and avoiding browser mixed-content/CORS errors in production VM environments.
*   **Alternative:** running a standalone WebSocket server on a separate port (e.g. 8081). Rejected because it requires configuring extra VM port mappings and inbound security group rules.

### 2. Memory/Database Message Cache
*   **Choice:** Cache the last 50 messages in the active database state (`db.json` / postgres).
*   **Rationale:** Keeps the chat history lightweight while ensuring messages persist when the PM2 process reloads or redeploys.

## Risks / Trade-offs

*   **[Risk] Out-of-memory or database size inflation:** Storing message feeds could bloat database sizes.
    *   *Mitigation:* Enforce a strict buffer size (limit to maximum 50 messages, slicing old messages when new ones arrive).
*   **[Risk] Unauthenticated spam:** Socket connections could be opened anonymously.
    *   *Mitigation:* Validate session info or require user logins before broadcasting messages.
