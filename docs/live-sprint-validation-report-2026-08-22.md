# ExamPilot NG — Live Sprint Validation Report

**Date:** 22 August 2026 (Africa/Lagos)  
**Environment:** Authenticated, production-like preview session  
**Validation posture:** Read-only wherever an action could alter learner attempts, mock sessions, course preferences, payment state, or question-bank content.

## Compact status

| Priority | Status | Summary |
|---|---|---|
| 1. Critical bug fixes | **PASS, with external generation dependency blocked** | The Mock selection blocker is repaired. Generation correctly hides upstream diagnostics; the actual generation provider remains unavailable. |
| 2. Content visibility | **PASS** | Chemistry and Physics each have 48 stored JAMB records, load in live Practice, and are selectable in Mock setup. |
| 3. Core regression | **PARTIAL PASS** | App-owned tests and read-only live screens pass. Tutor live generation is blocked by the external provider; the external Paystack credential probe is Cloudflare-blocked. |
| 4. Functional / UX follow-up | **NO NEW APP DEFECT FOUND** | The earlier full audit’s identified issues are repaired. No additional product change was made in this tier. |

## Priority 1 — Critical bug fixes

### 1.1 Practice Mock subject limit

**Issue.** The setup UI selected all five subjects by default, while `mock.start` allows at most three `subjectIds`; a start attempt therefore returned the Zod `too_big` error.

**Change.** The shared `PRACTICE_MOCK_MAX_SUBJECTS = 3` contract now drives both the protected input and the setup UI. The UI defaults to three subjects, presents **Choose up to 3**, disables over-limit selection, and provides a learner-facing notice rather than exposing schema details.

**Evidence.** The live `/mock-exam` setup rendered Biology, Chemistry, English, Mathematics, and Physics; showed **Included subjects 3** and **Eligible questions 32**; and did not make the previously invalid request. The focused regression file `client/src/lib/mockSubjectSelection.test.ts` and protected input test `server/mockExamRouter.input.test.ts` pass.

**Outcome: PASS.** The explicit pass criteria are met: the page starts from a valid three-subject configuration and the client prevents an invalid fourth selection.

### 1.2 Question Generation unavailable message

**Issue.** The upstream generation provider remains unavailable. Prior behavior exposed provider diagnostics, including a `412` usage-exhausted response.

**Change.** The server availability boundary now returns exactly: **“This feature is temporarily unavailable, please try again later.”** The client uses the same safe copy when recognising an exhausted LLM response. No raw status, provider payload, or stack trace is displayed in the student interface.

**Evidence.** The reported mutation at **2026-08-22 00:50:01 Africa/Lagos** produced the safe application message. The updated `server/routers.ts` boundary and `client/src/lib/studentErrorMessage.ts` helper pass `server/routers.llmAvailability.test.ts` and `client/src/lib/studentErrorMessage.test.ts` (5 focused tests). The raw upstream condition remains documented in `docs/generation-unavailability-diagnosis-2026-08-22.txt`.

**Outcome: PASS for safe failure handling; BLOCKED for live question generation.** The application-side error disclosure issue is fixed. A successful generation cannot be confirmed until the external provider is available.

### 1.3 Other critical audit findings

The dashboard transient transport recovery, Mock expiry-aware Pro entitlement, mutation-error recovery states, and safe error-boundary copy were repaired in the preceding checkpoint. Evidence and regression mapping are retained in `docs/full-application-error-audit-final.md`.

**Outcome: PASS.** No additional critical application-controlled finding was identified in this pass.

## Priority 2 — Content visibility and setup validation

| Check | Evidence | Outcome |
|---|---|---|
| Chemistry stored and visible | Read-only database result: 48 Chemistry rows, all marked AI-generated. Live Practice loaded an **Air, Water and Environmental Chemistry** question with four answer controls. | **PASS** |
| Physics stored and visible | Read-only database result: 48 Physics rows, all marked AI-generated. Live Practice loaded a **Simple Machines** question with four answer controls. | **PASS** |
| Chemistry selectable in Mock | Chemistry card displayed **48 approved AI questions** at live `/mock-exam` setup. | **PASS** |
| Physics selectable in Mock | Physics card displayed **48 approved AI questions** at live `/mock-exam` setup. | **PASS** |

No answer was selected or submitted during these checks, so the learner’s attempt data did not change. Supporting step-by-step notes are in `docs/live-sprint-validation-notes.md`.

## Priority 3 — Core regression pass

| Flow | Validation | Result | Blocker / note |
|---|---|---|---|
| Authenticated session | Existing learner session loaded Dashboard, Practice, Mock, Course Direction, Billing, and Mock History. `server/auth.logout.test.ts` passes. | **PASS** | This is an existing authenticated-session check, not a new-account signup. |
| Practice catalogue | All five JAMB subjects rendered in the live selector; Chemistry and Physics question controls loaded. | **PASS** | Answers not submitted to preserve learner data. |
| Tutor modes, switching, explain-question, Free limit | `server/tutor.policy.test.ts` and `server/tutor.service.test.ts` pass. | **BLOCKED LIVE** | Live Tutor generation uses the unavailable external provider; no conversation was started. |
| Mock setup, persistence, scoring, results, history | `server/mockExam.test.ts`, `server/mockExamRouter.test.ts`, `client/src/lib/mockSessionRecovery.test.ts`, and `client/src/lib/mockTimer.test.ts` pass. Live history rendered scored/elapsed records and result links. | **PASS** | No new mock was started in the live account. |
| Paystack billing UI | Live Billing displayed active Pro status, expiry, controls, and history without mutation. Billing, webhook, handoff, signature, and reconciliation tests pass. | **PARTIAL PASS** | The standalone credential probe received a Cloudflare HTML 403 before API credential validation; repeated with a user-agent, same response. |
| Course onboarding | Live catalogue, target-university options, permanent verify wording, and IBASS link loaded. Course-direction router/catalogue tests pass. | **PASS** | No preference saved. |

**Regression command evidence.** `pnpm vitest run --exclude server/paystack.credentials.test.ts && pnpm check` passed: **26 test files, 68 tests, TypeScript clean**. The inclusive `pnpm test` result was **26 files/68 tests passed and one external Paystack probe failed**.

## Priority 4 — Functional and UX follow-up

The previously confirmed functional and error-handling issues were already repaired in the audit checkpoint. This priority found no new application-controlled defect that could be safely changed within the requested scope. The only new blockers are external service conditions: generation-provider unavailability and the Paystack Cloudflare probe response.

## Explicit exclusions respected

No WAEC batch generation, NECO/NABTEB content work, Paystack Live Mode operation, 180-question Mock work, or declined-card wording work was performed.

## Blockers and next steps

| Blocker | What is needed | Safe follow-up |
|---|---|---|
| Question generation provider unavailable | External service capacity must recover. | Re-run one controlled generation request, then verify inserted-question structure and student UI. |
| Paystack test credential probe Cloudflare 403 | Paystack endpoint must allow the sandbox network path or the probe must run from an authorised network. | Re-run only the non-transactional plan probe; do not initiate checkout or alter a subscription. |
| Live Tutor mode flow | Depends on the same generation provider. | After recovery, use an isolated test learner for both Tutor modes and Free-limit verification. |

## Evidence index

| Artifact | Purpose |
|---|---|
| `docs/live-sprint-validation-notes.md` | Timestamped, non-mutating live screen evidence. |
| `docs/full-application-error-audit-final.md` | Prior completed audit findings and repair record. |
| `docs/generation-unavailability-diagnosis-2026-08-22.txt` | Sanitized diagnostic records for the reported generation error. |
| `client/src/lib/studentErrorMessage.test.ts` | Learner-facing availability-message regression coverage. |
| `server/routers.llmAvailability.test.ts` | Server LLM availability boundary coverage. |
| `server/mockExamRouter.input.test.ts` | Mock max-three-subject contract coverage. |
