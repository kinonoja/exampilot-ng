# Practice Mock 4c Verification Log

## Automated protection checks

The full suite passed with **44 tests across 15 files** and TypeScript passed after the entitlement and history additions. Automated coverage confirms that only `subscriptionStatus = "pro"` is eligible to start a mock, that a Free learner is rejected by the protected `mock.start` procedure before a session service can run, and that the history helpers only output scored `submitted` or `expired` sessions in newest-first order. It also confirms that both elapsed in-progress mocks and existing expired mocks without a score are selected for finalisation before they can be shown in history.

## Live history and results-link check

The authenticated student’s `/mock-history` page loaded a newest-first list of completed **JAMB Practice Mock** sessions. Each visible row showed a completion date and time, completion state, question and subject count, percentage score, and a **View full results** control. Opening the newest visible entry navigated to `/mock-exam?session=150001` and rendered the matching 10% result, pace, prior-mock comparison, topic breakdown, and full question review.

## Contextual entitlement timing

On opening `/mock-exam`, the configured setup screen showed no access message: the student could first review the JAMB subjects, selected question count, time limit, and eligible-question total. In a temporary Free-tier verification state, pressing **Start Practice Mock** with this valid configuration replaced the action with the mock-specific **Your Practice Mock is ready** card. It stated that full Practice Mocks are included with Pro, retained the already selected configuration in view, and offered **Explore Pro access**. No mock was created. This confirms the prompt appears at the requested highest-intent point, rather than on initial setup render.

The normal Pro path was also exercised before the temporary Free check: the authenticated account entered a saved live session after selecting **Start Practice Mock**, confirming Pro remains unblocked. The temporary session was deliberately completed and the account’s original Pro subscription state is restored after the billing-link verification.

The Free-tier card’s **Explore Pro access** control navigated to `/billing` and displayed the Free-plan billing view without initiating checkout. After this check, the account’s original `subscriptionStatus = pro` and its original expiry timestamp were restored and rechecked in the database. The mobile history capture also confirmed that the list maintains readable score, date, status, and full-results controls at a 375-pixel viewport.

An initial fresh-route check exposed that the billing overview could display an older cached Pro value after the temporary access-state switch. The billing query now refetches on every route entry. A second fresh `/billing` load during the temporary Free state rendered **Current plan: Free**, the daily-practice description, and **Upgrade to Pro**, while retaining payment history for context. The account’s original Pro state and expiry were restored and verified afterward.

For the final exact route check, the billing component’s source was rechecked to confirm `refetchOnMount: "always"` on its overview query. A temporary Free session then reopened Practice Mock, showed no prompt during configuration, and revealed **Explore Pro access** only after the valid Start action.

Following that exact **Explore Pro access** action navigated to `/billing`. The route first showed the cached value while refetching, then resolved to **Current plan: Free**, the Free-plan practice description, and **Upgrade to Pro**. This confirms the CTA-driven destination receives the current server entitlement. The account’s original Pro state and expiry were then restored and rechecked one final time.

The final post-fix Free-tier run again loaded a prompt-free configured Practice Mock screen with a valid Start action before the contextual card was invoked.

After the valid Start action, the final Free-tier run showed the configured mock’s non-punitive **Explore Pro access** card and did not create a mock session.

In the corrected final run, the exact CTA navigation first showed the neutral billing skeleton, never a stale Pro plan. Once the fresh overview resolved, it displayed **Current plan: Free** and **Upgrade to Pro**. The new focused guard test passed, and the original Pro entitlement and expiry were restored and verified afterward.

## Entitlement availability handling

The setup now treats an entitlement-query failure as an access-check problem, not as a Free-tier result. It renders a clear retry state, and the Start action stays unavailable until the check can be retried successfully. This prevents a temporary technical issue from showing an incorrect upgrade message to either tier.
