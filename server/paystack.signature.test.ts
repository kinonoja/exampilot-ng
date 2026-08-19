import crypto from "crypto";
import { describe, expect, it } from "vitest";
import { isValidPaystackSignature } from "./paystack";

describe("Paystack webhook signature validation", () => {
  it("accepts only the SHA-512 HMAC for the untouched raw request body", () => {
    const body = Buffer.from('{"event":"charge.success"}', "utf8");
    const signature = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex");
    expect(isValidPaystackSignature(body, signature)).toBe(true);
    expect(isValidPaystackSignature(body, "not-a-paystack-signature")).toBe(false);
  });
});
