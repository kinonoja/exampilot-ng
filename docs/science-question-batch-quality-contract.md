# JAMB Chemistry and Physics Batch: Quality Contract

## Approved scope

This contract governs the approved expansion of the JAMB bank by **48 original Chemistry questions** and **48 original Physics questions**. It applies before database insertion and is intentionally stricter than a spot-check workflow.

| Requirement | Enforced rule |
| --- | --- |
| Originality | Every item is newly written practice content. Prompts prohibit copied or near-copied past-question wording and source references to an historic paper. |
| Record structure | Each item has one approved topic, `easy`, `medium`, or `hard` difficulty, exactly four keyed options (`A`–`D`), one answer key, an explanation, and an internal calculation/concept check. |
| Topic coverage | Chemistry and Physics must each total 48 items and exactly match the approved topic-count allocation. |
| Difficulty balance | Chemistry must be 14 easy / 25 medium / 9 hard. Physics must be 14 easy / 26 medium / 8 hard. These totals match the approved per-topic allocations after correcting a one-question addition error in each former summary cell. |
| Answer-key balance | Each subject must contain **exactly 12** correct answers for each letter `A`, `B`, `C`, and `D`. |
| Explanation quality | Every explanation must be substantive, identify why the keyed answer is correct, and pass an independent explanation and option-quality review. |
| Calculation assurance | Every question is independently solved without exposing its generated key. The reviewer’s answer must match the generated key; any numerical item also requires an explicit method/result check. |
| Persistence safety | No record is inserted unless all programmatic schema, coverage, answer-balance, independent-solution, and explanation-quality checks pass. Insertion is transactional. |

## Independence safeguard

Generation uses `claude-sonnet-4-6`. A separate reviewer model receives only each question and its options during the first review pass; it does not receive the generated key or explanation. The implementation compares that independently solved answer with the generated key. A second pass evaluates the explanation and option quality. This separation prevents an explanation from simply confirming the generator’s own answer.

## Output evidence

The run produces machine-readable generation and validation artefacts outside the application code, plus a project report recording the persisted topic, difficulty, and answer-key distributions. No temporary review artefact is treated as student-facing content.
