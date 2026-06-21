## 1. Email Templates — `buildTransactionalEmailBody` (app.js)

- [x] 1.1 Add `"inquiry-received"` branch to `buildTransactionalEmailBody(template, data)` — return a branded HTML email with: Quantum Yoga header, greeting using `data.name`, confirmation message that their inquiry was received and the studio will be in touch within 24–48 hours, and a footer with the studio name
- [x] 1.2 Add `"lead-converted"` branch to `buildTransactionalEmailBody(template, data)` — return a branded HTML email with: Quantum Yoga welcome header, greeting using `data.name`, temporary password displayed in a styled code block (`data.tempPassword`), clear instruction to log in and change the password immediately, and a CTA button/link to the studio website

## 2. Subject Lines (app.js)

- [x] 2.1 Add `"inquiry-received"` key to the `subjects` map inside `sendTransactionalEmail()` — value: `"Thank you for your inquiry — Quantum Yoga"`
- [x] 2.2 Add `"lead-converted"` key to the `subjects` map — value: `"Welcome to Quantum Yoga — Your Account is Ready 🧘"`

## 3. Inquiry Form Trigger (app.js)

- [x] 3.1 In the `inquireForm` submit handler, after `saveLeads(leads)` and before `inquireForm.reset()`, call `sendTransactionalEmail("inquiry-received", { name, message }, email)` — use `await` inside the handler (make the handler `async`)

## 4. Lead Conversion Trigger (app.js)

- [x] 4.1 In the `convertLeadBtn` click handler, after `saveToServer()` and before the modal success message block, call `sendTransactionalEmail("lead-converted", { name: lead.name, tempPassword: generatedPassword }, lead.email)` — use `await` inside the handler (make the handler `async`)

## 5. Verification

- [x] 5.1 Confirm that `buildTransactionalEmailBody("inquiry-received", { name: "Test User", message: "Hello" })` returns a non-empty HTML string containing "Thank you" and the name
- [x] 5.2 Confirm that `buildTransactionalEmailBody("lead-converted", { name: "Test User", tempPassword: "abc123XY" })` returns HTML containing the temporary password
- [x] 5.3 Confirm that the `inquireForm` submit handler is `async` after the change and that the `sendTransactionalEmail` call appears after `saveLeads` in the code
- [x] 5.4 Confirm that the `convertLeadBtn` click handler is `async` after the change and that the `sendTransactionalEmail` call appears after `saveToServer()` in the code
