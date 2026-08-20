import { describe, expect, it } from "vitest";
import { getPracticeEntitlement, getPracticeMockEntitlement } from "./entitlements";

describe("practice entitlements", () => {
  const now = new Date("2026-08-19T12:00:00.000Z");

  it("allows a Free learner to answer up to five questions in a UTC day", () => {
    expect(getPracticeEntitlement({ subscriptionStatus: "free", subscriptionExpiresAt: null, dailyAttemptCount: 4 }, now).canPractice).toBe(true);
    expect(getPracticeEntitlement({ subscriptionStatus: "free", subscriptionExpiresAt: null, dailyAttemptCount: 5 }, now).canPractice).toBe(false);
  });

  it("keeps paid access until the recorded expiry when a renewal has failed or been cancelled", () => {
    const expiry = new Date("2026-08-20T12:00:00.000Z");
    expect(getPracticeEntitlement({ subscriptionStatus: "past_due", subscriptionExpiresAt: expiry, dailyAttemptCount: 9 }, now).canPractice).toBe(true);
    expect(getPracticeEntitlement({ subscriptionStatus: "cancelled", subscriptionExpiresAt: expiry, dailyAttemptCount: 9 }, now).canPractice).toBe(true);
  });

  it("returns a learner to the Free cap after the paid period has expired", () => {
    const expired = new Date("2026-08-18T12:00:00.000Z");
    const access = getPracticeEntitlement({ subscriptionStatus: "pro", subscriptionExpiresAt: expired, dailyAttemptCount: 5 }, now);
    expect(access.isPro).toBe(false);
    expect(access.canPractice).toBe(false);
  });

  it("reserves saved Practice Mocks for an active Pro subscription state", () => {
    expect(getPracticeMockEntitlement("pro")).toMatchObject({ isPro: true, canStartMock: true });
    expect(getPracticeMockEntitlement("free")).toMatchObject({ isPro: false, canStartMock: false });
    expect(getPracticeMockEntitlement("past_due")).toMatchObject({ isPro: false, canStartMock: false });
    expect(getPracticeMockEntitlement("cancelled")).toMatchObject({ isPro: false, canStartMock: false });
  });
});
