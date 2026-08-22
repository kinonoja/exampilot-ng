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
