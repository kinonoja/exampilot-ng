# ExamPilot NG

ExamPilot NG is a mobile-first Nigerian exam-preparation app. **JAMB practice is currently live**; WAEC, NECO, and NABTEB content is not yet student-facing.

## Current system status

| Area | Status | Student-facing behaviour | Owner / next action |
|---|---|---|---|
| JAMB Practice and short Practice Mock | Available | Learners can practise current JAMB bank questions and use the clearly labelled short Practice Mock. | Application team. |
| Tutor and generated practice | Temporarily limited by external service capacity | Linked Practice/Mock questions use their stored verified explanation. Generic Tutor and question generation show a plain temporary-unavailability message. | Retry only after the external provider capacity recovers. |
| Paystack Test Mode verification | Sandbox probe currently blocked by Cloudflare | The app’s billing UI remains available; no credential change should be inferred from the sandbox 403. | Re-run the non-transactional probe from an approved network path. |
| Production payments | Not yet independently verified | Never state that Live Mode has been verified. | Follow the staged live-payment checklist before launch. |

## Safety and content rules

The project must not use third-party “free past-question” websites, scraped content, or unlicensed exam material. The 15 reviewed original WAEC-style samples are held for review only and must not be imported without explicit approval. NECO and NABTEB content require authorised source material before generation.

Course Direction is a planning guide. It must retain **“Common combination — confirm for your university.”** and must never silently assign Practice or Mock subjects.

## Development checks

```bash
pnpm validate
```

The omitted Paystack credential probe is an external network/WAF check, not an application-owned unit test. Run `pnpm test:external:paystack` separately only from an approved path.

## Key operational documents

| Document | Purpose |
|---|---|
| [`docs/exampilot-ng-project-issue-register-2026-08-22.md`](./docs/exampilot-ng-project-issue-register-2026-08-22.md) | Full resolved/active/deferred issue register and recommended work order. |
| [`docs/paystack-test-mode-verification-report.md`](./docs/paystack-test-mode-verification-report.md) | Test Mode subscription, webhook, cancellation, reconciliation, and decline evidence. |
| [`docs/waec-neco-official-materials-report.md`](./docs/waec-neco-official-materials-report.md) | Official-source boundary for WAEC and NECO content. |
| [`docs/live-sprint-validation-notes.md`](./docs/live-sprint-validation-notes.md) | Latest authenticated live-flow evidence. |
