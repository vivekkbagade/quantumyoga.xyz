## Context

Currently, Quantum Yoga lacks automated transaction matching, requiring manual verification of UTR numbers. The introduction of an automated verification flow speeds up confirmations by checking student inputs against a verified bank transaction ledger imported manually by administrators from Excel or CSV files.

## Goals / Non-Goals

**Goals:**
*   Implement an automated matching process comparing student-submitted UTRs and invoice amounts against a local bank transaction ledger (`upi_ledger` in database state).
*   Transition payment status to `"paid"` instantly if a match is successfully identified.
*   Provide an administrative UI to upload bank statements (.xlsx, .xls, .csv formats) containing transaction details (UTR, amount, date, etc.).
*   Retain administrative manual approval as a fallback if automatic matching fails.

**Non-Goals:**
*   Integrating with live third-party bank APIs or external API-based synchronizations.
*   Automated refund handling or payment reversals.

## Decisions

### 1. Database Schema Extension
*   **Approach:** Maintain a `upi_ledger` array in the global state (`db.json` / Supabase state) to serve as the local cache of verified UPI payments.
*   **Structure:**
    ```json
    "upi_ledger": [
      { 
        "utr": "123456789012", 
        "amount": "1500", 
        "date": "2026-06-21", 
        "senderName": "Sarah Jenkins", 
        "details": "UPI/987654321/Vinyasa Coaching",
        "importedAt": "2026-06-21T18:00:00Z" 
      }
    ]
    ```

### 2. Auto-Review REST Endpoint
*   **Approach:** Add an API endpoint `POST /api/verify-upi` in `server.js`.
*   **Payload:** `{ invoiceId: string, utr: string, amount: string }`
*   **Logic:**
    *   Compare the UTR and amount against `upi_ledger`.
    *   If matched, update payment status to `"paid"`, save the transaction date, and trigger emails/WhatsApp messages. Return `{ success: true, status: 'paid' }`.
    *   If the UTR matches but the amount is different, update payment status to `"discrepancy"`.
    *   If no UTR match is found, update payment status to `"review"`. Return `{ success: false, status: 'review' }`.

### 3. Excel/CSV Ledger Upload API
*   **Approach:** Add a `POST /api/admin/upload-ledger` endpoint to process Excel/CSV bank statement files.
*   **Parsing Utility:** Use a basic CSV text parser in `server.js` to parse CSV data. It reads column headers to locate the UTR and Transaction Amount.
*   **Deduplication:** When merging new transactions, query existing `upi_ledger` records by UTR to prevent duplicating imported transaction references.

### 4. Planned Reconciliation Enhancements
*   **Fuzzy Amount Matching:** The endpoint comparison checks whether `Math.abs(ledgerAmount - invoiceAmount) < tolerance` where the tolerance is configurable (defaulting to ±₹0.05) to protect against rounding anomalies.
*   **Date Window Verification:** When a match is found in the `upi_ledger`, the system validates if `Math.abs(new Date(ledgerMatch.date) - new Date(invoice.date)) <= maxAgeMs` (defaulting to 30 days) before auto-approving.
*   **Statement Schema Mapping:** An administrative configuration object `upi_ledger_mapping` is saved to settings, allowing the parser to match dynamic header indices (e.g., column index 4 maps to `utr`, index 2 maps to `amount`).
*   **Reconciliation Log Audit:** A schema collection `upi_reconciliation_logs` is implemented to record matches, failures, invoice IDs, and timestamps.

## Risks / Trade-offs

*   **Risk:** Sync latency (students paying after the latest upload will not auto-verify until the next upload).
    *   *Mitigation:* Clearly notify the student during UTR submission that auto-verification runs against imported statements and may take time to verify, leaving the manual admin override active.
*   **Risk:** Spoofing or fake UTR guessing attacks.
    *   *Mitigation:* Once a UTR in the ledger is successfully matched and linked to an invoice, mark it as "linked" or prevent double-claiming by checking if the UTR was already associated with a paid invoice.
*   **Risk:** Re-use of old UTRs or stale statements.
    *   *Mitigation:* Apply the 30-day date window validation to ensure UTR claims are linked only to current transaction timelines.
