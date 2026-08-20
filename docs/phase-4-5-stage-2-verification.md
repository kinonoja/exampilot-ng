# Phase 4.5 Stage 2 Verification

## Implemented boundaries

Stage 2 stores the learner’s internal course key and either **Not sure yet** or a target-university name. Every save sets `institutionValidationStatus = not_checked` and returns `subjectDefault = null`. No Practice Mock configuration, Tutor context, Paystack behaviour, practice filter, or question-bank record was modified.

## Live browser checks

The authenticated first-login state rendered a **Choose course direction** dashboard card and dedicated sidebar entry. The new route showed all 46 courses, searchable by course/faculty, with the permanent statement:

> **Common combination — confirm for your university.** Requirements can vary by university and programme option. Confirm the current combination for your target institution in JAMB’s IBASS Eligibility Checker before registering.

The exact official IBASS Eligibility Checker link rendered in the route. Selecting Medicine and Surgery displayed Biology, Chemistry, and Physics as a **Common planning guide**, followed by “No practice subjects have been selected from this course yet.” Selecting Agriculture displayed the same permanent framing and the required **Extra verification recommended** label while remaining selectable. Choosing **I have a target university** revealed the university field without saving or assigning subjects.

## Automated coverage

Focused tests confirm the internal catalogue has 46 unique course keys, all 8 unvalidated records remain present, the approved disagreement records use their corrected combinations, and the protected course-direction route saves both target-institution states with no subject default.

The full internal regression suite excluding the pre-existing external Paystack credential probe passed: **51 tests across 17 files**, followed by a clean TypeScript check. The excluded credential probe continues to depend on the external Paystack test endpoint; Stage 2 does not modify that integration. Recent client/server logs showed only older Practice Mock hot-reload import messages recorded before this work, with no new Course direction errors.

## Persisted edit and future-validation guard

For the controlled browser test, the learner’s original empty course-direction fields were first recorded. Medicine and Surgery was saved with **Not sure yet**, then the route was reopened and edited to Computer Science with **University of Lagos**. The saved summary correctly showed the edited course and university, retained “No practice subjects have been selected from this course yet,” and made no practice-subject change. The original empty learner fields were restored immediately afterward and confirmed in the database.

The automated guard now requires a course key, target institution, `provided` planning state, `verified` validation state, and a non-empty validated-subject set before any future institution-specific default could be promoted. Stage 2 stores none of that validated-subject output and always returns `subjectDefault: null`.

The controlled browser test was then repeated with an explicit fresh route reload between save and edit. Computer Science was saved with **Not sure yet**, `/course-direction?verification=reopen` was loaded afresh, and the server-backed summary showed the persisted Computer Science direction with no target institution and no subject default. That newly reopened state was edited to University of Lagos; the completed save still stated that no practice subjects had been selected. The profile was restored to its original blank state and confirmed in the database.

The protected-route test suite also now supplies a persisted `institutionValidationStatus = verified` profile through `courseDirection.get`. It returns the verified state for future work but continues to return `subjectDefault: null`, as Stage 2 has no validated-subject result to promote.
