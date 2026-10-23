export const FREE_DAILY_PRACTICE_LIMIT = 5;
export const FREE_DAILY_TUTOR_LIMIT = 1;

export type EntitlementInput = {
  subscriptionStatus: "free" | "pro" | "past_due" | "cancelled";
  subscriptionExpiresAt: Date | null;
  dailyAttemptCount: number;
};

export function hasActivePaidAccess(
  subscriptionStatus: EntitlementInput["subscriptionStatus"],
  subscriptionExpiresAt: Date | null,
  now = new Date(),
) {
  return subscriptionStatus !== "free" && (!subscriptionExpiresAt || subscriptionExpiresAt > now);
}

export function getPracticeEntitlement(input: EntitlementInput, now = new Date()) {
  const isWithinPaidPeriod = hasActivePaidAccess(input.subscriptionStatus, input.subscriptionExpiresAt, now);
  return {
    isPro: isWithinPaidPeriod,
    dailyAttemptCount: input.dailyAttemptCount,
    dailyLimit: FREE_DAILY_PRACTICE_LIMIT,
    canPractice: isWithinPaidPeriod || input.dailyAttemptCount < FREE_DAILY_PRACTICE_LIMIT,
  };
}

export function getTutorEntitlement(
  input: Omit<EntitlementInput, "dailyAttemptCount"> & { dailyTutorRequestCount: number },
  now = new Date(),
) {
  const isPro = hasActivePaidAccess(input.subscriptionStatus, input.subscriptionExpiresAt, now);
  return {
    isPro,
    dailyTutorRequestCount: input.dailyTutorRequestCount,
    dailyLimit: FREE_DAILY_TUTOR_LIMIT,
    canUseTutor: isPro || input.dailyTutorRequestCount < FREE_DAILY_TUTOR_LIMIT,
  };
}

export function getPracticeMockEntitlement(
  input: Pick<EntitlementInput, "subscriptionStatus" | "subscriptionExpiresAt">,
  now = new Date(),
) {
  const isPro = hasActivePaidAccess(input.subscriptionStatus, input.subscriptionExpiresAt, now);
  return {
    isPro,
    canStartMock: isPro,
    reason: isPro
      ? undefined
      : "Practice Mocks are included with Pro. Upgrade when you are ready to begin this saved mock session.",
  };
}
