# Direct Anthropic Provider Migration Plan

## Purpose

Replace the current Manus Forge-backed LLM transport for **Tutor** and **on-demand practice generation** with direct requests to Anthropic’s Messages API using a user-owned `ANTHROPIC_API_KEY`. The Vercel runtime-adaptation work remains deliberately paused until this provider boundary is portable.

## What remains unchanged

The migration does **not** alter student-facing Tutor pedagogy or product policy. The following are preserved byte-for-byte or behavior-for-behavior:

| Area | Preserved behavior |
|---|---|
| Tutor system prompt | `TUTOR_SYSTEM_PROMPT` in `server/tutorPrompt.ts` remains the authoritative prompt. |
| Tutor modes | Existing Direct and Guided detection, persisted mode, and mid-session mode switching remain unchanged. |
| Safety and off-topic boundaries | `getTutorBoundaryResponse` remains local deterministic logic and continues to run before the model call. |
| Free/Pro enforcement | Existing daily allowance and entitlement calculation run before the provider call. |
| Linked-question help | Existing question context and verified answer/explanation fallback remain unchanged. |
| Tutor UI | No client-page copy, route, or state-flow rewrite is required. |
| Generation prompt and validation | Existing original-question prompt, duplicate checks, option validation, topic context, and persistence gate remain intact. |
| Question provenance | Generated rows remain `isAIGenerated: true` and preserve the existing source label. |

## Exact code changes

| File or area | Change |
|---|---|
| `server/_core/env.ts` | Add `ANTHROPIC_API_KEY`; optionally add model configuration values while preserving unrelated managed values for other framework capabilities. |
| New `server/anthropic.ts` | Create one server-only Messages API client. It will call `https://api.anthropic.com/v1/messages` with `x-api-key`, `anthropic-version`, `content-type`, model, `max_tokens`, top-level `system`, and user/assistant message history. The client returns normalized text and input/output token usage to the existing services. |
| `server/tutor.ts` | Replace only the `invokeLLM` import/call. `TUTOR_SYSTEM_PROMPT`, session context, model selection policy, token accounting, fallback, entitlement checks, and stored conversation history remain unchanged. Anthropic requires initial instructions in a top-level `system` field, so the two present system messages are combined there while user/assistant history is passed unchanged. |
| `server/practiceGeneration.ts` | Replace only the `invokeLLM` call. Keep the existing generation prompt and post-response validation. Replace the OpenAI-style `response_format` request with Anthropic `output_config.format` JSON Schema, then retain the app’s independent parsing and quality checks. |
| Availability/error mapper | Extend the provider failure classification to translate Anthropic 429/5xx/network failures into the existing learner-safe temporary-unavailability message. Credential errors are never surfaced with provider detail to students. |
| Tests | Add request-shape and error-mapping coverage for the direct client; retain existing Tutor policy, fallback, Free-limit, and generated-question validation tests. Add an authorised live probe only after the user-provided key is configured. |
| Deployment configuration | Add only `ANTHROPIC_API_KEY` to Vercel after the direct client passes local validation. No Forge key is carried into Vercel for Tutor/generation. |

## Model configuration

The existing app currently requests `claude-haiku-4-5` through its managed gateway. Direct Anthropic model identifiers are account and API-specific, so the migration will use environment-configurable model names rather than silently assuming that gateway alias is accepted directly. The initial configuration will support:

| Variable | Required | Role |
|---|---:|---|
| `ANTHROPIC_API_KEY` | Yes | User-owned Anthropic API key, server only. |
| `ANTHROPIC_TUTOR_MODEL` | Recommended | Model for short Tutor responses; set after confirming availability in the user’s Anthropic console. |
| `ANTHROPIC_GENERATION_MODEL` | Recommended | Model for structured question generation; can initially match the Tutor model. |

## External API compatibility

Anthropic’s Messages API accepts a top-level system instruction, user/assistant message history, a model name, and a token limit; responses return text blocks and input/output token usage.[^messages] Anthropic also documents JSON Schema constrained output through `output_config.format`, which maps directly to the app’s structured practice-generation requirement.[^structured]

## Scope and effort

This is a **small-to-medium backend integration**, not a Tutor redesign: one provider client, two call-site substitutions, environment handling, provider-specific tests, and one user-authorised live check. There are no database migrations or client UI rewrites. I will not promise a clock-time completion because live validation depends on the user-owned key and the selected model being enabled, but the code work is bounded and can begin immediately once that key is supplied securely.

## Preconditions for implementation

1. The user supplies an Anthropic API key through the secure secret flow, never chat or source control.
2. The user confirms which enabled direct Anthropic model to use, or authorizes a safe API model-list/probe with the supplied key.
3. The provider key is approved for server-side use and billed under the user’s Anthropic account.
4. After tests pass, the user authorizes a single live Tutor and a single generation probe against a non-production or clearly designated test account.

[^messages]: [Anthropic, “Working with the Messages API”](https://platform.claude.com/docs/en/build-with-claude/working-with-messages), accessed 22 August 2026.
[^structured]: [Anthropic, “Structured outputs”](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), accessed 22 August 2026.
