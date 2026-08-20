# Phase 4 Sub-step 4b: Practice Mock Scoring and Results

## Scope boundary

Sub-step 4b scores and explains completed Practice Mocks. It does not introduce mock history navigation, Free/Pro mock entitlement enforcement, analytics logging, or any new question content; those remain reserved for Sub-step 4c or a later question-bank expansion.

## Server-authoritative finalisation

Every completed mock—whether manually submitted or automatically expired—uses one idempotent server-side finalisation path. It compares each saved `selectedAnswer` with the bank’s canonical `correctAnswer`, writes `mock_exam_questions.isCorrect`, stamps `submittedAt`, and saves the overall **percentage score** in `mock_exams.score`. Results are only available after a mock has been finalised; the live-session response continues to exclude correct answers and explanations.

## Results contract

| Element | Calculation or source |
| --- | --- |
| Overall result | Correct questions, total questions, and saved percentage score. |
| Topic breakdown | Correct, attempted, and total questions grouped by existing topic. Accuracy is based on total assigned questions so skipped questions remain visible as missed opportunities. |
| Pace summary | Actual elapsed time from `startedAt` to `submittedAt`, average seconds per assigned question, and a pace signal against the selected duration. Per-question timing is not shown because the current model does not record answer timestamps. |
| Review | The original question, options, the student answer, canonical correct answer, explanation from the existing bank, and a question-specific Tutor link. |
| Visible trend | Current percentage score compared with the learner’s immediately preceding completed mock of the same exam type. |

## Trust safeguards

Scoring occurs only on the server, uses only existing question-bank answers and explanations, and is safely repeatable if an already-finalised result is re-opened. The results UI labels expired sessions accurately, does not infer per-question timing that was never recorded, and keeps all answer/explanation material hidden until the mock ends.
