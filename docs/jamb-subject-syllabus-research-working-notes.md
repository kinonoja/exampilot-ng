# JAMB Subject and Syllabus Research — Working Notes

**Research start:** 22 August 2026 (Africa/Lagos)  
**Scope:** Current official JAMB/IBASS UTME subject catalogue and subject-level syllabus/topic structure. No subject, topic, or question records are being imported during this research stage.

## Primary source discovered

| Source | Finding | Use in the project |
|---|---|---|
| [JAMB IBASS E-syllabus](https://ibass.jamb.gov.ng/e-syllabus) | Official JAMB Integrated Brochure & Syllabus System page. The first page visibly lists Agriculture Science, Arabic, Art, Biology, Chemistry, Christian Religious Studies, Commerce, Computer Studies, Economics, French, Geography, and Government, with subject detail actions and pagination. | Primary source for the complete subject inventory and individual subject syllabus/topic extraction. |

The visible page indicates that the catalogue is paginated and must be collected across all pages before any claim about a complete list is made. The next research step is to identify the catalogue’s underlying data source or traverse each page and then inspect every official subject detail document.

## Official source behaviour and extraction constraints

| Check | Result | Research implication |
|---|---|---|
| Agriculture Science “View details” modal | The official page opened the subject detail modal but displayed **“No document available or PDF renderer not loaded.”** | The catalogue is authoritative for subject names, but its in-page PDF renderer is not sufficient evidence for all topic extraction. |
| IBASS application bundle | The public client configuration exposes `https://ibass-api.jamb.gov.ng/api` as its API base. | API route names must be discovered from public client behaviour or other official documents; routes will not be guessed for writes. |
| API root probe | The API root returned a route-not-found response. | The root is not a documentation endpoint. |
| Public source map | The source map is advertised at about 25 MB but the download timed out after only 384 KB. | It is not an efficient extraction path in this environment; move to browser pagination and official subject documents. |

The official catalogue was reloaded successfully after the Agriculture Science modal test. The remaining work is to record pages 2 and 3 of the official subject list and identify alternative official syllabus artefacts where IBASS has no loadable detail document.

## Official subject inventory — page 2

The second official IBASS catalogue page lists: Hausa; History; Home Economics; Igbo; Islamic Studies; Literature in English; Mathematics; Music; Physics; Physical and Health Education; Principles of Accounts; and Use of English. The page still presents three pages in total, so this is not yet a complete inventory.

## Official subject inventory — page 3 and complete count

The final official IBASS catalogue page lists Yoruba only. Across the three official pages, the current e-syllabus inventory contains **25 subject entries**:

1. Agriculture Science
2. Arabic
3. Art
4. Biology
5. Chemistry
6. Christian Religious Studies
7. Commerce
8. Computer Studies
9. Economics
10. French
11. Geography
12. Government
13. Hausa
14. History
15. Home Economics
16. Igbo
17. Islamic Studies
18. Literature in English
19. Mathematics
20. Music
21. Physics
22. Physical and Health Education
23. Principles of Accounts
24. Use of English
25. Yoruba

This is an official subject catalogue observation from the 25-entry IBASS e-syllabus interface; it should not yet be treated as an approved database import until subject-level topic sources are reconciled and reviewed.

## Official corpus status

The complete set of 25 official IBASS PDF documents has now been downloaded from the hashed source paths identified in the public official client bundle and converted to text for analysis. The permanent project-side provenance links are recorded in [`JAMB_OFFICIAL_SYLLABUS_SOURCE_MANIFEST.md`](./JAMB_OFFICIAL_SYLLABUS_SOURCE_MANIFEST.md). The database and live subject selector remain unchanged while clean topic labels are reconciled for review.

## Review package completed

The review-only catalogue and import design is now available at [`JAMB_SUBJECT_TOPIC_REVIEW_PACKAGE.md`](./JAMB_SUBJECT_TOPIC_REVIEW_PACKAGE.md). Validation confirms that it has 25 numbered subject sections, 25 official PDF links, and an explicit no-import-until-approved boundary. It preserves the existing five JAMB subject identifiers as a design constraint and describes the truthful syllabus-mapped/no-questions-yet state required for the 20 new subjects.
