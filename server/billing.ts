import { desc, eq } from "drizzle-orm";
import { subscriptions, users } from "../drizzle/schema";
import { getDb } from "./db";

export const PRO_AMOUNT_KOBO = 150_000;

type SubscriptionEventData = {
  subscription_code?: string;
  email_token?: string;
  next_payment_date?: string;
  customer?: { customer_code?: string; email?: string };
  amount?: number;
};

function asDate(value: string | undefined, fallback = new Date()) {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function oneMonthAfter(date: Date) {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + 1);
  return result;
}

async function findUserForPaystack(customer?: SubscriptionEventData["customer"]) {
  const db = await getDb();
  if (!db || !customer) return undefined;
  if (customer.customer_code) {
    const byCode = await db.select().from(users).where(eq(users.paystackCustomerCode, customer.customer_code)).limit(1);
    if (byCode[0]) return byCode[0];
  }
  if (customer.email) {
    const byEmail = await db.select().from(users).where(eq(users.email, customer.email)).limit(1);
    return byEmail[0];
  }
  return undefined;
}

export async function getBillingOverview(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Billing details are currently unavailable.");
  const [user] = await db
    .select({
      subscriptionStatus: users.subscriptionStatus,
      subscriptionExpiresAt: users.subscriptionExpiresAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const history = await db
    .select({
      id: subscriptions.id,
      plan: subscriptions.plan,
      amountKobo: subscriptions.amountKobo,
      status: subscriptions.status,
      paystackReference: subscriptions.paystackReference,
      startedAt: subscriptions.startedAt,
      expiresAt: subscriptions.expiresAt,
      autoRenew: subscriptions.autoRenew,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.startedAt))
    .limit(20);
  return { profile: user, history };
}

export async function getCancellableSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Billing details are currently unavailable.");
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.startedAt))
    .limit(10);
  return rows.find(subscription => subscription.status === "active" && subscription.autoRenew) ?? null;
}

export async function markCancellationRequested(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Billing details are currently unavailable.");
  await db.update(subscriptions).set({ autoRenew: false }).where(eq(subscriptions.id, subscriptionId));
}

export async function recordVerifiedProPayment(input: {
  userId: number;
  reference: string;
  amountKobo: number;
  paidAt?: string;
  customerCode?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Billing updates are currently unavailable.");
  const startedAt = asDate(input.paidAt);
  const expiresAt = oneMonthAfter(startedAt);
  const existing = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.paystackReference, input.reference))
    .limit(1);

  const pendingRecurringSubscription = existing[0] ? null : await getCancellableSubscription(input.userId);

  const values = {
    plan: "pro" as const,
    amountKobo: input.amountKobo,
    status: "active" as const,
    startedAt,
    expiresAt,
    autoRenew: true,
  };
  if (existing[0] || pendingRecurringSubscription) {
    await db
      .update(subscriptions)
      .set({ ...values, paystackReference: input.reference })
      .where(eq(subscriptions.id, existing[0]?.id ?? pendingRecurringSubscription!.id));
  } else {
    await db.insert(subscriptions).values({ userId: input.userId, paystackReference: input.reference, ...values });
  }

  await db
    .update(users)
    .set({
      subscriptionStatus: "pro",
      subscriptionExpiresAt: expiresAt,
      ...(input.customerCode ? { paystackCustomerCode: input.customerCode } : {}),
    })
    .where(eq(users.id, input.userId));
  return { expiresAt };
}

export async function recordSubscriptionCreated(event: SubscriptionEventData) {
  const db = await getDb();
  if (!db) return;
  const user = await findUserForPaystack(event.customer);
  if (!user) return;
  const startsAt = new Date();
  const expiresAt = asDate(event.next_payment_date, oneMonthAfter(startsAt));
  const existing = await getCancellableSubscription(user.id);
  const values = {
    status: "active" as const,
    autoRenew: true,
    expiresAt,
    paystackSubscriptionCode: event.subscription_code ?? null,
    paystackEmailToken: event.email_token ?? null,
  };

  if (existing) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values({
      userId: user.id,
      plan: "pro",
      amountKobo: event.amount ?? PRO_AMOUNT_KOBO,
      startedAt: startsAt,
      ...values,
    });
  }

  await db
    .update(users)
    .set({
      subscriptionStatus: "pro",
      subscriptionExpiresAt: expiresAt,
      ...(event.customer?.customer_code ? { paystackCustomerCode: event.customer.customer_code } : {}),
    })
    .where(eq(users.id, user.id));
}

export async function recordSubscriptionDisabled(event: SubscriptionEventData) {
  const db = await getDb();
  if (!db) return;
  const user = await findUserForPaystack(event.customer);
  if (!user) return;
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .orderBy(desc(subscriptions.startedAt))
    .limit(20);
  const subscription = rows.find(row => row.paystackSubscriptionCode === event.subscription_code) ?? rows[0];
  if (subscription) {
    await db.update(subscriptions).set({ status: "cancelled", autoRenew: false }).where(eq(subscriptions.id, subscription.id));
  }
}

export async function recordInvoicePaymentFailure(event: SubscriptionEventData) {
  const db = await getDb();
  if (!db) return;
  const user = await findUserForPaystack(event.customer);
  if (!user) return;
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .orderBy(desc(subscriptions.startedAt))
    .limit(20);
  const subscription = rows.find(row => row.paystackSubscriptionCode === event.subscription_code) ?? rows[0];
  if (subscription) {
    await db.update(subscriptions).set({ status: "failed" }).where(eq(subscriptions.id, subscription.id));
  }
  await db.update(users).set({ subscriptionStatus: "past_due" }).where(eq(users.id, user.id));
}
