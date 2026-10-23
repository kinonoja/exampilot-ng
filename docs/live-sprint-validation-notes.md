# Live Sprint Validation — Working Evidence

## Priority 1: Question Generation availability

The learner-triggered dashboard mutation at **2026-08-22 00:50:01 Africa/Lagos** returned the safe, application-defined unavailability message rather than raw upstream diagnostics. The server `practice.generate` mutation routes generation through `withLLMAvailabilityBoundary`; the earlier provider response identified the external structured-generation condition as usage exhaustion. This is therefore an external capacity blocker, not a malformed dashboard input or a broken protected procedure.

The application message was standardised to: **“This feature is temporarily unavailable, please try again later.”** Focused availability tests and TypeScript validation pass. No further generation request is made during this validation pass because a successful provider recovery could insert question-bank content.

## Priority 2: Live catalogue visibility

At the authenticated `/practice` route, the JAMB subject selector rendered **Biology, Chemistry, English, Mathematics, and Physics**. This confirms that both requested science subjects are present in the live catalogue. The next non-mutating checks will select Chemistry and Physics separately and confirm their question panels render; no answer will be submitted.

The live Practice panel rendered a **Physics** question from the **Simple Machines** topic with four selectable answers and a Submit answer control. The subject selector was then moved to Biology without selecting or submitting an answer; this confirms filter changes do not require a persistence mutation. Chemistry remains to be selected for the equivalent live question-panel check.

The subject selector then rendered **Chemistry** and exposed its Chemistry-specific topic list. Its live question panel loaded **Air, Water and Environmental Chemistry** with four selectable answers and a Submit answer control. No radio button or submit action was used, so the learner’s attempt history was not modified. Chemistry and Physics are therefore both visible and answer-ready in the running Practice interface.

At the authenticated `/mock-exam` setup, separate selectable subject cards rendered Chemistry with **48 approved AI questions** and Physics with **48 approved AI questions**. The configuration displayed **Choose up to 3**, defaulted to three selected subjects, and reported 32 eligible questions. No Start Practice Mock action was used, so no session was created. This confirms the Priority 1 subject-limit guard and Priority 2 Mock subject visibility in the live interface.

A read-only database count confirmed the expected JAMB bank totals: Biology 19, English 16, Mathematics 18, Chemistry 48, and Physics 48 questions. Chemistry and Physics each have 48 AI-generated approved records. No database mutation was used for this validation.

## Priority 3: Read-only core-flow checks

The authenticated Course Direction route loaded the searchable 46-course catalogue, “Not sure yet” and target-university choices, the permanent **Common combination — confirm for your university** wording, and the JAMB IBASS Eligibility Checker link. No course or university value was selected or saved. This confirms the onboarding surface loads while preserving the learner’s existing profile state.

The authenticated Billing route displayed the active Pro plan, its 19 September 2026 access expiry, recurring-billing control, and payment-history records without initiating checkout or cancellation. The Mock History route displayed completed JAMB Practice Mock entries with scores, completion states, and view-results links without creating or altering a session.

The full regression command ran 26 of 27 test files successfully (68 of 69 tests). The sole failure was the external `server/paystack.credentials.test.ts` probe: Paystack returned a Cloudflare HTML **403** response before the API could validate the credential. A repeat probe with a descriptive user-agent received the same response. This is recorded as an external network/WAF validation blocker, not as an application billing-flow regression; the authenticated Billing UI itself loaded normally and no Paystack mutation was attempted.

## Recurring Question Generation report — 01:01 Africa/Lagos

The repeated learner request still reached the external generation availability boundary. Its safe student-facing message was correct, but the global React Query mutation-cache subscription then emitted the same handled condition as `[API Mutation Error]` in the browser console, which made an expected, rendered availability state look like an unhandled product error.

The global logger now suppresses this single, canonical temporary-availability message while continuing to log all unexpected query and mutation errors. The message is centralised in `shared/const.ts` so the server boundary, UI translation, and log-suppression rule cannot drift. Focused coverage passes: 7 tests across the API logging helper, student-message helper, and server availability boundary. This eliminates the reported console error; it does not make the externally unavailable generation provider produce questions.

## Course Direction save report

The authenticated Course Direction screen now displays the learner’s persisted direction as **Nutrition and Dietetics** with the saved “not sure yet” institution choice. This confirms the protected save path persisted the earlier selection. The prior interface nevertheless made saving ambiguous: it silently disabled an incomplete form and refreshed data without an explicit confirmation after a successful save. The repair makes the action always explain incomplete input and provides an inline confirmation after a valid save.

The unchanged saved direction was submitted once to verify the repaired UI. It displayed: **“Saved. Nutrition and Dietetics is now your course direction. You can add a target university later.”** A fresh route load then continued to display Nutrition and Dietetics as the current direction. This proves save confirmation and persisted reload behavior without changing the learner’s selected course or institution choice.

## Practice-to-Tutor handoff report

The Practice and Mock review actions correctly included `questionId` in their Tutor links, but the Tutor page read its route hook value rather than the browser query string. The hook omits query parameters, so the question context was lost and the learner had to start a generic Tutor session manually.

Tutor now reads and validates the browser `questionId`, creates the session automatically once, and retains that identifier for each later Tutor message. Live verification used the same direct-link shape (`/tutor?questionId=1`) that the Explain with Tutor controls use. Tutor opened directly in an **Algebraic Expressions** session, displayed **“Your Practice question is linked and ready to explain,”** and presented direct/guided explanation choices without requiring a manually typed topic. No LLM reply was requested during this test. Full application-owned regression: 29 files / 74 tests pass; TypeScript passes.

## Tutor Direct and Guided response failure — in progress

The reported Guided failure has been reproduced on the same linked-question flow with **Give me the answer**. After the Tutor entered its loading state, it showed the identical generic message: **“We could not reach ExamPilot just now. Check your connection and try again.”** The linked question context remained intact. This confirms the problem is not limited to Guided mode and does not establish a learner connectivity failure; server and transport diagnostics are being traced before the student-facing classification is corrected.

The underlying response is a server-side `503` carrying the intentional message **“This feature is temporarily unavailable, please try again later.”** after the provider repeatedly returned HTTP 412. The old client ordering misclassified that meaningful 503 as a learner connection issue. The repair now preserves the server availability message and, for a linked Practice question, returns a verified context fallback instead of an error. Live Direct verification returned **A. 8x - 2** and the stored explanation for the linked Algebraic Expressions question without an LLM-generated reply.

A separate fresh linked-question session was opened for the matching Guided-mode verification; the request entered the same controlled provider-availability path. Its final student-facing response is being captured as a distinct check so the Guided interaction is not inferred from Direct-mode behavior.

Guided verification passed. It returned the linked question’s stored key idea and then asked the learner to identify the option that matches it, preserving guided-study behavior without claiming that the learner’s connection failed. Both Direct and Guided now provide usable, question-specific help while the external provider continues to return 412. Full application-owned regression: 30 files / 77 tests pass; TypeScript passes.

## Course-adaptive dashboard — in progress

The authenticated dashboard now reads the saved Course Direction rather than static course copy. Live verification rendered **Education and Biology path**, its faculty, the permanent **Common combination — confirm for your university** framing, and an explicit **Practice Biology** action from the saved course combination. This is an advisory path, not a silent subject default: the learner must choose the subject action, and the common-combination disclaimer remains visible.

Selecting **Practice Biology** opened `/practice?subjectId=3`, set the live Practice filters to JAMB and Biology, and loaded a Biology question. No answer was selected or submitted. This verifies that the course-adaptive dashboard changes the recommended focus when the saved course changes while leaving the learner in control of whether to practise it.

The course-guidance model is covered with two regression cases: it recalculates the available current-bank subjects when the saved course changes, and it retains the university-confirmation framing for a course with no current-bank match. The new subject-link parser is also covered. Full application-owned regression: 31 files / 80 tests pass; TypeScript passes.

## Truthful future-board Practice coverage

The authenticated Practice route now shows a board-coverage selector with JAMB, WAEC, NECO, and NABTEB. JAMB remained the only live filterable catalogue. Selecting WAEC showed **WAEC practice is coming soon**, stated that reviewed samples are held for explicit human approval, and rendered **No questions are loaded or saved for this board** with a return-to-JAMB action. No answer, attempt, content row, or preference changed during this check. The board-availability contract and the full application-owned suite passed after the change.

## Fresh generic Tutor availability report

At 03:28 Africa/Lagos, a generic Tutor Direct request for the topic **Temperature** received the controlled `tutor.send` service-unavailable response after the external provider condition. This was not a learner connection problem and did not indicate a new application regression: the request carried the intended student-safe message and correlation ID. Generic Tutor intentionally remains unavailable during provider exhaustion because it has no linked, verified question-bank explanation to use. Linked Practice/Mock Tutor sessions remain the only fallback path by policy.

## JAMB catalogue rollout — preview follow-up

The approved transactional import reported 25 JAMB subjects, 702 topic rows, and preservation of **Use of English** at subject ID 2. The initial screenshot capture showed only the local loading skeleton, so it was not treated as visual evidence. A subsequent authenticated browser check completed the catalogue request and rendered all 25 entries in the JAMB selector: the five live-question subjects were unmarked, while each zero-question subject was labelled **“— syllabus mapped.”** The selector displayed **Use of English** rather than the previous English label. Automated import, availability, and identifier-preservation tests also pass.

The authenticated learner session then selected **Agriculture Science — syllabus mapped**. Its complete imported topic list rendered in the topic selector, and the page displayed: **“Syllabus mapped — practice questions coming.”** The supporting copy clearly explained that the official topic structure is browseable but original ExamPilot practice questions are not yet added and that no empty session will start. No answer or question-generation action was initiated.

The authenticated Practice Mock setup loaded after the import with exactly the five subjects that currently have questions: Biology, Chemistry, Mathematics, Physics, and Use of English. No syllabus-only subject, including Agriculture Science, was selectable. This confirms that importing the 20 additional subjects did not create empty Mock choices or alter the existing subject-bank boundary. No mock start action was used.

## Tuesday Sprint Priority 1 reconciliation

The reported Mock `subjectIds` defect is historical, not current: the shared `PRACTICE_MOCK_MAX_SUBJECTS` constant is **3**, the protected `mock.start` schema rejects the former five-subject payload, and authenticated Mock setup renders **Choose up to 3** with exactly three default selections. The focused input regression passed.

The reported raw upstream `412` defect is also historical, not current: the server classifies the observed usage-exhausted/precondition failure and returns `SERVICE_UNAVAILABLE` with **“This feature is temporarily unavailable, please try again later.”** Focused server and student-message regressions passed. The full error audit contains no unresolved Critical application defect after excluding the explicitly deferred authenticated-decline and staged-live payment evidence; external AI capacity remains an availability blocker, not a raw-error or connection-message regression.

## Tuesday Sprint Priority 2 — Chemistry live evidence

In the authenticated learner session, `/practice?subjectId=2010001` selected **Chemistry**, rendered the Chemistry topic list, and loaded an answer-ready question from **Acids, Bases and Salts**: “In an acid-base titration using phenolphthalein indicator … what colour change is observed at the endpoint?” The card showed four radio options and the **Submit answer** control. No option was selected and no submit action occurred, so no practice attempt was created. This is direct browser evidence that the persisted 48-question Chemistry bank is active in Practice.

The same authenticated session then opened `/practice?subjectId=2370001` for **Physics**. The Physics topic list rendered and the page loaded an answer-ready hard **Refraction and Optics** question about a critical angle for a glass block, with four radio options and the **Submit answer** control. No option was selected and no submit action occurred. This is direct browser evidence that the persisted 48-question Physics bank is active in Practice.

## Tuesday Sprint Priority 2 — Mock setup live evidence

The authenticated Practice Mock setup rendered Chemistry and Physics as selectable subject cards, each labelled **0 original questions · 48 approved AI questions**. The setup displayed **Choose up to 3**, had three default included subjects, and showed the eligible-question count without starting a mock. The next non-mutating step will replace one default selection with Physics to demonstrate Chemistry and Physics can coexist inside the limit.

Biology was deselected, reducing the included-subject count to two without initiating any session. Physics was then selected beside the already-selected Chemistry and Mathematics cards. The page visibly showed **Chemistry** and **Physics** as selected, the label **Choose up to 3**, and **Included subjects 3**. The **Start Practice Mock** control was deliberately not used, so no Mock row, answer, or attempt was created. This demonstrates that the repaired subject-limit contract does not block Chemistry or Physics when they are selected together within the allowed three-subject set.

## Tuesday Sprint Priority 3 — five-subject Practice regression

The authenticated learner opened `/practice?subjectId=3` for **Biology**. The selector retained Biology, loaded the Biology-specific topic list, and then rendered a hard **Genetics** question (“A dominant allele is one that:”) with four radio options and **Submit answer**. No option was selected and no submit action was used.

The authenticated learner then opened `/practice?subjectId=2` for the officially labelled **Use of English** subject. Its selector and subject-specific topic list loaded, including comprehension, vocabulary, grammar, speech, and summary areas, then rendered an easy **Articles** question (“She is ___ honest student.”) with four radio options and **Submit answer**. No option was selected and no submit action was used.

The authenticated learner then opened `/practice?subjectId=1` for **Mathematics**. Its selector and Mathematics-specific topic list loaded, including algebra, calculus, geometry, statistics, and trigonometry, then rendered a medium **Sequences** question about an arithmetic sequence with four radio options and **Submit answer**. No option was selected and no submit action was used.

## Tuesday Sprint Priority 3 — Tutor regression boundary

The authenticated Tutor screen rendered its topic input, **Direct** and **Guided** mode descriptions, and the explicit statement that learners can change mode during a session. It also correctly stated that linked Practice questions retain a verified explanation if the learning service is temporarily unavailable. No session was started: starting a generic Tutor session can consume a daily allowance and would currently reach the external provider-capacity boundary. Direct/Guided response behavior, in-session mode switching, linked-question handoff, and Free-limit behavior are therefore reported from focused regression tests and earlier linked-question browser validation rather than represented as a new live generic-Tutor response.

## Tuesday Sprint Priority 3 — Mock history live evidence

The authenticated **Mock history** page loaded eight completed JAMB Practice Mock records with submitted/time-elapsed statuses, dates, question/subject counts, scores, and **View full results** controls. No result was opened and no Mock was started. This confirms the history surface and persisted completed-record metadata render in the running app; the safer evidence for timer, active-session reload recovery, scoring, results calculation, and history ordering remains the focused lifecycle regression suite and the previously documented close/reopen browser validation.

## Tuesday Sprint Priority 3 — Billing screen live evidence

The authenticated Billing page rendered the current **Pro** plan as active until **September 19, 2026**, the NGN **₦1,500/month** plan details, server-side-verification copy, payment history, and the visible **Cancel recurring billing** control. No checkout or cancellation control was used. The checkout entry point is correctly absent for this already-Pro learner; earlier Test Mode evidence remains the basis for checkout initialization and webhook behavior, both of which are explicitly out of scope for this regression pass.

## Tuesday Sprint Priority 3 — Course Direction live evidence

The authenticated Course Direction page loaded the saved **Computer Science** choice, its common guide (English Language plus Mathematics, Physics, and Chemistry or Biology), **Not sure yet** target-institution state, permanent **“Common combination — confirm for your university.”** framing, and the IBASS Eligibility Checker link. It explicitly stated that no practice subjects were selected from the course alone. No course, institution, or save control was changed during this verification.

## Tuesday Sprint Priority 3 — code-level regression result and evidence boundary

`pnpm validate` passed on 22 August 2026 with **37 application-owned Vitest files / 95 tests** and `tsc --noEmit`. The suite includes focused coverage for the five-subject catalogue availability, Practice Mock limits/lifecycle/scoring/recovery/history, Tutor modes/fallback/Free limits, billing state, course-direction persistence, and learner-facing availability errors.

The same authenticated learner session remained logged in while accessing Practice, Tutor, Mock history, Billing, and Course Direction, which verifies current authenticated navigation. A separate **first-time learner signup/login and account-recovery flow was not rerun** in this pass because there was no separate authorised test identity and signing out the active learner would be disruptive. That remains a clearly bounded unverified launch-evidence item rather than a claimed pass. No payment, checkout, cancellation, Tutor session, practice attempt, Mock session, course-direction save, or webhook action was initiated.

## Syllabus-only subject-state audit — French direct verification

The database confirms **French** (ID `3690010`) currently has **0** practice questions. In the authenticated Practice screen, direct navigation to `/practice?subjectId=3690010` retained the selected subject as **French — syllabus mapped**, displayed its four official topic areas, and rendered the exact non-actionable state **“Syllabus mapped — practice questions coming.”** The explanatory text says that no empty session will be started. This is direct live evidence that the primary selection path does not show a broken or empty practice screen.

The authenticated Practice Mock setup displayed exactly five selectable subjects—Biology, Chemistry, Mathematics, Physics, and Use of English—with their positive original and/or approved-AI question counts. **French** and all other zero-question syllabus subjects were absent. This matches the server’s explicit zero-question filter and ensures no empty Mock can be configured from a syllabus-only subject.

## Syllabus-only subject-state audit — course guidance and dashboard

The learner’s saved course direction had changed independently to **French** during their own testing; no course-direction save was performed by this audit. Course Direction showed the advisory French course guide and the added clarification that course requirements are not a Practice availability list, and that subjects without a question bank are labelled **Syllabus mapped — questions coming** in Practice. The authenticated dashboard then showed the French path with the non-actionable fallback: **“No matching subject is in the current JAMB bank yet. Your course guidance remains saved while coverage expands.”** It displayed no misleading Practice-French button.

## Syllabus-only subject-state audit — complete coverage

The audit covered every current subject-facing path. Practice labels each zero-question subject in its selector and replaces the question card with the explicit syllabus-mapped state. Practice Mock excludes zero-question subjects at both server and UI levels. Course-aware dashboard actions filter to live subjects and use a truthful no-matching-subject fallback. Course Direction is advisory rather than a Practice selector and now states that distinction directly.

One additional dashboard gap was found and corrected: **Topic Signals** previously received every catalogue topic, including those for syllabus-only subjects. It now filters the topic selector through `getLivePracticeTopics`, which keeps only topics whose subjects have a positive question count. The focused regression proves a zero-question French-style topic is excluded; `pnpm validate` passes with **38 files / 96 tests** plus TypeScript. The active browser session had been signed out after the user’s own testing before the post-change dashboard could be recaptured, so the dashboard-filter correction is supported by the focused regression and code-level validation rather than a new authenticated screenshot.

The dashboard’s non-actionable Focus next copy was also aligned to all five current live subjects: **Mathematics, Use of English, Biology, Chemistry, and Physics**. This corrects the previous abbreviated list without changing any Practice route, question, attempt, entitlement, or payment behavior.
