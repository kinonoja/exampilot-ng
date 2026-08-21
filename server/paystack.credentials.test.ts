import { describe, expect, it } from "vitest";

describe("Paystack test credentials", () => {
  it("authenticates a lightweight server-side plan request", async () => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    expect(secretKey, "PAYSTACK_SECRET_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.paystack.co/plan?perPage=1", {
      headers: { Authorization: `Bearer ${secretKey}` },
      signal: AbortSignal.timeout(12_000),
    });
    expect(response.status, "Paystack rejected the configured secret key").toBe(200);
    const payload = (await response.json()) as { status?: boolean };
    expect(payload.status).toBe(true);
  }, 15_000);
});
