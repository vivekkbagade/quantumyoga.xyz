# Quantum Yoga System Architecture

This document provides visual diagrams and detailed descriptions of the system architecture, workflows, and communication sequences between the frontend application ([app.js](file:///d:/QuantumYogaWebsite/app.js)) and the backend server ([server.js](file:///d:/QuantumYogaWebsite/server.js)).

---

## 1. Container & Component Architecture

This diagram illustrates the separation between the client-side user interface and the server-side components, including data storage paths.

```mermaid
graph TD
    subgraph Client ["Client (User Browser)"]
        UI["UI / DOM Events"]
        App["app.js (Frontend Controller)"]
        LS[("Local Storage (qy_*)")]
    end

    subgraph Transport ["Communication Protocols"]
        HTTP["HTTP / HTTPS (/api/db)"]
        WS["WebSockets (/api/ws)"]
    end

    subgraph Server ["Backend (Node.js & Express)"]
        ServerJS["server.js (Express Server)"]
        ExpressApp["Express App Middleware"]
        WSS["WebSocketServer (wss)"]
    end

    subgraph Database ["Persistence Layer"]
        PG[(PostgreSQL Pool)]
        Supa[(Supabase Client)]
        JSONDb[(Local db.json Fallback)]
    end

    %% Client Interactions
    UI <--> App
    App <--> LS

    %% Transport Connections
    App <--> HTTP
    App <--> WS
    HTTP <--> ExpressApp
    WS <--> WSS
    ExpressApp <--> ServerJS
    WSS <--> ServerJS

    %% Server to Database Connections
    ServerJS --> PG
    ServerJS --> Supa
    ServerJS --> JSONDb
```

---

## 2. Data Synchronization Workflow

This workflow diagram describes how local changes are queued and synced to the server using the `isSaving` and `hasPendingSave` state machine flags to prevent parallel request overlap.

```mermaid
flowchart TD
    Start([User Triggered Action]) --> UpdateLocal[Update localStorage qy_*]
    UpdateLocal --> CheckSaving{Is a save currently in progress?}
    
    CheckSaving -- Yes --> SetPending[Set hasPendingSave = true] --> End([Wait for current save to finish])
    
    CheckSaving -- No --> SetSaving[Set isSaving = true]
    SetSaving --> FetchState[Gather all qy_* states from localStorage]
    FetchState --> POST[POST payload to /api/db]
    
    POST --> Complete{POST Request Finished?}
    
    Complete -- Success --> ClearSaving[Set isSaving = false]
    Complete -- Failure --> LogWarn[Log Warning / Fallback to local] --> ClearSaving
    
    ClearSaving --> CheckPending{Is hasPendingSave true?}
    
    CheckPending -- Yes --> ResetPending[Set hasPendingSave = false] --> SetSaving
    CheckPending -- No --> Done([Sync Complete])
```

---

## 3. Communication & Operations Sequence

This sequence diagram depicts startup synchronization, database persistence, and WebSocket real-time chat operations.

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant App as app.js (Frontend)
    participant LS as Local Storage
    participant Srv as server.js (Express & WS Server)
    participant DB as Persistence Layer (PG/Supa/db.json)

    Note over User, DB: Startup & Initialization
    User->>App: DomContentLoaded
    App->>LS: Seed initial mock data if empty
    App->>Srv: GET /api/db
    Srv->>DB: Fetch state
    DB-->>Srv: Return state
    Srv-->>App: JSON Database Payload
    App->>LS: Update local keys (qy_users, qy_payments, etc.)
    App->>User: Refresh UI & Render Tables

    Note over User, DB: Data Persistence Action
    User->>App: Submits invoice payment or updates profile
    App->>LS: Save updated records
    App->>Srv: POST /api/db (JSON Payload)
    Srv->>DB: Write/Update records
    DB-->>Srv: Confirm Write
    Srv-->>App: HTTP 200 OK
    
    Note over User, DB: Real-Time Chat (WebSockets)
    App->>Srv: Connect to ws/wss://[host]/api/ws
    Srv-->>App: WebSocket Upgrade Success
    App->>Srv: Send chat register message
    Srv->>Srv: Map socket to client (connectedUsers)
    User->>App: Type and send chat message
    App->>Srv: Send chat message (WebSocket JSON)
    Srv->>Srv: Broadcast message to all active clients
    Srv-->>App: Receive broadcasted chat message
    App->>User: Render message in chat UI
```
