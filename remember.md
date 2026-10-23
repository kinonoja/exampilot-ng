# REMEMBER — Where We Stopped (2026-09-12)

Session state for the next pickup. The session's command-safety classifier was
down all day: read-only commands worked, but **no test run, type check, or
generation script could be executed**. Everything below marked ⏳ is blocked on
that, not on any code problem.

## 1. Billing reconciliation test — fixes APPLIED, verification ⏳

**Diagnosis (complete):** the 5000ms timeout was vitest's default `testTimeout`
(no override exists in the repo). Not a hung query — every statement is
autocommit, index-covered, no lock contention. Root cause is cumulative TiDB
Serverless connection latency: the test opened 2–3 fresh TLS connections to
`gateway01.us-east-1.prod.aws.tidbcloud.com` plus ~8 sequential round trips
inside the 5s window, made worse by TiDB resume-from-idle. It passed on Aug 22
(commit 91b8d39) when the cluster was warm — the failure is environmental.

**Fixes applied (user-confirmed, all four):**

- `server/billing.reconciliation.integration.test.ts` — rewritten:
  - `beforeAll` opens ONE shared connection + `SELECT 1` warm-up (absorbs
    handshake/resume cost under `hookTimeout`), 30s hook timeout
  - test body and `afterEach` reuse that connection (no 2nd/3rd cold handshake)
  - `afterAll` ends the connection and calls `closeDb()`
  - per-test timeout raised to 30_000 (unit tests keep the 5s default)
- `server/db.ts` — `getDb()` now creates the mysql2 pool explicitly and holds
  the reference (was `drizzle(url)`, which hides the pool); added
  `closeDb()` which ends the pool and resets the singleton. No other call
  sites changed.

**⏳ NOT YET VERIFIED — run when possible:**

```
npx vitest run server/billing.reconciliation.integration.test.ts
npx tsc --noEmit
```

## 2. Chemistry batch via new Anthropic pipeline — script READY, run ⏳

User decision: jambSyllabusAvailability passing; Chemistry/Physics availability
tests fail as expected (no science question bank persisted yet). Next step is
drafting a 48-question Chemistry batch through the **direct Anthropic
pipeline** (replacing the dead Forge transport) for user review. **Review-only
— NO database persistence without separate explicit user approval.**

**Done:** `scripts/generateChemistryBatchAnthropic.mjs` created. It:
- uses the same transport as `server/anthropic.ts` (x-api-key,
  `/v1/messages`, `output_config.format` structured output, equal-jitter retry)
- model `claude-sonnet-4-6` per `docs/science-question-batch-quality-contract.md`
- approved 48-slot plan: exact topic allocation, 14 easy / 25 medium / 9 hard,
  exactly 12 answer keys per letter (A–D)
- validates via `validateSubjectBatch` from `scripts/scienceQuestionValidation.mjs`
- read-only live-bank stem-overlap check (Jaccard ≥ 0.45)
- writes artifact to `exampilot-research/chemistry-anthropic-draft.json` (no DB writes)

**⏳ Remaining steps:**

1. `node scripts/generateChemistryBatchAnthropic.mjs` (needs ANTHROPIC_API_KEY
   from .env — present)
2. Independent key-blind review of the artifact (solve each question, compare
   to generated key; check answer/difficulty/topic distributions)
3. Write `docs/chemistry-anthropic-batch-draft-review.md` in the established
   review-doc style (see `docs/user-authorized-chemistry-batch-01-review.md`)
4. Present to user; persistence only after explicit approval (adapt
   `scripts/persistApprovedChemistryBatch.mjs` — note it maps `question.topic`
   labels directly to DB topic names, and asserts Chemistry currently has 0
   questions)
5. After Chemistry: same flow for Physics (same contract, 48 questions,
   14/26/8 difficulty)

## Context pointers

- Migration design: `docs/ANTHROPIC_PROVIDER_MIGRATION_PLAN.md`
- Coverage plan + slot allocations: `docs/chemistry-physics-question-bank-coverage-plan.md`
- Quality contract: `docs/science-question-batch-quality-contract.md`
- Chemistry availability expectations: `server/chemistryAvailability.integration.test.ts`
  (expects 0 original / 48 AI Chemistry questions; ≥23 Chemistry topics)
- `ANTHROPIC_GENERATION_MODEL`/`ANTHROPIC_TUTOR_MODEL` are unset in .env; env.ts
  defaults both to `claude-haiku-4-5-20251001` (in-app on-demand path only —
  the batch script pins sonnet itself)

## Files changed this session (uncommitted)

- `server/billing.reconciliation.integration.test.ts` (reworked)
- `server/db.ts` (pool reference + closeDb)
- `scripts/generateChemistryBatchAnthropic.mjs` (new)

Do not commit/push anything without the user's ask. No DB writes have occurred.
