export const FREE_DAILY_PRACTICE_LIMIT = 5;

export type EntitlementInput = {
  subscriptionStatus: "free" | "pro" | "past_due" | "cancelled";
  subscriptionExpiresAt: Date | null;
  dailyAttemptCount: number;
};

export function getPracticeEntitlement(input: EntitlementInput, now = new Date()) {
  const isWithinPaidPeriod =
    input.subscriptionStatus !== "free" &&
    (!input.subscriptionExpiresAt || input.subscriptionExpiresAt > now);
  return {
    isPro: isWithinPaidPeriod,
    dailyAttemptCount: input.dailyAttemptCount,
    dailyLimit: FREE_DAILY_PRACTICE_LIMIT,
    canPractice: isWithinPaidPeriod || input.dailyAttemptCount < FREE_DAILY_PRACTICE_LIMIT,
  };
}
