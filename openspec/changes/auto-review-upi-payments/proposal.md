## Why

Currently, when a student submits a payment reference (UTR), the status is set to "Under Review". Administrators must then manually verify the UTR and amount, and approve the payment to transition it to "Paid". Automating this verification by comparing student-submitted UTRs and transaction amounts against a trusted ledger of received UPI transactions will reduce administrative workload and speed up confirmation times.

## What Changes

*   **Automated UTR Matching Engine:** Integrate an Excel/CSV bank statement ledger uploader. Administrators can upload their raw UPI transaction statements containing columns for UTR, Transaction Amount, Transaction Date, and other transaction details to construct the internal trusted verification store.
*   **Auto-Approve Action:** If a submitted UTR matches an unlinked entry in the received UPI transactions ledger with the exact same amount:
    *   Transition the payment status directly from `pending`/`review` to `paid`.
    *   Automatically link the transaction and record the payment date.
    *   Directly trigger `payment-approved` email and WhatsApp notifications containing the verified UTR.
*   **Flag Discrepancies:** If the UTR matches but the amount is different, flag the payment as `"discrepancy"` (or keep as `"review"` with a warning flag) and notify the administrator.
*   **Reconciliation Enhancements:**
    *   **Fuzzy Amount Matching:** Reconcile transaction differences within a small tolerance margin (e.g. ±₹0.05).
    *   **Date Window Verification:** Enforce that matched transaction dates are within a 30-day window to prevent reuse of old references.
    *   **Schema Mapping:** Support dynamic header mappings for CSV statement uploads.
    *   **Audit Logging:** Keep logs of matching matches, discrepancies, and resolutions.
*   **Manual/Fallback Interface:** Retain the administrative override tools to manually approve payments if automated verification fails or cannot find the UTR.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `billing-payments`: Automates transaction verification and approval triggers upon student UTR submission.

## Impact

*   **Database Schema:** Extend payment records to store verification metadata (e.g. `verifiedAt`, `verificationSource`). Add a schema model for stored bank statement transaction ledger entries and a model for reconciliation audit logs.
*   **Frontend logic (`app.js`):** Modify UTR submission callbacks to invoke the local verification logic and instantly show success if auto-approved, or show it is under review if no match is found. Add an administrative dashboard interface to upload bank statement files (.xlsx, .xls, .csv) and configure CSV column maps.
*   **Backend server (`server.js`):** Add a POST `/api/verify-upi` endpoint to process UTR and amount comparisons, and a POST `/api/admin/upload-ledger` endpoint to parse Excel/CSV statements, apply dynamic column mapping, and log activities to the audit log.

