# Exam Board Rollout Policy

## Current data boundary

JAMB is the only live exam board in the database and student Practice flow. The relational schema already supports separate boards through `exams`, `subjects.examId`, `topics.subjectId`, and `questions.examId/subjectId/topicId`. No `questions.examBoard` column is required.

## WAEC readiness

The application now exposes a truthful WAEC empty state in Practice. It stores no WAEC content. The 15 reviewed original samples remain held until explicit human approval. When approved, import them in one transaction: create/find the `WAEC` exam; create WAEC-specific subjects/topics; validate each batch record against the exact board hierarchy; insert questions; verify counts and selector visibility; and label the content **Original WAEC-style practice content — not a WAEC past question**.

## NECO and NABTEB boundary

NECO and NABTEB only have source-gated empty states. Do not create or import questions, topics, sample answers, or copied formats until authorised official material or written permission exists. Third-party past-question sites are excluded even when their files are publicly downloadable.

## Non-negotiable filter rule

Future-board UI selection must never query, mix, or save JAMB question IDs. It must show an empty state until the relevant `exams` row and approved content exist. Existing JAMB subject filters remain unchanged.
