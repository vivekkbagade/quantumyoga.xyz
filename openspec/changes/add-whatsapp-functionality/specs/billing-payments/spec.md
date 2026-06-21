# Billing, Invoices & Payments Delta Spec

## ADDED Requirements

### Requirement: WhatsApp Invoice Reminders
The system SHALL support sending automatic invoice notifications and overdue alerts via WhatsApp when a new invoice is created or becomes overdue, containing details like Invoice ID, due date, amount, and the direct payment link.

#### Scenario: Send invoice notice on creation
- **WHEN** a new invoice is issued for a member and WhatsApp notifications are enabled
- **THEN** the system SHALL send a WhatsApp message to the member's phone number containing the invoice details and payment link
