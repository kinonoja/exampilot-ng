# Practice Mock 4c: History and Pro Entitlement Design

**Scope.** Sub-step 4c adds only the requested Practice Mock history and access behaviour. The product remains explicitly labelled as a short Practice Mock built from the current JAMB question bank; it does not represent the deferred 180-question JAMB mock.

| Concern | Contract | Behaviour |
| --- | --- | --- |
| Mock entitlement | `getPracticeMockEntitlement(userId)` | Reads the authenticated learner’s `subscriptionStatus`. Only `"pro"` returns `canStartMock: true`; all other statuses receive a clear reason for the upgrade prompt. |
| Server enforcement | `mock.start` protected mutation | Calls the entitlement contract before creating a session and throws `TRPCError({ code: "FORBIDDEN" })` for a Free learner, regardless of client state. Pro learners remain unlimited. |
| History | `getMockHistory(userId)` / `mock.history` | Resolves expired sessions, finalises any unscored expired entry, then lists only `submitted` and `expired` mocks in newest-first order. Each item contains its ID, exam name, selected subject IDs, completion date, score, status, and question count. |
| Lightweight analytics | Server-side structured `console.info` events | Emits `practice_mock_started` only after a new session and questions are persisted, and `practice_mock_completed` only on first scoring finalisation. No new external analytics service or student data collection is introduced. |

## Contextual access journey

The setup screen continues to let every learner select the available exam, subjects, question count, and session length. There is no access message on page arrival and no early interruption while learners decide their configuration. Once a valid configuration exists, a Free learner can press **Start Practice Mock**. At that high-intent moment, the button area changes to a compact, supportive Pro card that explains that full Practice Mocks are included with Pro and offers a single route to billing. A Pro learner proceeds directly into the saved session.

> “Your mock is ready. Practice Mocks are included with Pro, alongside unlimited practice and Tutor support. Upgrade when you are ready to begin this session.”

The client entitlement query makes the prompt timely and avoids a failed attempt, while the protected server mutation remains the source of truth. A stale tab or manually crafted request cannot create a Free mock.

## History interaction and information architecture

`/mock-history` is an authenticated dashboard route. The page uses the existing Mastery Rail and dashboard shell, then presents a mobile-first chronological list. Each row includes the local completion date, **JAMB Practice Mock** label, score percentage, completion state, question count, and a visible **View full results** control. The control returns to `/mock-exam?session=<id>`, which already renders the protected completed results and detailed review.

The existing Practice Mock dashboard card gains a secondary **View mock history** path, and the student sidebar gains a dedicated **Mock history** destination. Empty, loading, and query-error states use the established cards and colour tokens. Status badges remain informational: submitted sessions use the existing green success token; time-expired sessions use the neutral blue token rather than punitive language.

## Verification plan

| Check | Evidence required |
| --- | --- |
| Entitlement unit coverage | Pro is allowed; Free and non-Pro states are blocked; the public return object is predictable. |
| Server enforcement | A Free `mock.start` call returns `FORBIDDEN` before it inserts a session. |
| Analytics | Start and first finalisation log structured lifecycle events without duplicate completion records from repeat calls. |
| Free UI | No prompt at setup arrival; after a valid selection and an explicit Start click, the compact mock-specific Pro card appears. |
| Pro UI | A Pro learner starts normally and enters the saved live session. |
| History UI | Completed mocks show date, type, score, status, and link; following the link opens the matching score breakdown and review. |

