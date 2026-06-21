# WhatsApp Communication Spec

This capability governs the WhatsApp message templates, administrative configuration settings, API proxying, and automated alert dispatches for client/instructor updates.

## ADDED Requirements

### Requirement: WhatsApp System Settings
The system SHALL permit administrators to configure WhatsApp integration settings in the Admin System Settings panel, including a global toggle to enable/disable WhatsApp notifications, a provider API key input, and custom notification templates.

#### Scenario: Admin configures WhatsApp settings
- **WHEN** the admin visits the System Settings page, enters a valid API key, toggles "Enable WhatsApp Notifications" to active, and saves the settings
- **THEN** the system SHALL store the WhatsApp configuration keys in the database state and display a success indicator

### Requirement: Send Custom WhatsApp Message
The system SHALL provide a backend endpoint to dispatch WhatsApp message payloads through a configured provider (e.g. Twilio API or placeholder gateway) using templates with placeholder variables.

#### Scenario: Dispatch WhatsApp notification
- **WHEN** a system event triggers a notification (e.g., booking confirmation) and WhatsApp notifications are enabled
- **THEN** the system SHALL resolve the message placeholders and post the payload to the WhatsApp provider gateway endpoint

### Requirement: Admin Chat Shortcut Action
The system SHALL display a WhatsApp Chat shortcut button next to any member or lead phone number to allow admins to instantly launch a pre-populated chat using WhatsApp Web (`https://wa.me/`).

#### Scenario: Admin initiates WhatsApp chat
- **WHEN** the admin clicks the WhatsApp icon/button next to a member's phone number
- **THEN** the system SHALL open a new browser tab navigating to `https://wa.me/<phone_number>?text=<encoded_prepopulated_message>`
