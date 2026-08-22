# Paystack Live Launch Runbook

This runbook prepares production verification without changing secrets, rotating keys, or starting a payment automatically.

## Preconditions

The existing Test Mode evidence covers successful checkout, signed webhook handling, entitlement reconciliation, cancellation, and declined-card backend state. The following items remain separate: a rendered in-app authenticated decline flow and all Live Mode evidence.

| Gate | Required evidence | Stop condition |
|---|---|---|
| Authenticated Test Mode decline | A Free isolated learner sees a clear in-app declined-payment message and remains Free with no entitlement/subscription row. | Stop if the learner cannot authenticate, card details are required, or a payment window needs human input. |
| Staged Live Mode success | A deliberately approved low-risk live transaction, signed webhook `200`, Free→Pro state, payment-history row, and reconciliation check. | Stop for any mismatched amount, unverified signature, duplicate subscription, or database state mismatch. |
| Live cancellation | `/subscription/disable` success, accepted signed cancellation event, `autoRenew=false`, status `cancelled`, and paid access retained only through expiry. | Stop if the webhook event name or row mutation differs from the expected result. |
| Live failure path | Clear in-app payment failure copy; no Pro entitlement, expiry, or subscription record. | Stop if access changes or raw provider diagnostics are displayed. |

## Rules

Never print, commit, rotate, or request payment secrets in code. Never run a Live Mode transaction without explicit human confirmation immediately before checkout. Keep the payment reference, webhook event name, HTTP outcome, and redacted database-state evidence in the launch record.

## Current application-controlled result

The billing UI now maps a declined checkout to a clear message that the payment was not approved and that the plan has not changed. It clears the pending reference on cancellation or checkout failure so no stale verification action remains. Unit coverage verifies the decline, checkout-start, and verification-failure wording. This improves the application path; it does not replace the required human-authorised authenticated Test Mode decline capture.
