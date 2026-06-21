## Why

When converting a lead to a member or scheduling batched appointments, the app performs multiple sequential asynchronous database save requests to the server in a very short duration. Because the Mock DB middleware writes to `db.json` asynchronously, these concurrent POST requests create a race condition where earlier requests can overwrite later ones, resulting in newly converted users or billing records being missing from the persistent storage.

## What Changes

* **Sequential Database Save Queue**:
  * Introduce a concurrency lock queue pattern inside the `saveToServer()` function in `app.js` to ensure only one database save request is in-flight at any given time. Any concurrent save requests will be deferred and executed sequentially using the latest `localStorage` state.
* **Consolidated UI Event Handlers**:
  * Modify `convertLeadBtn` click event handler to commit all updates (users list and leads list) to `localStorage` before initiating a single `saveToServer()` request.
  * Modify private appointment scheduling handler to commit both appointments and billing payments updates to `localStorage` before triggering `saveToServer()`.

## Capabilities

### New Capabilities
* None

### Modified Capabilities
* None

## Impact

* **`app.js`**: Core state persistence logic (`saveToServer`) and handlers for lead conversion and appointment scheduling will be updated.
* **`db.json`**: Persistence behavior will become reliable and free of race conditions.
