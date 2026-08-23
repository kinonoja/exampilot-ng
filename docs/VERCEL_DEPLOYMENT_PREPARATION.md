# Vercel Deployment Preparation

## Current status

The source is published to the private GitHub repository: <https://github.com/kinonoja/exampilot-ng>.

> **Important:** The Express-to-serverless adapter is now implemented and passes the application test suite plus a Vercel-build check. It has **not** been deployed to Vercel. Domain-specific OAuth configuration, TiDB Cloud configuration, and a deployed smoke test remain prerequisites before directing student traffic to Vercel.

Manus provides built-in hosting with custom-domain support. If Vercel remains the preferred host, the compatibility work below is required before relying on it for student traffic.

## Manus Forge portability boundary

The active `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` values are **Manus-managed runtime credentials**, automatically injected into this project’s managed environment. They are not a user-owned API key product that has been exported or independently provisioned for this Vercel deployment. Official Manus cloud-infrastructure documentation describes the backend, database, storage, and deployment as managed together by Manus, rather than as portable external-host credentials.[^manus-cloud]

Accordingly, **do not copy these values to Vercel and do not assume Tutor or question generation will work there.** At present there is no verified, supported external-hosting credential path for this app’s Forge-backed Tutor/generation calls. A Vercel deployment can retain the existing truthful temporary-unavailability state, but must not promise active Tutor/generation until one of the following is complete:

1. Manus confirms a supported external-hosting Forge credential arrangement for this application; or
2. the Tutor and generation server integration is migrated to a user-owned model provider/API key or another portable inference provider.

[^manus-cloud]: [Manus, “Cloud Infrastructure”](https://manus.im/docs/website-builder/cloud-infrastructure), accessed 22 August 2026.

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
| `BUILT_IN_FORGE_API_URL` | **No** | Server only | Existing Manus-managed Forge endpoint | Do **not** put this in Vercel. It is not a verified portable Tutor/generation credential. |
| `BUILT_IN_FORGE_API_KEY` | **No** | Server only | Existing Manus-managed Forge credential | Do **not** put this in Vercel. Migrate to the planned user-owned Anthropic credential first. |
| `ANTHROPIC_API_KEY` | Required once Tutor/generation migration is complete | Server only | User-owned direct Anthropic API credential | Do not create/set until the direct-Anthropic migration is implemented and the model is confirmed in the user’s Anthropic account. |
| `ANTHROPIC_TUTOR_MODEL` | Recommended after migration | Server only | Direct Anthropic model for Tutor | Use an enabled model ID from the user’s Anthropic account. |
| `ANTHROPIC_GENERATION_MODEL` | Recommended after migration | Server only | Direct Anthropic model for practice generation | May initially match the Tutor model. |

`NODE_ENV` is set by Vercel for production deployments; `PORT` must **not** be set manually. The current billing integration uses Paystack's server-created access code and does **not** consume `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`; it is therefore not required by the present code path. The project’s map component references `VITE_FRONTEND_FORGE_API_URL` and `VITE_FRONTEND_FORGE_API_KEY`, but that component is not part of the current ExamPilot student flow. Add those only if Maps is introduced into a deployed route and a portable Forge configuration has been approved.

## Database readiness

The active `DATABASE_URL` resolves to `gateway05.us-east-1.prod.aws.tidbcloud.com` using the MySQL protocol. This is a **TiDB Cloud managed database**, not a database confined to the sandbox filesystem. No data migration from a local sandbox database is currently required.

The presently injected connection URL is managed by the existing environment and must not be copied from logs or source control. Before deploying to Vercel, create or obtain a dedicated TiDB Cloud connection credential, place it in Vercel as `DATABASE_URL`, and confirm the TiDB Cloud network policy permits Vercel function traffic. Use the TLS parameters from the TiDB Cloud connection panel exactly as issued.

### TiDB Cloud dashboard steps for Vercel

The preferred route is TiDB Cloud's Vercel integration because it provisions the Vercel project connection and creates the connection variables in Vercel automatically.[^tidb-vercel]

1. Sign in to **Vercel** and create or open the ExamPilot project, but do not deploy yet.
2. Open the **TiDB Cloud for Vercel** integration in the Vercel Marketplace, choose **Add Integration**, select the Vercel account/team and the ExamPilot project, and approve the requested connection scope.
3. In the TiDB Cloud connection flow, select the intended TiDB Cloud organization, project, existing cluster, and the ExamPilot database. The integration then writes `DATABASE_URL` and its component variables to **Vercel → Project → Settings → Environment Variables**. Confirm the generated `DATABASE_URL` retains TiDB's TLS parameter (`sslaccept=strict` or the exact equivalent issued by TiDB Cloud).
4. If the integration cannot be used, open **TiDB Cloud Console → Clusters → [your cluster] → Connect**. Create or reset a dedicated application password/SQL user using the cluster’s supported access flow, then copy the MySQL/TiDB connection string. Add that complete value as the server-only `DATABASE_URL` in Vercel for the intended environment(s). Do not paste it into GitHub, chat, or client-side `VITE_` variables.
5. In TiDB Cloud, check the cluster plan and its **Networking/Traffic Filter** settings. For **Dedicated** clusters, Vercel's documented dynamic egress IPs require permitting `0.0.0.0/0` for public-function connectivity; apply the smallest available connection scope and rely on TLS plus the dedicated credential.[^tidb-vercel] For Starter/Essential, TiDB documents public endpoint access as allowing all IPs by default; still confirm the displayed policy before launch.[^tidb-netlify]
6. After the Vercel adapter is deployed to a non-production preview, check the Vercel function log for one authenticated read-only page request and TiDB Cloud connection metrics for a successful connection. Do not run migrations or payment checkout as the first connectivity probe.

[^tidb-vercel]: [TiDB Cloud, “Integrate TiDB Cloud with Vercel”](https://docs.pingcap.com/tidbcloud/integrate-tidbcloud-with-vercel/), accessed 23 August 2026.
[^tidb-netlify]: [TiDB Cloud, “Integrate TiDB Cloud with Netlify”](https://docs.pingcap.com/tidbcloud/integrate-tidbcloud-with-netlify/), accessed 23 August 2026.

## Required Vercel adaptation and launch checks

1. The Vercel adapter is implemented as `api/[...path].ts`, which serves the existing Express API app. `vercel.json` targets Node 22, retains `/api/*` routing, and sends non-API routes to the SPA `index.html`; the raw-body Paystack webhook registration remains before JSON parsing.
2. Add the Vercel production and preview domains to the configured OAuth redirect allowlist. The callback path is `/api/oauth/callback`.
3. Configure the Paystack webhook endpoint only after the final public domain is live: `https://<domain>/api/webhooks/paystack`.
4. Run database migrations from a controlled deploy step against the dedicated TiDB Cloud URL; do not run destructive migrations automatically against production.
5. Validate sign-in, Practice, Mock, and a Test Mode Paystack checkout on the deployed URL. Keep the separate human-authorized Live Mode payment checklist in force.
6. Complete the direct Anthropic migration before advertising Tutor/generation on Vercel. Do not copy Manus Forge credentials to Vercel.

## Non-sensitive deployment checklist

| Check | Current answer |
|---|---|
| Source repository | Private GitHub repository created and pushed. |
| Database location | External TiDB Cloud hostname; not sandbox-only. |
| Database credentials ready for Vercel | Not yet: use dedicated Vercel/TiDB Cloud configuration. |
| Direct Vercel server runtime support | Implemented and application-tested; not yet deployed or Vercel-smoke-tested. |
| OAuth production-domain registration | Required before production sign-in. |
| Paystack Live Mode transaction | Deferred pending explicit human authorization. |
