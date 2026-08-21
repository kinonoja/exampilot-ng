import { beforeEach, describe, expect, it, vi } from "vitest";

const billingMocks = vi.hoisted(() => ({
  getCancellableSubscription: vi.fn(),
  markCancellationRequested: vi.fn(),
  recordInvoicePaymentFailure: vi.fn(),
  recordSubscriptionCreated: vi.fn(),
  recordSubscriptionDisabled: vi.fn(),
  recordVerifiedProPayment: vi.fn(),
}));

vi.mock("./billing", () => ({
  PRO_AMOUNT_KOBO: 150_000,
  ...billingMocks,
}));

vi.mock("./db", () => ({ getStudentProfile: vi.fn() }));

import { handlePaystackWebhook } from "./paystack";

describe("Paystack cancellation webhook handling", () => {
  beforeEach(() => vi.clearAllMocks());

  it("handles Paystack's Test Mode subscription.not_renew event as a cancellation", async () => {
    await handlePaystackWebhook({
      event: "subscription.not_renew",
      data: {
        status: "success",
        reference: "ep.test-cancellation",
        amount: 150_000,
        currency: "NGN",
        subscription_code: "SUB_test",
        email_token: "token_test",
        customer: { customer_code: "CUS_test", email: "paystack-e2e@example.com" },
      },
    });

    expect(billingMocks.recordSubscriptionDisabled).toHaveBeenCalledWith(expect.objectContaining({
      subscription_code: "SUB_test",
      customer: expect.objectContaining({ email: "paystack-e2e@example.com" }),
    }));
  });
});
