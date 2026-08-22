# Full Application Error Audit — Working Evidence

> This is a working evidence record for the requested audit. It is not a fix and does not change application behavior.

## Automated baseline

`pnpm test` passed: **23 test files, 61 tests**. `pnpm check` passed with `tsc --noEmit`.

## Reported dashboard transport failure

The current local `/api/trpc/auth.me` transport probe returns HTTP 200 in 0.002 seconds. The saved browser console contains a prior `TRPCClientError: Failed to fetch` followed a few seconds later by Vite reconnecting. Earlier entries also record Vite “server connection lost” events. This indicates a transient preview/dev-server transport interruption rather than a server-side authenticated `auth.me` response failure.

The current dashboard route has a real resilience defect: `useAuth()` sets `retry: false` for `auth.me`; `DashboardLayout` reads only `loading` and `user`, ignoring `error`. A transient `Failed to fetch` therefore renders the unauthenticated sign-in shell, even for an existing authenticated learner, with no retry or explanation.

## Confirmed Mock setup defect

The router schema permits 1–3 subjects, but the setup UI defaults to **all** returned JAMB subjects and its toggle permits any count. The current JAMB catalogue has more than three subjects, causing the recorded Zod error: `subjectIds` too big (maximum 3). The UI exposes the raw JSON-like validation message. This is a reproducible functional defect.

## Confirmed generation failure

The generation service retries a 412 exhaustion response four times and then returns the raw upstream message: `LLM invoke failed: 412 Precondition Failed – {"code":9,"message":"your account has hit a usage exhausted"}`. The dashboard renders that raw message directly. The cause is account-level structured-generation usage exhaustion, not a malformed topic request; the UI lacks a friendly unavailable state.

## Additional source-level error-handling gaps

* Dashboard profile, catalogue, and access query errors have no rendered error/retry state.
* Practice `submit` awaits `mutateAsync` with no catch and never renders `submitAttempt.error`; a failed answer save can be silent to the learner.
* Live Practice Mock does not render errors from position persistence, manual submit, or auto-expiry mutations.
* Billing cancellation has no visible `cancel.error` state; no payment logic was changed during this audit.

## Confirmed entitlement defect

`getPracticeMockEntitlement` grants mock access solely when `subscriptionStatus === "pro"`. Unlike Practice and Tutor, it does not consider `subscriptionExpiresAt`. Cancellation deliberately leaves a learner as Pro until the paid expiry, but there is no expiry-aware guard in Mock access and no scheduled status demotion in the audited path. Consequently, a user whose persisted status remains `pro` after expiry can still start Practice Mocks even after Practice and Tutor return to Free limits. Existing tests cover an expired Pro learner for Practice only; they do not cover expiry for Mock entitlement.

## Tutor outage handling

Tutor invokes the same LLM transport as generation. An upstream 412 therefore propagates as a raw `TRPCClientError` and the Tutor page renders the raw server/upstream message beneath the chat. This is a student-facing availability-message gap rather than a Tutor policy or conversation-state failure.

## Authenticated dashboard evidence

The test learner signed in successfully and `/dashboard` loaded all profile, catalogue, and entitlement data without a browser-visible fetch failure. Its live output confirms an additional product-data gap: the **Study rhythm** card is hard-coded as `Begin`, and **Topic signals** provides a topic selector rather than an actual weak-topic analysis. The page claims that “real topic trends appear as you practise,” but this screen makes no attempt or topic-performance query. This is classified as a non-blocking functional/product gap rather than a transport error.

## Authenticated Practice evidence

The Practice screen loaded without a transport or console-visible failure and made JAMB, Biology, Chemistry, English, Mathematics, and Physics selectable. No answer was selected or submitted in this audit, preserving the learner’s attempt history. The question panel was still resolving after the initial catalogue load; the follow-up screen check remains part of the live-flow pass.

## Authenticated Practice Mock evidence

The live setup screen confirms the Mock blocker directly: it auto-selects all **five** JAMB subjects, shows “Included subjects 5,” and enables the start path, although the protected router only permits 1–3 subject IDs. No mock was started, so the learner’s mock history remains unchanged. This is a high-impact reproducible client/server contract mismatch.

## Additional authenticated screens

Course Direction loaded all 46 courses, the permanent confirmation framing, and the IBASS link without an error state; no preference was selected or saved. Tutor rendered its entry form and mode explanation without error; no conversation was started, so Tutor usage and conversation history were unchanged.

Billing loaded the expected Pro status, expiry, and payment-history records without initiating checkout or cancellation. Mock History loaded completed sessions and result links without changing the learner’s saved mocks. The billing-screen source audit still identifies a missing visible cancellation-mutation error state, which is not exercised here because cancellation would change renewal status.

## Authenticated console and network evidence

The captured network log confirms the Mock setup submitted five subject IDs to `mock.start`, which returned HTTP 400 with the raw Zod maximum-three-items validation payload. The same log confirms `practice.generate` retried into a 412 usage-exhausted response, emitted HTTP 500, and exposed the upstream message and stack in the client-visible error body. These are direct, reproducible evidence for the planned client/server error-translation repairs.

## Post-fix verification

After the repair, the authenticated Practice Mock setup rendered **Choose up to 3**, selected exactly three subjects by default, reported **Included subjects 3**, and showed an eligible-question count of 32. The invalid five-subject start request was not repeated. No mock session was started during this check.

The repaired dashboard returned to its full authenticated overview after navigation, with no stale sign-in fallback and no new fetch error. Generation was not triggered because a successful capacity recovery could insert study content; the API boundary and student-message handling are covered by focused tests instead.

One transient 502 was recorded while the dev server reloaded updated modules. The browser recovered to the normal dashboard. Retry classification now includes HTTP 502, 503, and 504 in addition to browser-level `Failed to fetch` transport errors, so the same transient gateway behavior receives the dashboard retry path rather than an incorrect sign-in state.

The dashboard Topic Signals card was also corrected to product-neutral wording and now routes generation failures through the shared student-facing availability helper. The final rendered dashboard displayed the updated ExamPilot wording. See `docs/full-application-error-audit-final.md` for the complete finding, evidence, and review checklist.
