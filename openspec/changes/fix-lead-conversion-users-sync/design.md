## Context

The front-end application saves different data slices (users, leads, payments, appointments) separately. Each slice has its own helper (e.g., `saveUsers`, `saveLeads`) which updates `localStorage` and then triggers `saveToServer()`. `saveToServer()` reads all keys from `localStorage`, creates a consolidated database payload, and makes a POST request to `/api/db` to update `db.json`.

When events update multiple database slices consecutively (e.g. lead conversion updates `users` and `leads` lists; appointment scheduling updates `appointments` and `payments` lists), multiple asynchronous POST requests are fired in parallel. On the server side, these requests write to `db.json` concurrently. Whichever request finishes last overwrites the file, leading to the loss of data written by other concurrent requests.

## Goals / Non-Goals

**Goals:**
* Ensure that all data saved to `localStorage` is reliably and sequentially persisted in `db.json`.
* Prevent race conditions where concurrent network updates overwrite each other.
* Keep the data synchronization model simple and lightweight.

**Non-Goals:**
* Implementing complex server-side transactional locking or database management systems.
* Refactoring the entire front-end state management.

## Decisions

### 1. In-Flight Save Queue Lock in `saveToServer`
We will implement a simple concurrency lock queue in `saveToServer()` in `app.js` using state flags:
* `isSaving`: A boolean flag indicating a save request is in-progress.
* `hasPendingSave`: A boolean flag indicating another save request was triggered while one was in-flight.

If `saveToServer()` is called while `isSaving` is true, we set `hasPendingSave = true` and return early. When the active request finishes (in a `finally` block), we check `hasPendingSave`. If true, we reset the flag and call `saveToServer()` again. Because `saveToServer()` constructs the database payload by reading `localStorage` synchronously at the start of execution, the queued request will always fetch the most up-to-date client state.

### 2. Consolidated UI Saves
In handlers that perform multiple updates in a single user transaction (such as `convertLeadBtn` click handler and private coaching appointment scheduling), we will write the changes to `localStorage` synchronously and then invoke `saveToServer()` once at the end, minimizing redundant network calls.

## Risks / Trade-offs

* **[Risk]** If a network request hangs indefinitely, the lock might remain active and block future saves.
  * **[Mitigation]** The `finally` block will guarantee that `isSaving` is set to `false`. We will also ensure errors are caught and logged appropriately so the queue doesn't lock up on network failures.
