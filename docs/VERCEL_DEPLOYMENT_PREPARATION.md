# Vercel Deployment Preparation

## Current status

The source is published to the private GitHub repository: <https://github.com/kinonoja/exampilot-ng>.

> **Important:** ExamPilot NG is not yet a direct one-click Vercel deployment. The current production command starts a long-running Express server (`node dist/index.js`), whereas Vercel requires the HTTP application to be adapted to its serverless-function model (or deployed to a Node host that supports a persistent Express process). Do not point Vercel at the repository until that adapter and its deployment validation are complete.

Manus provides built-in hosting with custom-domain support. If Vercel remains the preferred host, the compatibility work below is required before relying on it for student traffic.

## Runtime environment variables

Set the following values in the **Production**, **Preview**, and **Development** environments appropriate to the stage being tested. Never commit their values to GitHub.

| Variable | Required | Visibility | Purpose | Vercel guidance |
|---|---:|---|---|---|
| `DATABASE_URL` | Yes | Server only | MySQL/TiDB database connection used by Drizzle | Use a dedicated external TiDB Cloud connection string; enforce TLS as provided by the database host. |
| `JWT_SECRET` | Yes | Server only | Signs and verifies ExamPilot session cookies | Generate a long, random secret; keep it stable across deployments. |
| `VITE_APP_ID` | Yes | Public build-time value and server | Manus OAuth client/project identifier | Must match the OAuth application whose redirect URLs include the Vercel domain. |
| `VITE_OAUTH_PORTAL_URL` | Yes | Public build-time value | Browser login portal base URL | Used by the sign-in redirect in `client/src/const.ts`. |
| `OAUTH_SERVER_URL` | Yes | Server only | Exchanges OAuth authorization codes and reads user identity | Must be reachable from Vercel functions and compatible with the Vercel callback URL. |
| `PAYSTACK_SECRET_KEY` | Yes for billing | Server only | Initializes, verifies, cancels, and validates Paystack events | Use a Test key in Vercel Preview; use the Live key only after the human-approved Live checklist. |
| `PAYSTACK_PRO_PLAN_CODE` | Yes for billing | Server only | Paystack recurring-plan identifier used during checkout initialization | Must belong to the same Paystack mode as `PAYSTACK_SECRET_KEY`. |
| `BUILT_IN_FORGE_API_URL` | Yes for Tutor/generation | Server only | Manus Forge endpoint used by the current LLM integration | External use is not assumed to be portable; confirm a production-compatible credential/endpoint before Vercel deployment. |
| `BUILT_IN_FORGE_API_KEY` | Yes for Tutor/generation | Server only | Authorizes current LLM/Forge calls | Treat as non-exportable until Manus confirms an external-hosting-compatible credential path. |

`NODE_ENV` is set by Vercel for production deployments; `PORT` must **not** be set manually. The current billing integration uses Paystack's server-created access code and does **not** consume `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`; it is therefore not required by the present code path. The project’s map component references `VITE_FRONTEND_FORGE_API_URL` and `VITE_FRONTEND_FORGE_API_KEY`, but that component is not part of the current ExamPilot student flow. Add those only if Maps is introduced into a deployed route and a portable Forge configuration has been approved.

## Database readiness

The active `DATABASE_URL` resolves to `gateway05.us-east-1.prod.aws.tidbcloud.com` using the MySQL protocol. This is a **TiDB Cloud managed database**, not a database confined to the sandbox filesystem. No data migration from a local sandbox database is currently required.

The presently injected connection URL is managed by the existing environment and must not be copied from logs or source control. Before deploying to Vercel, create or obtain a dedicated TiDB Cloud connection credential, place it in Vercel as `DATABASE_URL`, and confirm the TiDB Cloud network policy permits Vercel function traffic. Use the TLS parameters from the TiDB Cloud connection panel exactly as issued.

## Required Vercel adaptation and launch checks

1. Convert the Express entry point into a Vercel Node function or choose a persistent Node host instead. The existing `build`/`start` scripts alone are not a Vercel serverless adapter.
2. Add the Vercel production and preview domains to the configured OAuth redirect allowlist. The callback path is `/api/oauth/callback`.
3. Configure the Paystack webhook endpoint only after the final public domain is live: `https://<domain>/api/webhooks/paystack`.
4. Run database migrations from a controlled deploy step against the dedicated TiDB Cloud URL; do not run destructive migrations automatically against production.
5. Validate sign-in, Practice, Mock, and a Test Mode Paystack checkout on the deployed URL. Keep the separate human-authorized Live Mode payment checklist in force.
6. Confirm whether Forge/Manus OAuth credentials are authorized for traffic originating from Vercel. Tutor and generation must remain truthfully unavailable if portability is not established.

## Non-sensitive deployment checklist

| Check | Current answer |
|---|---|
| Source repository | Private GitHub repository created and pushed. |
| Database location | External TiDB Cloud hostname; not sandbox-only. |
| Database credentials ready for Vercel | Not yet: use dedicated Vercel/TiDB Cloud configuration. |
| Direct Vercel server runtime support | Not yet: Express-to-serverless adaptation required. |
| OAuth production-domain registration | Required before production sign-in. |
| Paystack Live Mode transaction | Deferred pending explicit human authorization. |
