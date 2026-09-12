# ExamPilot NG — Complete Project Issue Register

**Prepared:** 22 August 2026 (Africa/Lagos)  
**Current engineering checkpoint:** `b8c1a83f`  
**Current app-owned validation:** 31 Vitest files / 80 tests passed, plus `tsc --noEmit` passed. The external Paystack credential probe is excluded from that app-owned result because a Cloudflare response blocks the sandbox before Paystack API credential validation.  
**Purpose:** This is a technical handoff for another engineering agent. It separates defects that are **solved**, blockers that are **still active**, intentional limitations that are **not yet product-complete**, and areas that are **not verified**. It does not claim a production security, performance, or accessibility certification.

## How to read this register

| Status | Meaning | Required interpretation |
|---|---|---|
| **Solved** | A defect was changed in application code and has current automated and/or live evidence. | Do not reopen it without a new reproduction. |
| **Active external blocker** | The app handles the condition, but an outside dependency prevents the feature from completing normally. | Do not misdiagnose it as a student-device or application-code issue. |
| **Known product limitation** | The current product deliberately lacks this capability or has incomplete coverage. | Treat it as roadmap work, not a passing feature. |
| **Unverified** | No failure is proven, but the required evidence has not been obtained. | Do not claim production readiness for that behavior. |
| **Platform observation** | A managed platform behavior outside the application code was observed. | Document/escalate; do not patch app logic to conceal it. |

## Executive status

> **Status update — maturity pass completed on 22 August 2026:** public claims are now JAMB-live truthful; board-specific empty states, payment failure wording, critical-flow correlation IDs, explicit validation scripts, and next-agent runbooks are in place. Active provider capacity, payment authorisation evidence, full mock format, board content, live institution validation, and formal accessibility/operational testing remain open as documented in [`AGENT_COMPLETION_REPORT_2026-08-22.md`](./AGENT_COMPLETION_REPORT_2026-08-22.md).

| Area | Current status | Practical consequence |
|---|---|---|
| Core JAMB practice, short Practice Mock, Course Direction, billing UI | **Working with known boundaries** | Current authenticated flows are available. |
| Question generation and normal AI Tutor generation | **Externally blocked** | The provider returns capacity exhaustion; new AI-generated questions cannot currently be created. |
| Tutor from an incorrect Practice/Mock answer | **Working with fallback** | A linked question gives Direct or Guided help from the verified question-bank explanation while AI generation is unavailable. |
| WAEC, NECO, NABTEB student content | **Not live** | Public product copy and exam-target choices must not imply these boards currently have usable in-app question coverage. |
| Full format-accurate JAMB mock | **Not implemented** | The app contains a clearly labelled short Practice Mock, not a 180-question / 120-minute full JAMB simulation. |
| Live Paystack production payments | **Unverified** | Test Mode works with documented evidence; production charges and webhooks have not been run. |

## 1. Active external blockers

| ID | Severity | Problem | Evidence and current behavior | What is already fixed | What remains to do | Owner |
|---|---|---|---|---|---|---|
| EXT-01 | High | **LLM provider capacity is exhausted.** | The structured provider repeatedly returned HTTP `412` after four retries. `practice.generate` and normal Tutor generation cannot obtain a model response. The app maps this to a controlled `503` and a safe message. [1] [2] | Raw provider diagnostics, stack output, and misleading global mutation-console noise were removed from learner-facing flows. Linked Tutor questions now use a verified question-bank fallback. | Restore/provider capacity, then run one controlled practice-generation request and both generic and linked Tutor flows. Verify no duplicate question insertion. | External AI provider / account capacity. |
| EXT-02 | Medium | **Paystack credential probe is currently blocked by Cloudflare from the sandbox.** | The standalone `server/paystack.credentials.test.ts` probe receives an HTML `403` before Paystack’s API can validate credentials. Billing UI still rendered read-only. [2] | The earlier timeout issue was fixed: API calls have bounded aborts and Test Mode plan checks previously passed. | Re-run only the non-transactional probe from an approved network path. Do not rotate keys based on this Cloudflare response alone. | Paystack/network policy. |

> **Critical distinction:** EXT-01 is **not** a student internet fault. Tutor’s earlier “check your connection” wording for this situation was a client classification defect and is solved. The outside provider is still unavailable. [2]

## 2. Known product limitations and unimplemented scope

| ID | Priority | Limitation | Current state | Required next action |
|---|---|---|---|---|
| PROD-01 | High | **Exam-board coverage does not match the broad public positioning.** | The live question bank is JAMB only: Biology 19, English 16, Mathematics 18, Chemistry 48, and Physics 48, for **149** questions total. No WAEC, NECO, or NABTEB rows exist. [2] [3] | Change public wording and unavailable exam-target guidance to state **JAMB practice currently live** until other boards have approved, persisted content. |
| PROD-02 | High | **WAEC content is approved for review but is not in the product.** | Fifteen original WAEC-style samples—five each for General Mathematics, Chemistry, and Physics—are held and accepted for future import. The schema can represent WAEC without a migration, but no `WAEC` exam row, subject, topic, question, or student-facing flow exists. [4] | Obtain explicit persistence approval, import transactionally, then add visible WAEC navigation and test filters. |
| PROD-03 | High | **NECO content is blocked by the official/free-source rule.** | Accessible official NECO material lacks a free subject syllabus, format, marking structure, and sample basis. Official syllabus and Chief Examiner material are paid. [3] | Obtain authorised source material or written permission; do not substitute third-party “free past-question” websites. |
| PROD-04 | High | **NABTEB has no researched or persisted content plan in the current evidence set.** | There is no documented NABTEB syllabus/style validation, question bank, board record, or student flow. | Research authorised material, define an original-practice policy, then create a reviewed content plan before advertising coverage. |
| PROD-05 | Medium | **The full JAMB mock format is not implemented.** | The product is a short, clearly labelled Practice Mock. It has persistence, timer, results, history, scoring, and Pro gating, but is not the intended 180-question / 120-minute exam. [5] | Expand the bank and then implement and validate the true format separately; do not relabel the current mock as full JAMB. |
| PROD-06 | Medium | **Course Direction is advisory, not live institution validation.** | The 46-course internal catalogue provides a common combination and permanent IBASS confirmation language. It does not query IBASS live per university, and it does not create a subject default. Eight courses remain deliberately flagged as unvalidated. [6] | Build Stage 2.1 only when a reliable, authorised IBASS validation path is available. Preserve the permanent confirmation language. |
| PROD-07 | Medium | **Dashboard course adaptation is recommendation logic, not a full learner-performance algorithm.** | Dashboard now updates its course card, faculty, common combination, disclaimer, and explicit available-subject buttons after a course change. It does not calculate mastery, weak-topic ranking, or a validated personal study plan from historical attempts. [2] | Define a transparent recommendation model using attempt data, explainability rules, and tests before calling it an adaptive study algorithm. |
| PROD-08 | Medium | **Tutor fallback has a deliberate boundary.** | During provider outage, Direct and Guided help works only when Tutor is opened with a valid linked Practice/Mock question. A generic Tutor question has no verified stored explanation to use and remains temporarily unavailable. [2] | Restore AI capacity or introduce a separately reviewed deterministic knowledge base for non-linked Tutor prompts. |
| PROD-09 | Low | **Practice-question generation is unavailable until EXT-01 clears.** | “Generate more practice on this topic” cannot create three questions while capacity is exhausted. The UI correctly reports temporary unavailability. [1] [2] | Retry after capacity recovery; validate structured output, deduplication, and question-bank insertion. |

## 3. Unverified but important launch areas

| ID | Risk | What is verified | What is not verified | Next evidence needed |
|---|---|---|---|---|
| UNV-01 | High | Paystack **Test Mode** successful subscription, signed webhook, Free→Pro state change, cancellation, recurring reconciliation, and declined-card backend behavior are documented. [7] | A rendered in-app declined-checkout error screen has not been captured because the isolated Test Mode learner was not authenticated into the app’s OAuth session. | Use an isolated authenticated test learner, submit one declined Test Mode card, record the app error text and confirm the learner stays Free. |
| UNV-02 | High | Test Mode only. | Live Paystack payment, live webhook delivery, live cancellation, and production recovery behavior. | Use a staged launch plan with a low-risk live transaction and documented rollback/reconciliation check. |
| UNV-03 | Medium | Authenticated browsing with the existing learner works. | Separate first-time learner signup/login, account recovery, and multi-user concurrency were not independently re-run in the latest audit. | Test with a new non-admin learner and document the full lifecycle. |
| UNV-04 | Medium | Core desktop and some 375px mobile screens were visually checked. | A formal keyboard-only, screen-reader, contrast, cross-browser, and slow-network accessibility pass is not documented. | Run WCAG-oriented manual and automated accessibility review. |
| UNV-05 | Medium | Unit/integration tests and selected authenticated live flows passed. | Production load, database contention, long-running mock concurrency, abuse/rate-limit resistance, and backup/restore drills are not documented. | Conduct pre-launch operational and security testing. |

## 4. Platform and development-environment observations

| ID | Severity | Observation | Scope | Required response |
|---|---|---|---|---|
| PLAT-01 | Medium | The platform-managed development debug collector stored a request `Authorization` header in sandbox-local network logs before redaction. | Development sandbox only; it is not treated as a production application defect. The application did not modify platform code. [1] | Restrict development-log access and raise a platform security/privacy request so headers are sanitised before storage. Never copy tokens into reports or tickets. |
| PLAT-02 | Informational | A brief Vite hot-update import-resolution warning occurred while a new dashboard component file and its import were created in separate update events. | Development HMR only. TypeScript subsequently passed and the authenticated dashboard rendered the component and course link correctly. [2] | Treat as historical HMR noise, not an active build issue. Reopen only if it reproduces after a clean reload or TypeScript fails. |
| PLAT-03 | Informational | The preview includes platform preview chrome. | Platform UI, not application DOM. | Do not attempt to remove it from app code; it is absent from a published app surface. |

## 5. Resolved defects — do not classify as current bugs

| ID | Original defect | Resolution and evidence |
|---|---|---|
| SOL-01 | Dashboard treated transient tRPC/gateway failure as sign-in failure. | Retryable `Failed to fetch` and `502/503/504` handling, dedicated recovery state, and regression tests were added. [1] |
| SOL-02 | Practice Mock defaulted to five subjects while the server allowed three. | Shared maximum-three contract, valid default, limit notice, and protected-input coverage. [1] |
| SOL-03 | Mock Pro entitlement ignored expiry. | Mock now uses expiry-aware paid access. [1] |
| SOL-04 | LLM exhaustion exposed raw provider messages/stack details. | Server boundary and shared learner-safe copy prevent upstream diagnostic disclosure. [1] |
| SOL-05 | Expected temporary availability still logged as `[API Mutation Error]`. | Global logger suppresses only the canonical handled availability state; unexpected errors remain logged. [2] |
| SOL-06 | Practice answer-save, Mock operations, and billing cancellation could fail without action-point recovery feedback. | Inline, student-facing error and retry states were added. [1] |
| SOL-07 | Production error boundary displayed an internal stack. | Replaced with safe recovery guidance. [1] |
| SOL-08 | Course Direction save appeared silent or disabled without explanation. | Explicit incomplete-input guidance, success feedback, cache update, and reopen persistence verification were added. [2] |
| SOL-09 | Explain with Tutor lost the source question. | Tutor now parses validated `questionId` from the actual browser query string, starts automatically, and displays linked-question context. [2] |
| SOL-10 | Tutor Direct/Guided turned the provider’s `412→503` condition into a misleading connection error. | Correct classification plus a linked-question Direct/Guided fallback was added and live-verified. [2] |
| SOL-11 | Paystack cancellation handled the wrong webhook event and recurring payments could duplicate subscription rows. | `subscription.not_renew` is now handled and successful recurring charges reconcile to existing rows. [7] |
| SOL-12 | Dashboard ignored the saved course direction. | Course-aware dashboard card, explicit subject deep links, and course-change guidance tests were added. [2] |

## 6. Non-negotiable engineering and content invariants

Another agent should preserve all of the following:

| Invariant | Reason |
|---|---|
| Never silently set a learner’s Practice or Mock subjects from Course Direction. | Course/institution requirements vary. Current dashboard buttons are explicit learner choices, not automatic overrides. |
| Keep **“Common combination — confirm for your university.”** and the JAMB IBASS path. | The 46-course data is a planning guide, not universal institution-specific truth. |
| Do not use third-party “free past-question” repositories for WAEC or NECO. | Their licence/provenance is not established under the project’s approved content policy. [3] |
| Keep current WAEC records unpersisted until explicit approval. | The 15 items are held review content, not student-facing content. [4] |
| Keep the current mock labelled Practice Mock. | It is not a full JAMB exam simulation. |
| Do not treat AI `412`/controlled `503` as a learner connection problem. | It is an external provider-capacity condition. |
| Do not expose provider diagnostics, internal stack traces, auth tokens, or webhook secrets. | Safety and privacy requirement. |
| Do not fabricate student reviews, ratings, or testimonials. | Consumer-protection and platform policy requirement. |

## 7. Recommended order of work

| Order | Work item | Why now | Definition of done |
|---|---|---|---|
| 1 | Correct public/exam-target messaging to JAMB-currently-live. | Prevents misleading early users about WAEC, NECO, and NABTEB readiness. | Landing, onboarding, and empty states accurately distinguish live and coming-soon coverage. |
| 2 | Resolve EXT-01 and rerun controlled AI tests. | It blocks two advertised AI capabilities. | One successful generated-practice insertion; generic Tutor and linked Tutor both return normal model responses; error fallback remains covered. |
| 3 | Close UNV-01 and UNV-02 before charging real users. | Payment correctness is a launch-critical trust issue. | Authenticated decline evidence and a staged live-payment/webhook/cancellation run, with database reconciliation proof. |
| 4 | Decide WAEC sample persistence and formalize board rollout. | The content is reviewed but absent from the product. | Transactional import, board-specific filters, copy, review test, and clear original-practice labelling. |
| 5 | Obtain authorised NECO/NABTEB material before any content generation. | Prevents copyright and academic-validity risk. | Official-source review, approved topic plan, review samples, and explicit persistence approval. |
| 6 | Build institution-specific validation only with a reliable authorised path. | Prevents false personalised subject advice. | Verified institution result, audit trail, fallback state, and no default when lookup fails. |
| 7 | Expand bank and build full-format JAMB Mock separately. | The current short mock should not be overstated. | Required question volume, exact format/timing, load testing, resume/expiry/scoring validation, and learner-facing disclaimer removal only after verification. |

## References

[1] [Full application error audit](./full-application-error-audit-final.md)  
[2] [Latest live sprint validation notes](./live-sprint-validation-notes.md)  
[3] [WAEC and NECO official-material research](./waec-neco-official-materials-report.md)  
[4] [Held WAEC three-subject sample review](./user-authorized-waec-three-subject-sample-and-schema-review.md)  
[5] [Practice Mock history and entitlement verification](./practice-mock-4c-verification.md)  
[6] [Course Direction Stage 2 verification](./phase-4-5-stage-2-verification.md)  
[7] [Paystack Test Mode verification](./paystack-test-mode-verification-report.md)
