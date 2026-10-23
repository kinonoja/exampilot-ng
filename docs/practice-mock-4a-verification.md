# Practice Mock 4a Verification

## Setup screen

On 20 August 2026, the authenticated student preview opened the new **Practice Mock** route. The setup screen rendered Biology, English, and Mathematics selection controls; a default-off option for approved AI-generated questions; 5, 10, or 15 question choices; and 5, 10, or 15 minute time limits.

The screen prominently states that it is a **practice-length mock** using the current 53-question JAMB bank and **not** the future 180-question, 120-minute four-subject JAMB mock. With original questions only, all three subjects selected, the UI correctly reported 50 eligible questions.

## Live session and answer save

The configured 10-question, 10-minute session opened as `/mock-exam?session=1`, displaying the persistent countdown, question navigator, review-flag control, and next/previous controls. Selecting option **C** for the first question immediately updated the session to **1 answered · 0 flagged · 9 remaining** and changed the first navigator cell to its answered state.

Reloading the same session restored option **C**, the answered count, and the live countdown. Toggling the first question’s review flag then updated the session to **1 answered · 1 flagged · 9 remaining** and marked the navigator item accordingly.

Opening the manual submit action showed a confirmation dialog that accurately reported **1 of 10 answered** and **9 unanswered**, with an explicit option to keep working. The session remained active after cancellation.

The setup screen was then reopened to prepare a separate, disposable session for controlled timer-expiry verification, leaving the persisted-answer session intact.

The disposable session opened as `/mock-exam?session=2` with the same live countdown and unanswered navigator state. It is used solely to validate the auto-expiry path without affecting the persisted-answer session above.

For controlled expiry verification, only session 2’s test start time was moved beyond its configured server duration. Reloading the route then produced the locked state, **“Time is up. Your progress is safe.”** The session reported that saved answers and flags are locked, while scoring and review remain deferred to Sub-step 4b as required.

After the countdown-clamping fix, a fresh setup flow was reopened for the final live verification of the 10-minute timer, question navigation, and manual submission path.

The final session opened at **09:57**, never exceeding its configured 10-minute duration. The Next action moved from question 1 to question 2, and the navigator then jumped directly to question 10, updating the active question and active navigator cell as expected.

The Previous action moved from question 10 to question 9. The confirmation dialog then correctly disclosed **0 of 10 answered** and **10 unanswered**. Confirming **Submit now** locked the session and rendered the **“Practice Mock submitted.”** completion state, with scoring and review explicitly deferred to Sub-step 4b.

## Correction: boundary of the prior reload check

The earlier persistence check was limited to reloading the **same full URL**—`/mock-exam?session=1`—after an answer had been saved. It did not close the tab, discard that URL, reopen the application through the normal `/mock-exam` route, or discover an unfinished session automatically. It therefore did **not** test the close-and-reopen recovery promise, and it must not be treated as evidence for that behaviour.

## Reproduction before the recovery fix

Opening the ordinary `/mock-exam` route with no `session` query parameter rendered the new-session setup screen. The route had no server lookup for the authenticated learner’s unfinished session and no client-side stored active-session identifier, so a student returning after closing a tab would not be routed back to their session.

For the corrected recovery test, expired sessions were first allowed to resolve to their locked state. The ordinary `/mock-exam` route then returned to setup, ready for one isolated test session rather than resuming an expired attempt.

The isolated recovery session opened as `/mock-exam?session=90001` with a 10-minute timer at `10:00`, ten unanswered questions, and no saved review flags.

In the isolated session, option **B** was selected for question 1 and the navigator changed it to answered. The test then moved to question 2, establishing a non-initial position that must be restored after reopening.

Option **B** was then selected for question 2, increasing the session to **2 answered**. Question 2 was flagged, and both its review state and the navigator updated to **2 answered · 1 flagged · 8 remaining**.

The test moved to question 3 and selected option **B**, producing **3 answered · 1 flagged · 7 remaining** with question 3 still active.

The test then moved to question 4. Immediately before reopening, the database recorded session `90001` as `in_progress`, with `currentQuestionPosition = 4`, `savedAnswers = 3`, and `flaggedQuestions = 1`.

The browser then left the session route and reopened the ordinary `/mock-exam` route **without** the former `session` query parameter. The new active-session lookup redirected to `/mock-exam?session=90001` and restored question **4 of 10**, **3 answered**, **1 flagged**, the flagged second navigator item, and a continuing timer at `06:46`. No new mock was created.

The normal-route recovery was repeated after the final recovery-status UI change. It again returned to session `90001` on question **4 of 10**, with **3 answered**, **1 flagged**, and a continuing timer at `04:58`; the timer was not reset.

## Post-restart correction

A clean server restart exposed one more defect: a client mount effect could persist the component’s initial question index (`1`) before applying the saved position. This was detected because session `90001` rendered at question 1 and its database position had changed to `1`, despite the earlier evidence of position `4`. The recovery logic was then changed to block position persistence until the server-provided saved position has been applied.

After restoring the isolated test session’s persisted position to `4`, the browser again left the session route and opened the ordinary `/mock-exam` route. The session returned at **question 4 of 10**, with **3 answered**, **1 flagged**, and a continuing timer at `02:14`. This second result is the verified recovery evidence; the earlier post-restart result is explicitly recorded above as a failed check, not a pass.

Following a clean server restart after the correction, the ordinary `/mock-exam` route again resumed session `90001` at **question 4 of 10**. Its countdown was still live at `00:14`, and the database separately confirmed `status = in_progress`, `currentQuestionPosition = 4`, `savedAnswers = 3`, and `flaggedQuestions = 1`. The final post-restart recovery check therefore preserved the saved position instead of overwriting it with question 1.

The recovery regression suite now includes explicit normal-route selection for an active session plus a restored snapshot containing **3 answers**, **1 review flag**, **question 4**, and a **continuing 400-second timer**. The focused suite ran successfully with 11 tests across the mock lifecycle, route recovery, restored position, and timer helpers, followed by a clean TypeScript check.

For the final rendered post-restart capture, the prior short test session was allowed to expire normally. The standard `/mock-exam` route returned to the clearly labelled Practice Mock setup, ready for a separate isolated proof session.

The final proof session opened as `120001`. One answer and one review flag were saved, then the development service was restarted. Opening the ordinary `/mock-exam` route after that restart redirected to `/mock-exam?session=120001` and fully rendered **question 1 of 10**, the saved selected option, **1 answered · 1 flagged · 9 remaining**, the flagged navigator item, and a continuing `08:55` timer. The matching database snapshot returned `status = in_progress`, `currentQuestionPosition = 1`, `savedAnswers = 1`, and `flaggedQuestions = 1`.

The final post-restart rendered screen visibly showed option **C — “2 and -4”** selected with its filled radio control and selection checkmark, while the review control remained **Flagged**. The matching row-level database query for session `120001`, position `1`, returned `selectedAnswer = C` and `flagged = 1`.

To make the recovered state independently clear in the rendered interface, selected options now display a visible **Selected** label. Reopening session `120001` rendered **C — “2 and -4” — SELECTED**, alongside **Flagged**, **1 answered · 1 flagged · 9 remaining**, and a continuing `06:14` timer. This matches the persisted `selectedAnswer = C` and `flagged = 1` row-level state.
