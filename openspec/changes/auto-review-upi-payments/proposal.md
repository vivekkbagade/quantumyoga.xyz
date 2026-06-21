## Why

Currently, when a student submits a payment reference (UTR), the status is set to "Under Review". Administrators must then manually verify the UTR and amount, and approve the payment to transition it to "Paid". Automating this verification by comparing student-submitted UTRs and transaction amounts against a trusted ledger of received UPI transactions will reduce administrative workload and speed up confirmation times.

## What Changes

*   **Automated UTR Matching Engine:** Integrate Setu's Bank Statement API using active API credentials (client ID, client secret, and product keys) to fetch and verify UPI UTR and amount details on a regular scheduled basis (hourly/daily).
*   **Auto-Approve Action:** If a submitted UTR matches an unlinked entry in the received UPI transactions ledger with the exact same amount:
    *   Transition the payment status directly from `pending`/`review` to `paid`.
    *   Automatically link the transaction and record the payment date.
    *   Directly trigger `payment-approved` email and WhatsApp notifications containing the verified UTR.
*   **Flag Discrepancies:** If the UTR matches but the amount is different, flag the payment as `"discrepancy"` (or keep as `"review"` with a warning flag) and notify the administrator.
*   **Manual/Fallback Interface:** Retain the administrative override tools to manually approve payments if automated verification fails or cannot find the UTR.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `billing-payments`: Automates transaction verification and approval triggers upon student UTR submission.

## Impact

*   **Database Schema:** Extend payment records to store verification metadata (e.g. `verifiedAt`, `verificationSource`). Add a model for imported bank UPI ledger entries.
*   **Frontend logic (`app.js`):** Modify UTR submission callbacks to invoke the auto-review endpoint and instantly show success if auto-approved, or prompt that it's under review if no match is found. Add an admin interface to upload ledger files (CSV/Excel) manually. Add configuration fields in Admin Settings for Setu API credentials.
*   **Backend server (`server.js`):** Add a POST `/api/verify-upi` endpoint to process UTR and amount comparisons, a POST `/api/admin/upload-ledger` endpoint for manual ledger imports, and a background cron scheduler to sync ledger inputs periodically (hourly/daily) via Setu API endpoints.
