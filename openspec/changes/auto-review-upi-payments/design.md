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
*   **Parsing Utility:** Use a library or standard text parser in `server.js` to parse CSV or Excel data. It must read column headers to locate the UTR (typically under columns named "UTR", "Ref No", "Transaction ID", "Reference Number") and Transaction Amount.
*   **Deduplication:** When merging new transactions, query existing `upi_ledger` records by UTR to prevent duplicating imported transaction references.

## Risks / Trade-offs

*   **Risk:** Sync latency (students paying after the latest upload will not auto-verify until the next upload).
    *   *Mitigation:* Clearly notify the student during UTR submission that auto-verification runs against imported statements and may take time to verify, leaving the manual admin override active.
*   **Risk:** Spoofing or fake UTR guessing attacks.
    *   *Mitigation:* Once a UTR in the ledger is successfully matched and linked to an invoice, mark it as "linked" or remove it from the pool of unlinked ledger entries to prevent double-claiming.
