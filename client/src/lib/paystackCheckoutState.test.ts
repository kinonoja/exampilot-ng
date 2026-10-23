import { describe, expect, it } from "vitest";
import { getPaystackCheckoutFailureMessage, getPaystackCheckoutStartFailureMessage, getPaystackVerificationFailureMessage } from "./paystackCheckoutState";

describe("Paystack checkout failure copy", () => {
  it("explains a declined payment without exposing provider text or changing access", () => {
    expect(getPaystackCheckoutFailureMessage(new Error("Declined: response code 05"))).toBe("Your payment was not approved. Your plan has not changed. Try another payment method or contact your bank.");
  });

  it("uses safe fallback copy for checkout and verification failures", () => {
    expect(getPaystackCheckoutFailureMessage(new Error("unexpected upstream detail"))).toBe("Paystack could not complete checkout. Your plan has not changed. Please try again.");
    expect(getPaystackCheckoutStartFailureMessage()).toContain("Your plan has not changed");
    expect(getPaystackVerificationFailureMessage()).toContain("Your access has not changed");
  });
});
