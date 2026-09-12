# ExamPilot NG System Status and External Blocker Runbook

**Updated:** 22 August 2026 (Africa/Lagos)

## Active external blockers

| ID | Condition | Do not do | Safe response | Verification after recovery |
|---|---|---|---|---|
| EXT-01 | The learning provider has returned HTTP 412 capacity exhaustion for Tutor and structured question generation. | Do not present this as the learner’s connection problem. Do not retry repeatedly or seed fallback content. | Keep the server’s controlled temporary-unavailability response. Linked Practice/Mock Tutor sessions may use the stored verified answer/explanation fallback. | Run one controlled `practice.generate` request, one generic Tutor request, and one linked-question Tutor request. Confirm normal model output, no duplicate questions, and safe fallback tests remain green. |
| EXT-02 | The sandbox Paystack credential probe receives Cloudflare HTTP 403 before Paystack API credential validation. | Do not rotate keys, switch Live/Test environments, or initiate a payment merely to diagnose this response. | Treat it as an external WAF/network-path restriction. Keep payment secrets out of logs and reports. | Re-run only the read-only plan probe from an approved network path. Then record endpoint status and response shape without secrets. |

## Availability wording contract

The learner-safe availability state is:

> **This feature is temporarily unavailable, please try again later.**

It must not disclose provider names, HTTP details, stack traces, capacity metadata, secrets, tokens, or request headers. It must not say “check your connection” when the controlled service state is known.

## Billing pre-launch gate

Before any production transaction, the team must obtain evidence for: a staged successful Live Mode transaction; signed live webhook delivery; database entitlement reconciliation; cancellation through `/subscription/disable`; a safe failed/declined path; and rollback/retry instructions. Never rotate or print keys while preparing these checks.

## Review commands

```bash
pnpm validate
```

Run the external Paystack probe only as a separately documented network test. The application-owned regression suite must remain green regardless of its Cloudflare result.
