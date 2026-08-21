# Paystack Test Mode Evidence Plan

## Official checkout handoff

Paystack’s official InlineJS documentation confirms that a server can initialize a transaction and then complete it in the browser with `resumeTransaction(accessCode)`. The initialize response provides both an `authorization_url` and an `access_code`, while the secret key remains server-side.[1] The transaction API documents the same server-side initialization and subsequent verification by reference.[2]

For the isolated Test Mode learner, the checkout handoff must therefore use the server-created reference and access code rather than expose the Paystack secret key to the browser. Evidence collection will retain the transaction reference, the Test Mode response domain, the webhook delivery status, and the database entitlement state; no secret key, email token, or authorization code will be recorded in a report.

## Credential probe diagnosis

The configured plan endpoint returned a successful Test Mode response and the configured plan code matched the returned Test Mode plan. The original Vitest probe failed because Paystack responded in approximately 5.4 seconds, exceeding Vitest’s default 5-second test limit. The test now uses a 12-second request abort and 15-second test limit while preserving a bounded external dependency check.

## References

[1] [Paystack InlineJS — resume transaction](https://paystack.com/docs/developer-tools/inlinejs/)

[2] [Paystack Transaction API — initialize and verify](https://paystack.com/docs/api/transaction/)
