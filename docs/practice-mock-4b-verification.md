# Phase 4 Sub-step 4b Verification

## Automatic completion and results

The earlier recovery-proof session (`120001`) reached its server-controlled deadline. Opening its route rendered the completed results view rather than the live session. The view showed a persisted **10% score (1 correct of 10)**, pace summary of **60 seconds per question** and **10m 00s total**, a per-topic accuracy list in which unanswered questions remained part of each assigned-topic total, and all ten question-review entries.

This confirms that server-side expiry now triggers finalisation, persists correctness, and exposes results only after the timed session has ended. A separate short session will verify the manual-submit confirmation, result path, and Tutor handoff.

The separate verification setup loaded with the existing JAMB Biology, English, and Mathematics bank selected, a 10-question session, and a 10-minute limit. A new session will be manually submitted before expiry.

## Manual completion and results

Session `150001` saved the correct answer **B (1/2)** for its first Trigonometry question. Its submission confirmation accurately stated that **1 of 10** questions was answered and **9** remained unanswered. After confirmation, the results screen rendered a server-calculated **10% score (1 correct of 10)**, the visible previous-mock comparison of **+0 points** against the prior 10% result, an overall pace of **4 seconds per question / 43 seconds total**, topic accuracy bars, and all ten review entries.

Reloading the manual-result route retained the same 10% result, per-topic breakdown, pace summary, and visible prior-score comparison before opening the review detail.

Opening Question 1’s review revealed the student answer **B. 1/2**, the canonical correct answer **B. 1/2**, and the existing-bank explanation: “A standard trigonometric value is sin 30° = 1/2.” The **Explain with Tutor** action then navigated to `/tutor?questionId=17`, which is the existing Tutor’s question-context route. The action was not submitted further to avoid consuming an unnecessary Tutor allowance during verification.

## Automated validation

The full project suite completed with **39 passing tests across 14 test files**, including the new mock scoring, topic breakdown, and pace-summary cases. The TypeScript check also completed with no errors. The Paystack credential check now passed as part of the same full run.

## Automatic-completion review and persistence

The timed session `120001` was confirmed in the database as `status = expired`, `score = 10`, with **1 correct** and **9 incorrect** `isCorrect` values persisted across its ten mock-question rows. Its automatically completed results screen rendered the same 10% result and opened Question 1’s flagged review, showing **C. 2 and -4** as both the student and correct answer, plus the existing explanation. Its **Explain with Tutor** action navigated to `/tutor?questionId=12`, confirming the Tutor question-context route also works for an automatically completed mock.

## Requested double verification

First, a fresh database check of manual session `150001` confirmed `status = submitted`, `score = 10`, `totalQuestions = 10`, `correctAnswers = 1`, and nine false `isCorrect` values. Second, reopening its results route independently rendered the same 10% score, 1 correct answer, 43-second pace summary, visible +0 prior-mock comparison, and topic bars. These checks confirm the stored scoring data and the student-facing results render agree.

For the repeated review check, opening Question 1 from the freshly reloaded results rendered **B. 1/2** as both the student and correct answer, the stored trigonometric explanation, and the existing **Explain with Tutor** action. The results display and detailed review therefore both match the persistence check.
