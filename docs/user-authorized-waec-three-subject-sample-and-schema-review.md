# WAEC Three-Subject Samples and Schema Readiness — Review-Only Result

## Review boundary and provenance

This review covers 15 user-authorized, Claude-authored original **WAEC-style practice** questions: five each for General Mathematics, Chemistry, and Physics. The user confirmed the content is original, not copied from past papers or third-party sites, and grounded only in the approved official-source WAEC topic plan. No WAEC content was inserted into the database, shown to students, or represented as a WAEC past paper.

The review plan is deliberately conservative: WAEC’s public e-Learning resources inform the documented subject domains and quality expectations, not a claimed exhaustive current syllabus.[1] [2] [3] [4]

## Three-subject sample result

| Subject | Records | Topic-plan result | Calculation / concept review | Overlap result | Decision |
| --- | ---: | --- | --- | --- | --- |
| General Mathematics | 5 / 5 | All five planned domains represented | All calculations and keys correct | Lexical flags manually cleared as non-duplicates | Accepted into held review collection |
| Chemistry | 5 / 5 | All five planned domains represented | All calculations and keys correct | No high-similarity match | Accepted into held review collection |
| Physics | 5 / 5 | All five planned domains represented | All calculations and keys correct | No high-similarity match | Accepted into held review collection |

### Physics independent review

| Topic | Verified key and reasoning |
| --- | --- |
| Measurement and dimensional analysis | **A — [M][L]⁻³.** Density is mass divided by volume. |
| Mechanics and motion | **B — 17.3 m/s.** Horizontal component is `20 × cos 30°`. |
| Elasticity and material behaviour | **A — 0.25 J.** Elastic energy is `½Fx = ½ × 10 × 0.05`. |
| Thermal, kinetic theory and waves | **B — gases are more widely spaced, faster-moving, and have weaker intermolecular forces.** |
| Space, electronics and practical reasoning | **C — rectification.** Diodes convert AC to DC. |

The Physics sample distribution is A:2, B:2, C:1; its difficulty pattern is 1 easy, 3 medium, and 1 hard. Together with the previously reviewed Chemistry and General Mathematics samples, the content is appropriately spread for a small, one-per-domain review sample. Answer-letter balancing is not imposed on this five-item-per-subject review stage; it will be a separate constraint for any larger approved batch.

## Does the schema support `examBoard`?

**Yes—no migration is required merely to persist WAEC content.** The user-provided `examBoard: "WAEC"` field is useful batch metadata, but its database counterpart already exists as the relational `exams` table:

| Existing table / field | Current role | WAEC representation |
| --- | --- | --- |
| `exams.name` | Unique examination-board identity | Insert one `WAEC` exam row |
| `subjects.examId` | Links a subject to a board | Create WAEC-specific Mathematics, Chemistry, and Physics subjects |
| `topics.subjectId` | Scopes topic names to a board-specific subject | Create WAEC-specific topic rows |
| `questions.examId`, `subjectId`, `topicId` | Canonical question ownership | Store each WAEC question under its WAEC hierarchy |

The current database has **no WAEC exam row**, which is correct because this remains a review-only stage. A future approved importer can create the `WAEC` row and its subject/topic/question rows transactionally without altering the Drizzle schema. The batch-level `examBoard` property should be validated against and translated to the `exams.name` row during import; it does **not** need a duplicated `questions.examBoard` column.

> **Decision:** The three WAEC review samples are accepted into the held collection and the current schema is ready for a future approved WAEC import. No migration, no database row, and no student-facing WAEC feature has been created in this step. A separate explicit persistence approval remains required.

## References

[1] [WAEC e-Learning Toolkit](https://www.waeconline.org.ng/e-learning/)

[2] [WAEC General Mathematics Paper 2, WASSCE (PC), 2023](https://www.waeconline.org.ng/e-learning/Mathematics/maths240jc.html)

[3] [Official WAEC Chemistry examiner-commentary entry](https://www.waeconline.org.ng/e-learning/Chemistry/Chem240mq1.html)

[4] [WAEC Physics 2024 General Comment](https://www.waeconline.org.ng/e-learning/Physics/Phys340mc.html)
