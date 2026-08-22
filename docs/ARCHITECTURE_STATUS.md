# Active Architecture Status

## Maintained route surface

`client/src/App.tsx` mounts only the maintained student routes: `PremiumHome`, `PremiumDashboard`, `PremiumPractice`, `PremiumTutor`, `PremiumMockExam`, `PracticeMockHistory`, `CourseDirection`, and `PremiumBilling`.

The former unreferenced alternate `Home`, `Dashboard`, `Practice`, `Tutor`, `Billing`, and `ComponentShowcase` page modules were removed. Future work must extend the maintained Premium route surface rather than restoring parallel implementations.

## Request observability

Every tRPC request receives an `X-Request-ID`. Critical procedure paths for Practice, Mock, Tutor, Billing, and Course Direction write a compact JSON event with only request ID, procedure name, status code, and duration. Logs must never include messages, request bodies, payment references, headers, tokens, or secrets.

## Validation gate

Run `pnpm validate` before accepting an application change. It executes the application-owned Vitest suite and `tsc --noEmit`. `pnpm test:external:paystack` is an intentionally separate network/WAF probe.
