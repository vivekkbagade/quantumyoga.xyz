## Context

Instead of a dynamic form submitting leads to a database CRM, the user wants a simple, accessible contact info panel presenting the physical address, phone number, and email ID of the yoga studio.

## Goals / Non-Goals

**Goals:**
* Add a "Contact Us" link in the header navigation and footer.
* Display the physical address, phone number, and support email ID in a glassmorphic modal overlay (`#contact-us-modal`).
* Make telephone and email fields clickable with direct `tel:` and `mailto:` protocol schemas.

**Non-Goals:**
* Dynamic database/leads submission logic or server endpoints.

## Decisions

### 1. Modal-based Contact Card
* **Decision**: Build a static, glassmorphic card modal `#contact-us-modal` triggered via navigation links.
* **Rationale**: Offers a clean popup view without loading forms or requiring database inserts, keeping page performance lightweight.

## Risks / Trade-offs

* **Risk**: Stale contact details.
  * *Mitigation*: Maintain contact details in standard static HTML/CSS variables for easy updates.
