# Phase 4.5 Stage 2: Course Direction Design

## Non-negotiable safety rule

Selecting a course does **not** select a practice subject. Selecting a course plus a typed target institution also does **not** select a practice subject until ExamPilot has a validated, institution-specific JAMB IBASS record for that exact pairing. Stage 2 therefore stores planning information only and exposes no automatic subject filter, mock configuration, Tutor context, or question-bank change.

| Student input state | Saved state | Study-subject behaviour |
| --- | --- | --- |
| Course only; “Not sure yet” selected | `institutionPlanningStatus = not_sure` | Show the common combination as planning guidance; make no subject default. |
| Course plus target institution name | `institutionPlanningStatus = provided`, `institutionValidationStatus = not_checked` | Record the target for future IBASS validation; make no subject default. |
| Future validated course plus institution pairing | `institutionValidationStatus = verified` | Only then may a later phase offer a personalised subject default. |

## Persistent student-facing statement

Every course, regardless of confidence tier, displays this wording and the official destination:

> **Common combination — confirm for your university.** Requirements can vary by university and programme option. Confirm the current combination for your target institution in [JAMB’s IBASS Eligibility Checker](https://ibass.jamb.gov.ng/eligibility-checker) before registering.

The eight records that lack a primary-source match in the current validation sample remain searchable and selectable. They add the label **“Extra verification recommended”**. This is an informational condition, never a disabled or hidden state.

## Stage 2 data contract

The internal course catalogue is a server-owned static reference derived from the corrected review dataset. A learner record stores `courseKey`, `targetInstitutionName`, `institutionPlanningStatus`, `institutionValidationStatus`, and the time of the last selection. It stores neither a JAMB subject default nor an eligibility decision.

The protected `coursePreference` procedures return a safe catalogue, the current learner preference, and an explicit `subjectDefault: null` response. The server validates the supplied course key against the internal catalogue and resets a previously unverified preference to `not_checked` when course or institution changes.

## Product structure

The new **Course direction** page is searchable, mobile-first, and available from the student dashboard and sidebar. It uses a two-step form: course selection followed by target-institution choice, including **Not sure yet**. The completed state makes its non-defaulting behaviour visible: “No practice subjects have been selected from this course yet.” Existing Practice Mock, Tutor, Paystack, and question practice contracts remain unchanged.
