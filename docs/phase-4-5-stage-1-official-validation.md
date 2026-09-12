# Phase 4.5 Stage 1: Official JAMB Validation Pass

## Outcome and scope

The 46-course file remains an **internal review baseline only**. It is not seeded, not connected to onboarding, and not surfaced to students. This pass located JAMB’s public, official IBASS API and used it to retrieve course records from the University of Lagos, University of Ibadan, University of Benin, and the Federal University of Agriculture, Abeokuta. JAMB’s own FAQ identifies the IBASS Eligibility Checker as the place candidates should use to see programmes by institution and the UTME combination for each course. [1]

The apparent official static PDF path indexed by search returned the IBASS web application HTML rather than a PDF when fetched. The reliable official material available for this review was therefore the live IBASS programme data, not a downloadable brochure export. Some returned official records show a historical `updated_at` value (for example, 2023), so “current” means **currently accessible in JAMB’s live official service on 20 August 2026**, not independently verified as newly revised for the 2026 cycle.

| Confidence tier | Count | Meaning |
| --- | ---: | --- |
| High | 12 | The draft’s core UTME pattern agrees with a returned official IBASS course record and the secondary cross-check. |
| Medium | 26 | Official IBASS evidence was returned, but it contains a broader/narrower alternative, an institution-specific O-Level condition, or a material difference from the draft. |
| Unvalidated | 8 | The course did not return a record in the sampled official institutions; no universal claim should be made from the current draft. |

## High-confidence records

| Course | Official validation sample | Core UTME finding |
| --- | --- | --- |
| Medicine and Surgery | University of Lagos | English, Biology, Chemistry, Physics; O-Level English, Mathematics, Biology, Chemistry, Physics. |
| Nursing Science | University of Lagos | English, Biology, Chemistry, Physics; matching five science/English/Math O-Level pattern. |
| Pharmacy | University of Lagos | English, Physics, Chemistry, Biology; matching five-credit science pattern. |
| Pharmacology | University of Lagos | English, Biology, Chemistry, Physics; matching five-credit science pattern. |
| Biochemistry | University of Lagos | English, Biology, Chemistry, Physics; matching five-credit science pattern. |
| Industrial Engineering | University of Benin | Mathematics, Physics, Chemistry; matching draft. |
| Agricultural Engineering | Federal University of Agriculture, Abeokuta | Mathematics, Chemistry, Physics; matching draft. |
| Computer Science | University of Lagos | English, Mathematics, Physics, and Chemistry or Biology; matching draft. |
| Economics | University of Lagos | English, Mathematics, Economics, plus an approved relevant subject; matching draft pattern. |
| Theatre Arts | University of Ibadan | English, Literature in English, plus two Arts/Social Science subjects; matching draft. |
| Education and Biology | University of Lagos | English, Biology, plus two approved science subjects; compatible with draft pattern. |
| Education and Physics | University of Lagos | English, Physics, Mathematics or Chemistry, plus Biology or Agricultural Science; matching draft. |

## Medium-confidence records — official evidence exists, but do not present one universal fixed combination

| Course group | Courses | Reason for the lower confidence |
| --- | --- | --- |
| Engineering O-Level variation | Civil, Electrical/Electronics, Mechanical, Chemical, Computer Engineering | The official University of Lagos records match the Mathematics–Physics–Chemistry UTME core, but state Further Mathematics in the five-credit O-Level set. The draft’s generic “other science” representation is too broad for a universal answer. |
| Built environment alternatives | Architecture, Quantity Surveying, Surveying and Geoinformatics, Urban and Regional Planning | Official alternatives overlap the draft but differ in allowed option sets. For example, the sampled Surveying record uses Mathematics, Physics, Chemistry, whereas the draft allowed a broader third-subject choice. |
| Core science differences | Mathematics, Physics, Chemistry, Biology, Geology | Official IBASS returned several variants. The clearest material difference is Geology: the sampled record is English, Mathematics, Physics, Chemistry, while the draft emphasised Geography. This must be flagged, not silently retained. |
| Management and social-science variation | Accounting, Business Administration, Banking and Finance, Political Science, Sociology, Psychology, Mass Communication | Official subject sets support the broad pathways but define narrower or different subject patterns per course. Sociology, Psychology, and Mass Communication in particular should not be reduced to one generic “three Arts/Social Sciences” route. |
| Law and language variation | Law, French | The official sample for Law accepts three Arts/Social Sciences with institution-specific restrictions; the sampled French record permits any three Arts/Social Sciences and does not universally require French. |
| Education alternatives | Education and Chemistry, Education and Mathematics, Education and English Language | Official records show different permissible combinations from the narrower draft options. |

## Unvalidated records in this pass

The following courses did not return an official record at the sampled institutions. That does **not** mean they are unavailable nationally; it means the current draft lacks a direct official match in this validation sample.

| Course | Required treatment before any student-facing use |
| --- | --- |
| Nutrition and Dietetics | Verify on the target institution’s live IBASS record. |
| English and Literary Studies | Verify on the target institution’s live IBASS record. |
| History and International Studies | Verify on the target institution’s live IBASS record. |
| Fine and Applied Arts | Verify on the target institution’s live IBASS record. |
| Agriculture | Verify on the target institution’s live IBASS record. |
| Fisheries and Aquaculture | Verify on the target institution’s live IBASS record. |
| Forestry and Wildlife Management | Verify on the target institution’s live IBASS record. |
| Food Science and Technology | Verify on the target institution’s live IBASS record. |

## Required future product wording and behaviour

The course engine should never describe a baseline as the universally “correct” combination. For any future course display, use this disclosure directly beneath the recommended subjects:

> **Common UTME combination:** English Language plus the subjects shown. Requirements can vary by university and programme option. Confirm the current combination for your target institution in JAMB’s IBASS Eligibility Checker before registering.

For a medium or unvalidated record, the UI must use the label **“Common combination — confirm for your university”**, not **“Required combination.”** The product should collect a target institution before it promotes a course combination to an institution-specific recommendation. Until that lookup is implemented, Stage 2 should limit itself to a clearly marked planning preference or postpone course-derived subject defaults.

## Disagreement register

| Draft record | Official evidence observed | Action required |
| --- | --- | --- |
| Geology | University of Lagos lists English, Mathematics, Physics, Chemistry. | Do not use the draft’s Geography-led pattern as default; resolve per target institution. |
| Surveying and Geoinformatics | University of Lagos lists English, Mathematics, Physics, Chemistry. | Narrow the draft only after wider institution validation; retain a variation warning. |
| Engineering disciplines above | University of Lagos lists Further Mathematics in O-Level requirements. | Do not collapse O-Level details into “one other science.” |
| French | University of Lagos’s returned record accepts English plus three Arts/Social Science subjects. | Do not universally require UTME French. |
| Mass Communication | University of Lagos returns English, Literature in English, plus two Arts/Social Science subjects. | Do not present the draft’s Economics/Government route as universal. |

## References

[1] [JAMB FAQ — IBASS Eligibility Checker](https://jamb.gov.ng/FAQ)

[2] [JAMB Integrated Brochure and Syllabus System (IBASS)](https://ibass.jamb.gov.ng/brochure-by-programme)

[3] [Official JAMB IBASS programme endpoint, accessed through the public IBASS application](https://ibass.jamb.gov.ng/brochure-by-institution)
