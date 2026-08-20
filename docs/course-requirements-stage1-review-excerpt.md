# Course Requirements Dataset: Review Excerpt

## Source authority — important qualification

The only **official JAMB source actually consulted** for this Stage 1 draft was the live [JAMB Integrated Brochure and Syllabus System (IBASS)][1]. It confirms the programme categories and is the authoritative place for institution-specific course, UTME, and O-Level checks. Its course-detail material is rendered dynamically, so I did **not** extract the individual course combinations directly from an official JAMB downloadable brochure or a university admissions page.

The draft combinations were instead cross-checked against the 2025 [BusinessDay course-combination explainer][2] and detailed course pages on [MySchoolGist][3]. Those pages explicitly caution that requirements can vary by institution and direct students back to JAMB’s brochure. No specific university admission page was used.

> **Approval implication:** This is appropriate as a **review-only onboarding baseline**, but it is not authoritative enough to activate a student-facing “correct subject combination” engine. Before Stage 2, every live record must be reconciled against the current IBASS course-and-institution record or a current official JAMB brochure export.

| Source | Used for | Authority in this draft | Currency limitation |
| --- | --- | --- | --- |
| [JAMB IBASS][1] | Official programme categories and mandatory final-validation route | **Primary** | Live JavaScript application; per-course detail values were not programmatically extracted in this Stage 1 pass. |
| [BusinessDay 2025][2] | Representative common UTME combinations across 50 courses | Secondary cross-check | Published for the 2025/2026 UTME cycle; not an official regulatory record. |
| [MySchoolGist course pages][3] | Detailed UTME and O-Level patterns for selected courses | Secondary cross-check | Pages carry their own institution-variation warning; underlying update dates and institution waivers need current IBASS validation. |

## Representative raw dataset records

The full machine-readable draft contains 46 records in `course-requirements-stage1-draft.json`. The exact records below cover the requested faculties; **English Language is compulsory in UTME** and therefore defined at the dataset’s top-level rule rather than duplicated within each `utme.subjects` array.

```json
[
  {
    "id": "medicine-and-surgery",
    "name": "Medicine and Surgery",
    "faculty": "Medical and Pharmaceutical Health Sciences",
    "utme": { "subjects": ["Biology", "Chemistry", "Physics"] },
    "oLevel": {
      "required": ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"]
    },
    "sourceRefs": ["jamb_ibass", "myschoolgist_medicine", "businessday_2025"]
  },
  {
    "id": "law",
    "name": "Law",
    "faculty": "Law",
    "utme": {
      "subjects": ["threeArtsOrSocialScienceSubjects"],
      "commonSpecificRoute": ["Literature in English", "Government", "oneOtherArtsOrSocialScience"]
    },
    "oLevel": {
      "required": ["English Language", "Literature in English", "Mathematics"],
      "otherRelevantCredits": 2
    },
    "sourceRefs": ["jamb_ibass", "myschoolgist_law", "businessday_2025"]
  },
  {
    "id": "computer-science",
    "name": "Computer Science",
    "faculty": "Sciences",
    "utme": {
      "subjects": ["Mathematics", "Physics", "oneOf: Chemistry|Biology"]
    },
    "oLevel": {
      "required": ["English Language", "Mathematics"],
      "atLeastThreeOf": ["Physics", "Chemistry", "Biology", "Further Mathematics"]
    },
    "sourceRefs": ["jamb_ibass", "myschoolgist_computer_science", "businessday_2025"]
  },
  {
    "id": "civil-engineering",
    "name": "Civil Engineering",
    "faculty": "Engineering",
    "utme": { "subjects": ["Mathematics", "Physics", "Chemistry"] },
    "oLevel": {
      "required": ["English Language", "Mathematics", "Physics", "Chemistry"],
      "otherScienceCredit": 1
    },
    "sourceRefs": ["jamb_ibass", "businessday_2025"]
  },
  {
    "id": "accounting",
    "name": "Accounting",
    "faculty": "Management and Administration",
    "utme": {
      "subjects": ["Mathematics", "Economics", "oneOf: Government|History|Geography|Literature in English|French|CRS|IRS"]
    },
    "oLevel": {
      "required": ["English Language", "Mathematics", "Economics"],
      "otherRelevantCredits": 2
    },
    "sourceRefs": ["jamb_ibass", "myschoolgist_accounting", "businessday_2025"]
  },
  {
    "id": "mass-communication",
    "name": "Mass Communication",
    "faculty": "Social Sciences",
    "utme": {
      "subjects": ["threeArtsOrSocialScienceSubjects"],
      "commonSpecificRoute": ["Literature in English", "Economics", "Government"]
    },
    "oLevel": {
      "required": ["English Language"],
      "otherRelevantCredits": 4,
      "institutionSpecificNote": "Some institutions additionally name Literature in English, Government, or a Mathematics pass."
    },
    "sourceRefs": ["jamb_ibass", "myschoolgist_mass_communication", "businessday_2025"]
  },
  {
    "id": "agriculture",
    "name": "Agriculture",
    "faculty": "Agriculture",
    "utme": {
      "subjects": ["Biology or Agricultural Science", "Chemistry", "oneOf: Physics|Mathematics"]
    },
    "oLevel": {
      "required": ["English Language", "Mathematics", "Biology or Agricultural Science", "Chemistry"],
      "otherRelevantCredit": 1
    },
    "sourceRefs": ["jamb_ibass", "businessday_2025"]
  }
]
```

## How to read these records

The `sourceRefs` are keys into the full JSON’s `sources` object. They are provenance labels, not claims that an official JAMB course detail was parsed. `oneOf`, `atLeastThreeOf`, `threeArtsOrSocialScienceSubjects`, and `commonSpecificRoute` deliberately preserve course and institution alternatives rather than collapsing them into a false single combination. The application should not convert them into an eligibility determination until the IBASS reconciliation step is complete.

## References

[1] [JAMB Integrated Brochure and Syllabus System (IBASS)](https://ibass.jamb.gov.ng/brochure-by-programme)

[2] [BusinessDay: 2025 JAMB/UTME subject combinations](https://businessday.ng/news/article/2025-jamb-utme-subject-combination-for-medicine-computer-science-48-other-courses/)

[3] [MySchoolGist: JAMB subject-combination index](https://myschoolgist.com/news/jamb-subjects-combination/)
