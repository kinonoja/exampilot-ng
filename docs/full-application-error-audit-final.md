# ExamPilot NG — Full Application Error Audit: Final Report

**Audit status:** Completed on 22 August 2026 (Africa/Lagos)  
**Scope:** Authenticated learner dashboard, Practice, Practice Mock, Tutor, billing, course direction, mock history, server contracts, error boundaries, automated tests, TypeScript, and development logs.  
**Deliberate non-actions:** No payment was initiated, cancelled, or otherwise altered. No practice answer, mock answer, or study record was intentionally changed during the final live checks. The LLM-generation action was not clicked during final live review because a capacity recovery could create question-bank records.

## Outcome

The audit identified and repaired **seven functional or safety-of-message defects**. The final verification run passed **69 tests across 27 test files** and `tsc --noEmit` completed without errors. The live authenticated dashboard and Practice Mock setup also loaded after the repairs.

This is an evidence-backed maintenance pass, not a claim that every possible production condition has been exhaustively simulated. In particular, third-party LLM capacity remains unavailable, so the friendly unavailable state was verified by focused regression coverage rather than by intentionally making another live LLM request.

## Repaired findings

| Severity | Finding | Root cause | Repair | Evidence |
|---|---|---|---|---|
| High | Dashboard could treat a transient tRPC transport failure as an authentication failure. | The auth query did not distinguish retryable network/gateway failures from an unauthenticated response. | Added up to two delayed retries for retryable transport failures, a dedicated connection-error state, and explicit `502`/`503`/`504` classification. | The authenticated dashboard recovered to its complete overview after a transient development-gateway `502`; focused helper coverage passes. |
| High | Practice Mock setup submitted five default subjects against a server limit of three. | Client default selection and server input contract differed. | Centralised `PRACTICE_MOCK_MAX_SUBJECTS = 3`; defaulted to three; disabled over-limit additions; provided a clear notice. | Live setup showed “Choose up to 3”, “Included subjects 3”, and a valid eligible-question count. The previous invalid `mock.start` request was not repeated. |
| Medium | Mock Pro access did not consistently respect subscription expiry. | Mock entitlement checked status only. | Applied the established expiry-aware paid-access helper to Mock entitlement. | Entitlement regression tests pass. |
| High | LLM exhaustion exposed raw upstream diagnostics in Tutor and practice generation. | Server mutations allowed the provider error to reach the tRPC client unchanged. | Added an availability boundary that maps capacity exhaustion to `SERVICE_UNAVAILABLE`, then maps it to concise learner-facing copy. | Focused server/client message tests pass; the dashboard now uses the shared safe generation message. |
| Medium | Failed Practice saves, Mock session operations, and billing cancellation could fail without a useful inline recovery path. | Mutation error states were not all rendered at their action points. | Added student-facing inline errors and retry guidance where applicable. | Regression suite passes; source audit confirms each mutation path has a visible error state. |
| Medium | The production error boundary exposed internal stack information. | The boundary rendered diagnostic stack data to the learner. | Replaced it with safe recovery guidance and a retry path. | Source and TypeScript validation pass. |
| Low | Dashboard copy named the underlying model provider. | Legacy product copy remained in the Topic Signals card. | Replaced it with product-neutral ExamPilot wording. | Final rendered dashboard reads: “ExamPilot can create three original practice questions in the same format as your question bank.” |

## Validation record

| Check | Result | Notes |
|---|---:|---|
| Full Vitest suite | Pass | 27 files, 69 tests. Includes new subject-limit, student-error, Mock-input, expiry-entitlement, and LLM-boundary coverage. |
| TypeScript | Pass | `pnpm check` completed with `tsc --noEmit`. |
| Live dashboard | Pass | Authenticated dashboard loaded to the complete study overview after the retry/error-state repair. |
| Live Practice Mock setup | Pass | Valid three-subject default rendered; no mock session was started. |
| Live Tutor/Generation outage message | Not invoked | The known usage-exhausted provider state was not re-triggered to avoid a possible content mutation if capacity had recovered. Focused automated coverage covers this condition. |
| Live billing cancellation failure path | Not re-triggered | No subscription/payment state was altered during this audit. Existing Paystack Test Mode evidence is retained in `docs/paystack-test-mode-evidence.md`. |

## Development-environment observation

The platform-managed development debug collector recorded request headers to the sandbox-local network log, including an `Authorization` bearer token. Its configured sensitive-field list includes `authorization`, but this fetch-header capture path currently stores headers before applying the sanitizer.

This is **not treated as a production application finding**: the log is confined to the managed sandbox development environment, and the collector is platform-managed code that was intentionally not modified during this app audit. It should nevertheless be treated as a platform privacy observation: development-log access should be restricted, and the platform collector should sanitize request and response headers before storage. No token value is reproduced in this report.

## Items intentionally deferred

| Item | Reason | Next decision |
|---|---|---|
| WAEC sample persistence | Fifteen approved original review samples remain held; no student-facing WAEC content has been inserted. | Confirm whether to persist the approved samples or request full reviewed batches. |
| NECO content | Official syllabus access remains a paid/restricted-material issue. | Obtain authorised source material before creating content. |
| LLM provider capacity | The generation service continues to return usage-exhausted responses. | Retry only after the service/account capacity is confirmed restored. |
| Platform debug collector | Platform-managed instrumentation; excluded from application code changes. | Raise through the platform support/security channel if development-log policy needs remediation. |

## Your review checklist

Please review these visible flows in the preview. The checks are short and do not require a payment.

1. **Dashboard:** Load `/dashboard`. It should show the normal overview; if you deliberately simulate a poor connection, it should show a connection-specific retry state rather than redirecting to sign-in.
2. **Practice Mock:** Open `/mock-exam`. Confirm the badge says **Choose up to 3**, exactly three subjects are selected initially, and trying to choose a fourth gives a clear limit notice.
3. **Practice:** Answer a question normally. If you encounter a network interruption while saving, the page should show an inline message with a retry path instead of silently failing.
4. **Tutor and question generation:** While LLM capacity is unavailable, any availability message should be plain student-facing guidance—not an HTTP 412 response, provider diagnostic, or stack trace.
5. **Billing:** If a cancellation request cannot complete, the page should display a clear inline error; do not cancel a real subscription solely for this check.
6. **Recovery state:** If a page genuinely crashes, the fallback should say that the page could not load and offer recovery guidance without exposing a stack trace.
7. **Branding copy:** On the Dashboard Topic Signals card, confirm the neutral **ExamPilot can create…** wording.

## How to reproduce validation locally

Run the following from the project root:

```bash
pnpm test
pnpm check
```

No migration was created or required for this repair pass.
