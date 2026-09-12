# Phase 4 Sub-step 4a: Practice Mock Design

## Scope boundary

This release is a **short Practice Mock**, clearly separate from the future full JAMB mock. It uses only the current JAMB bank of 53 questions spanning Biology, English, and Mathematics. The interface must state that it is not the format-accurate 180-question, 120-minute JAMB mock.

## Session contract

| Concern | Sub-step 4a behaviour |
| --- | --- |
| Setup | Select one or more available JAMB subjects, a short question count, a duration, and whether to include AI-generated questions. |
| Pool selection | The server randomly selects a non-repeating question set from the selected existing subjects. AI-generated questions are excluded unless the student enables the toggle. |
| Timing | `startedAt + durationSeconds` is the authoritative expiry boundary. The client derives the visible countdown; every server mutation verifies that boundary. |
| Persistence | Selecting an answer or changing its flag writes immediately to `mock_exam_questions`. A restored or newly opened session returns all saved answers and flags. |
| Completion | A zero timer requests server expiry; the server locks the session as `expired`. Manual submit locks it as `submitted` after a confirmation indicating unanswered questions. Scoring and results are intentionally deferred to Sub-step 4b. |

## Data and safety decisions

`mock_exam_questions` gains a `position` field so question navigation is stable after a reload. The existing `selectedAnswer` and `flagged` fields record incremental student progress. Session operations are protected by user ownership checks. The server never returns a correct answer or explanation during the live session.

## JAMB safeguard

The future JAMB full-mock preset remains unavailable until the question bank contains four valid JAMB subjects and the complete allocation of 60 English questions plus 40 questions for each other subject. The Practice Mock does not simulate or claim the official JAMB format.

## Close-and-reopen recovery correction

An unfinished Practice Mock is recovered from the authenticated user’s server-side data, not from the former tab URL or browser storage. The mock header records `currentQuestionPosition` alongside its existing start time, duration, answers, and flags. Every next, previous, or direct navigator action persists that position immediately.

When a student opens `/mock-exam` without a session query parameter, the application asks the server for their most recent **live** mock. The server resolves elapsed sessions to `expired` first; it returns only an in-progress session. The client then routes the student to that session and restores the saved answer, review flag, non-resetting timer, and last question position. Starting a new mock while one is live resumes the existing mock rather than creating a competing session.
