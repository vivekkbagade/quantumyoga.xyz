## Context

Currently, Quantum Yoga lacks automated transaction matching, requiring manual verification of UTR numbers. The introduction of an automated verification flow speeds up confirmations by checking student inputs against a verified bank transaction ledger updated regularly (hourly/daily) or imported manually.

## Goals / Non-Goals

**Goals:**
*   Implement an automated matching process comparing submitted UTRs and invoice amounts against an inbound transactions list (`upi_ledger` in database state).
*   Transition payment status to `"paid"` instantly if a match is successfully identified.
*   Support periodic syncs (hourly/daily updates) of bank transactions into `upi_ledger`.
*   Provide an administrative UI to upload bank statements (CSV/Excel formats) containing UTR and amount columns.
*   Retain administrative manual approval as a fallback if automatic matching fails.

**Non-Goals:**
*   Live, synchronous P2P API calls to UPI merchant servers for each payment (relying instead on batch/ledger inputs).
*   Automated refund handling or payment reversals.

## Decisions

### 1. Database Schema Extension
*   **Approach:** Keep a `upi_ledger` array in the global state to serve as the local cache of imported bank-received UPI payments.
*   **Structure:**
    ```json
    "upi_ledger": [
      { "utr": "123456789012", "amount": "1500", "senderName": "Sarah Jenkins", "date": "2026-06-21", "importedAt": "2026-06-21T18:00:00Z" }
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

### 3. Ledger Synchronization & Upload API
*   **Approach:** Add `POST /api/admin/upload-ledger` to process CSV/Excel file uploads.
*   **Parsing Utility:** Write a parser function in `server.js` that maps bank-specific CSV rows (e.g., matching "UTR", "Ref No", or "Transaction ID" columns and "Amount" columns) into standard ledger JSON objects and merges them into `upi_ledger` without duplicates.
*   **Cron Synchronization:** Implement a background synchronization task in `server.js` (running hourly or daily) that queries the corporate bank statement API (e.g., ICICI Corporate API Banking or Setu Bank Statement API) using configured OAuth tokens/client certificates, extracts new incoming UPI UTR and amount records, and merges them into the `upi_ledger` cache.

## Risks / Trade-offs

*   **Risk:** Sync latency (payments made between updates won't auto-verify immediately).
    *   *Mitigation:* Clearly notify the student during UTR submission that auto-verification runs on an hourly/daily sync cycle and payments may take time to reflect, while leaving manual admin override active.
*   **Risk:** Spoofing or fake UTR guessing attacks.
    *   *Mitigation:* Once a UTR in the ledger is successfully matched and linked to an invoice, mark it as "linked" or remove it from the pool of unlinked ledger entries to prevent double-claiming.

