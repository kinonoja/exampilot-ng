export function shouldShowBillingOverviewSkeleton(input: {
  isLoading: boolean;
  isFetching: boolean;
  isFetchedAfterMount: boolean;
  hasData: boolean;
}) {
  return input.isLoading || (input.hasData && input.isFetching && !input.isFetchedAfterMount);
}
