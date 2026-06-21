## Why

Currently, Quantum Yoga lacks any capability for prospective students to submit inquiries or for administrators to manage business leads. Adding a public lead capture form on the landing gate and a centralized leads management dashboard in the Admin Console allows the studio to capture interest, track follow-ups, and convert leads into registered members.

## What Changes

- **Public Lead Capture Form**: Add an inquiry form on the public fullscreen landing/login page to capture name, email, phone number, and inquiry message.
- **Admin Leads Dashboard**: Add a new "Leads Management" sub-tab and panel inside the Admin section to list, search, filter, and inspect incoming inquiries.
- **Lead Status & Notes**: Allow administrators to log follow-up notes and update lead statuses through a pipeline (New, Contacted, Converted, Closed).
- **Auto-Conversion**: Provide an action button to instantly register/convert a lead into a standard student account, pre-populating their details.

## Capabilities

### New Capabilities
- `leads-management`: Enables public inquiry capture and provides administrators with a tracking dashboard to manage lead pipelines, log follow-up notes, and convert inquiries into registered user accounts.

### Modified Capabilities

## Impact

- Modifies `index.html` to add the lead capture form on the landing gate and the leads management panel in the Admin dashboard.
- Modifies `app.js` to process lead submissions, persist leads data in LocalStorage under the key `qy_leads`, manage pipeline transitions, and auto-register converted users.
