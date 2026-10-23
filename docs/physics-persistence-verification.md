# Physics Persistence Verification Evidence

## Authenticated Practice interface

On the authenticated Practice route, the JAMB subject selector visibly includes **Physics** alongside Biology, Chemistry, English, and Mathematics. The initially rendered question after persistence was tagged **Physics / Current Electricity / Easy** and displayed the persisted 4 Ω, 12 V resistor question with the expected `D — 3 A` option.

This is direct rendered-interface evidence only; the remaining sections will record Practice Mock, database, and automated-check evidence.

## Authenticated Practice Mock interface

On the authenticated Practice Mock setup route, **Physics** appears as a selectable JAMB subject card with **0 original questions · 48 approved AI questions**. The setup screen states that the selectable subjects collectively use the current 149-question JAMB bank, and Physics is included in the selectable-subject list.

## Transaction and database verification

The approved importer completed a single database transaction with the following post-commit values:

| Check | Verified result |
| --- | ---: |
| JAMB Physics subject ID | 2,370,001 |
| Physics question rows | 48 |
| `isAIGenerated = true` rows | 48 |
| Distinct question texts | 48 |
| Persisted granular topic labels | 34 |
| A / B / C / D keys | 12 / 12 / 12 / 12 |
| Easy / Medium / Hard | 14 / 26 / 8 |

The importer also carries the user-approved correction for the Batch 1 electrostatics question: `0.6 N` is stored with key **B**. Its source is stored as `ExamPilot Approved Claude Physics Batch v1`, and each record carries the approved Claude-authored, user-authorized provenance tags.

### Approved-area distribution from stored Physics rows

| Approved Physics area | Persisted questions |
| --- | ---: |
| Measurements, units, dimensions, and errors | 3 |
| Scalars and vectors | 2 |
| Motion, Newton’s laws, projectiles, circular motion, and SHM | 6 |
| Gravitation and equilibrium | 3 |
| Work, energy, power, friction, machines, and elasticity | 5 |
| Pressure and liquids at rest | 3 |
| Thermal physics | 7 |
| Waves and sound | 6 |
| Light and optics | 5 |
| Electrostatics and current electricity | 3 |
| Magnetism, electromagnetic induction, and alternating current | 3 |
| Atomic, nuclear, and basic electronics | 2 |

## Automated verification

The new `physicsAvailability.integration.test.ts` passed. It queries the real persisted catalogue and verifies that Practice filters include JAMB Physics with 34 topics and that Practice Mock reports 0 original and 48 approved-AI Physics questions.

The full local suite contains one unchanged external Paystack credential probe that timed out after five seconds. All non-external application tests passed: **20 files and 58 tests**. TypeScript validation also passed with `tsc --noEmit`.
