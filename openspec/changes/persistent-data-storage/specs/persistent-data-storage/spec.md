## ADDED Requirements

### Requirement: Server-side Persistence REST Endpoint
The development server SHALL expose a REST API endpoint at `/api/db` that supports fetching (`GET`) and updating (`POST`) the persistent database file (`db.json`) on the backend filesystem.

#### Scenario: Fetching the database state
- **WHEN** a client performs a GET request to `/api/db`
- **THEN** the server SHALL return the JSON payload stored inside `db.json` with a 200 OK status code

#### Scenario: Saving the database state
- **WHEN** a client performs a POST request to `/api/db` with updated state JSON in the body
- **THEN** the server SHALL overwrite `db.json` on the filesystem with the body content and return a success JSON confirmation

### Requirement: Client-side LocalStorage and Backend Synchronization
The application client-side logic SHALL load the database state from `/api/db` on startup and sync it into browser LocalStorage. The client SHALL also automatically send a POST request to `/api/db` whenever user data, lead data, payments, appointments, or theme/system settings are modified.

#### Scenario: Client synchronization on app load
- **WHEN** the application is booted in the browser
- **THEN** the system SHALL perform a GET request to `/api/db` and override local storage keys (`qy_users`, `qy_leads`, `qy_payments`, `qy_batches`, `qy_appointments`, `qy_upi_settings`) with the backend state if database records are present

#### Scenario: Client synchronization on state mutation
- **WHEN** a user registers, toggles a favorite, creates an appointment, or an administrator updates a lead status
- **THEN** the system SHALL write the updated state locally and immediately send a POST request to `/api/db` containing the updated dataset
