# Paystack Test Mode Verification Report

## Scope and safety boundary

This report records evidence from isolated Test Mode learners only, except for one temporary visual billing-state check on the existing test learner. No live charge was created. Secret keys, access codes, payment tokens, card identifiers, and signed payloads are deliberately excluded.

## Credential-probe diagnosis and repair

The original credential probe did not indicate an expired key, incorrect environment variable, or a Live/Test mismatch. A direct authenticated request to the configured plan endpoint returned **HTTP 200** and a Test Mode plan matching the configured plan code. The probe failed only because Paystack responded in about 5.4 seconds, exceeding Vitest’s default five-second limit.

The test now sets a 12-second request abort and a 15-second test limit. The application’s Paystack client also now bounds all API calls with a 20-second abort so a checkout initialization cannot hang indefinitely. The repaired credential test passed.

## Successful Test Mode subscription evidence

| Evidence point | Direct result |
| --- | --- |
| Paystack verification | HTTP 200; Test Mode; transaction status `success`; amount NGN 1,500; channel `card`; gateway response `[Test] Approved` |
| Dashboard | Paystack’s Test Mode transaction list displayed the isolated learner payment as successful |
| Signed webhook | Server log recorded `charge.success` accepted with HTTP 200 for the second isolated successful checkout |
| Database change | The isolated learner changed from `free` to `pro`, received an expiry one month after payment, and received Paystack customer/subscription identifiers |

The successful user-entitlement transition occurred via the signed webhook path; no manual verification procedure was invoked for the isolated run.

## Cancellation evidence and repair

The confirmed cancellation call to `/subscription/disable` returned **HTTP 200** with `Subscription disabled successfully`. Paystack delivered a signed event named **`subscription.not_renew`** rather than `subscription.disable`. The server accepted that event with HTTP 200.

This exposed a real handler mismatch: the event was accepted but was not originally routed to the local cancellation persistence routine. The webhook handler now routes both `subscription.disable` and `subscription.not_renew` to `recordSubscriptionDisabled`. A focused regression test passes.

After the corrected cancellation run, the subscription row containing the Paystack subscription code transitioned to `status: cancelled` and `autoRenew: false`. The learner remains `pro` through the already-paid expiry date, which is the intended entitlement behavior after cancelling renewal.

The Test Mode event order also exposed a duplicate-row risk: `subscription.create` and `charge.success` could previously create separate records for one recurring payment. `recordVerifiedProPayment` now attaches a verified charge to an existing active recurring record for that user instead. A database-backed reconciliation regression test passes.

## Declined Test Mode evidence

| Evidence point | Direct result |
| --- | --- |
| Paystack verification | HTTP 200; Test Mode; transaction status `failed`; gateway response `Declined`; response code `05`; no paid timestamp |
| Isolated learner database state | Remained `free`; no expiry, no Paystack customer code, zero subscription rows, and zero active subscriptions |
| Hosted checkout state | Test Mode checkout returned to the payment-choice view with `Use another card` |

The decline correctly did not create an entitlement or subscription record.

## In-app decline UI boundary

The billing screen implements an `onError` state that renders Paystack’s message, with the fallback: `Paystack could not complete checkout. Please try again.` The existing test learner was temporarily set to `free` solely to reveal the in-app upgrade button, while its subscription IDs, dates, references, customer code, and expiry were preserved.

The Test Mode success dashboard showed no new fourth transaction for that existing learner, and the local database showed no new payment or webhook. The learner was therefore restored to the exact recorded local baseline: `subscriptionStatus: pro`, unchanged expiry **2026-09-19 22:26:41**, and the same two pre-existing subscription records.

The isolated learner cannot authenticate into ExamPilot’s OAuth session without a separate real login flow, so a truthful rendered ExamPilot `onError` screenshot was not obtained. This is the only unresolved evidence item; it is explicitly not represented as verified.

## Automated checks

The following focused checks pass:

| Check | Result |
| --- | --- |
| Paystack credential probe | Pass |
| Existing checkout handoff checks | Pass |
| `subscription.not_renew` webhook routing regression | Pass |
| Recurring-record reconciliation integration test | Pass |
| TypeScript `tsc --noEmit` | Pass |

## References

[1] [Paystack Transaction API — initialize and verify](https://paystack.com/docs/api/transaction/)

[2] [Paystack InlineJS — transaction callbacks and access-code handoff](https://paystack.com/docs/developer-tools/inlinejs/)

[3] [Paystack Webhooks](https://paystack.com/docs/payments/webhooks/)
