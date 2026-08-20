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
