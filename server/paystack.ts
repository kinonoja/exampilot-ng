import crypto from "crypto";
import {
  getCancellableSubscription,
  markCancellationRequested,
  PRO_AMOUNT_KOBO,
  recordInvoicePaymentFailure,
  recordSubscriptionCreated,
  recordSubscriptionDisabled,
  recordVerifiedProPayment,
} from "./billing";
import { getStudentProfile } from "./db";

type PaystackApiResponse<T> = { status: boolean; message: string; data: T };
type PaystackTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at?: string;
  paidAt?: string;
  metadata?: string | Record<string, unknown>;
  customer?: { customer_code?: string; email?: string };
};
type PaystackWebhookEvent = {
  event: "charge.success" | "subscription.create" | "subscription.disable" | "invoice.payment_failed" | string;
  data: PaystackTransaction & {
    subscription_code?: string;
    email_token?: string;
    next_payment_date?: string;
    subscription?: { subscription_code?: string };
  };
};

const PAYSTACK_API_BASE = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Paystack is not configured yet.");
  return key;
}

function getPlanCode() {
  const code = process.env.PAYSTACK_PRO_PLAN_CODE;
  if (!code) throw new Error("The Paystack Pro monthly plan has not been configured yet.");
  return code;
}

async function paystackRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as PaystackApiResponse<T>;
  if (!response.ok || !payload.status) throw new Error(payload.message || "Paystack could not process this request.");
  return payload.data;
}

function parseMetadata(metadata: PaystackTransaction["metadata"]) {
  if (!metadata) return {} as Record<string, unknown>;
  if (typeof metadata === "object") return metadata;
  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

function asSubscriptionEvent(data: PaystackWebhookEvent["data"]) {
  return {
    subscription_code: data.subscription_code ?? data.subscription?.subscription_code,
    email_token: data.email_token,
    next_payment_date: data.next_payment_date,
    customer: data.customer,
    amount: data.amount,
  };
}

export async function initializeProCheckout(userId: number) {
  const profile = await getStudentProfile(userId);
  if (!profile?.email) throw new Error("Add an email address to your account before starting checkout.");
  const reference = `ep.${crypto.randomUUID().replaceAll("-", "")}`;
  const data = await paystackRequest<{ access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: profile.email,
      amount: PRO_AMOUNT_KOBO,
      currency: "NGN",
      reference,
      plan: getPlanCode(),
      metadata: JSON.stringify({ userId: String(userId), plan: "pro" }),
    }),
  });
  return { accessCode: data.access_code, reference: data.reference };
}

export async function verifyAndGrantProAccess(userId: number, reference: string) {
  const transaction = await paystackRequest<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
  const metadata = parseMetadata(transaction.metadata);
  const isExpectedPayment =
    transaction.reference === reference &&
    transaction.status === "success" &&
    transaction.currency === "NGN" &&
    transaction.amount === PRO_AMOUNT_KOBO &&
    metadata.userId === String(userId) &&
    metadata.plan === "pro";
  if (!isExpectedPayment) throw new Error("This transaction cannot be used to activate Pro access.");

  const entitlement = await recordVerifiedProPayment({
    userId,
    reference,
    amountKobo: transaction.amount,
    paidAt: transaction.paid_at ?? transaction.paidAt,
    customerCode: transaction.customer?.customer_code,
  });
  return { ...entitlement, reference };
}

export async function cancelProSubscription(userId: number) {
  const subscription = await getCancellableSubscription(userId);
  if (!subscription?.paystackSubscriptionCode || !subscription.paystackEmailToken) {
    throw new Error("There is no active recurring subscription available to cancel.");
  }
  await paystackRequest("/subscription/disable", {
    method: "POST",
    body: JSON.stringify({ code: subscription.paystackSubscriptionCode, token: subscription.paystackEmailToken }),
  });
  await markCancellationRequested(subscription.id);
  return { success: true } as const;
}

export function isValidPaystackSignature(rawBody: Buffer, signature?: string) {
  if (!signature) return false;
  const expected = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "utf8");
  const calculated = Buffer.from(expected, "utf8");
  return received.length === calculated.length && crypto.timingSafeEqual(received, calculated);
}

export async function handlePaystackWebhook(event: PaystackWebhookEvent) {
  const subscriptionEvent = asSubscriptionEvent(event.data);
  switch (event.event) {
    case "charge.success": {
      const metadata = parseMetadata(event.data.metadata);
      const userId = Number(metadata.userId);
      if (Number.isInteger(userId) && metadata.plan === "pro" && event.data.reference) {
        await verifyAndGrantProAccess(userId, event.data.reference);
      }
      return;
    }
    case "subscription.create":
      await recordSubscriptionCreated(subscriptionEvent);
      return;
    case "subscription.disable":
      await recordSubscriptionDisabled(subscriptionEvent);
      return;
    case "invoice.payment_failed":
      await recordInvoicePaymentFailure(subscriptionEvent);
      return;
    default:
      return;
  }
}
