import { describe, expect, it } from "vitest";
import { shouldShowBillingOverviewSkeleton } from "./billingOverviewState";

describe("billing overview freshness guard", () => {
  it("holds a cached plan behind a skeleton until the route-entry entitlement refetch completes", () => {
    expect(shouldShowBillingOverviewSkeleton({ isLoading: false, isFetching: true, isFetchedAfterMount: false, hasData: true })).toBe(true);
    expect(shouldShowBillingOverviewSkeleton({ isLoading: false, isFetching: false, isFetchedAfterMount: true, hasData: true })).toBe(false);
  });

  it("shows the initial loading state without requiring cached data", () => {
    expect(shouldShowBillingOverviewSkeleton({ isLoading: true, isFetching: true, isFetchedAfterMount: false, hasData: false })).toBe(true);
  });
});
