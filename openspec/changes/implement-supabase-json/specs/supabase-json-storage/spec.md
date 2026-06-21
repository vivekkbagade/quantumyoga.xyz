## ADDED Requirements

### Requirement: Supabase Data Storage Integration
The server backend MUST initialize a Supabase client using the `SUPABASE_URL` and `SUPABASE_KEY` environment variables, and persist/retrieve the application data using a hosted PostgreSQL database table.

#### Scenario: Retrieve database state
- **WHEN** a GET request is made to `/api/db`
- **THEN** the system SHALL fetch the application state JSON document from Supabase and return it with a 200 status code

#### Scenario: Update database state
- **WHEN** a POST request is made to `/api/db` with a valid JSON body representing the updated database state
- **THEN** the system SHALL overwrite the stored state in Supabase and return a success JSON response
