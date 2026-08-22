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
