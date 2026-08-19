import { useState } from "react";
import { Check, CircleAlert, CreditCard, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getPaystackSuccessReference, type PaystackSuccessTransaction } from "@/lib/paystackClient";

type PaystackPopup = { resumeTransaction: (accessCode: string, callbacks?: { onSuccess?: (transaction: PaystackSuccessTransaction) => void; onCancel?: () => void; onError?: (error: { message?: string }) => void }) => void };

declare global {
  interface Window { PaystackPop?: new () => PaystackPopup }
}

function loadPaystackPopup() {
  if (window.PaystackPop) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-paystack-inline="true"]');
    if (existing) { existing.addEventListener("load", () => resolve(), { once: true }); existing.addEventListener("error", () => reject(new Error("Paystack Popup could not load.")), { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.dataset.paystackInline = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paystack Popup could not load."));
    document.head.appendChild(script);
  });
}

const formatNaira = (kobo: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);

export default function Billing() {
  const overview = trpc.billing.overview.useQuery();
  const initialize = trpc.billing.initializeProCheckout.useMutation();
  const verify = trpc.billing.verifyProCheckout.useMutation({ onSuccess: () => overview.refetch() });
  const cancel = trpc.billing.cancelSubscription.useMutation({ onSuccess: () => overview.refetch() });
  const [pendingReference, setPendingReference] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const profile = overview.data?.profile;
  const isPaid = profile?.subscriptionStatus !== "free" && (!profile?.subscriptionExpiresAt || new Date(profile.subscriptionExpiresAt) > new Date());

  const startCheckout = async () => {
    setNotice(undefined);
    try {
      const checkout = await initialize.mutateAsync();
      setPendingReference(checkout.reference);
      await loadPaystackPopup();
      const Popup = window.PaystackPop;
      if (!Popup) throw new Error("Paystack Popup is not available yet.");
      new Popup().resumeTransaction(checkout.accessCode, {
        onSuccess: async transaction => {
          const reference = getPaystackSuccessReference(transaction, checkout.reference);
          setPendingReference(reference);
          setNotice("Payment received. Verifying it securely before activating your Pro access…");
          try {
            await verify.mutateAsync({ reference });
            setNotice("Payment verified. Your Pro access is now active.");
          } catch (error) {
            setNotice(error instanceof Error ? error.message : "Your payment needs another verification attempt.");
          }
        },
        onCancel: () => setNotice("Checkout was cancelled. Your plan has not changed."),
        onError: error => setNotice(error.message || "Paystack could not complete checkout. Please try again."),
      });
      setNotice("Complete checkout in the secure Paystack window, then return here and verify your payment.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Checkout could not be started."); }
  };

  return <div className="mx-auto w-full max-w-5xl space-y-6 pb-12"><header><p className="font-mono text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-700">Billing & access</p><h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Invest in your study momentum.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Payments are processed in NGN through Paystack. Access is granted only after server-side confirmation.</p></header><section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><article className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-lime-300">Your current plan</p><h2 className="mt-3 font-display text-4xl font-bold">{isPaid ? "Pro" : "Free"}</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{isPaid ? `Pro access is active${profile?.subscriptionExpiresAt ? ` until ${new Date(profile.subscriptionExpiresAt).toLocaleDateString()}` : ""}.` : "Free gives you five focused practice questions per day — a useful way to build the habit."}</p>{isPaid ? <Button disabled={cancel.isPending} onClick={() => { if (window.confirm("Cancel recurring Pro billing? Your current paid access remains available until the end of this period.")) cancel.mutate(); }} variant="outline" className="mt-6 rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">{cancel.isPending ? "Cancelling renewal…" : "Cancel recurring billing"}</Button> : <Button disabled={initialize.isPending} onClick={startCheckout} className="mt-6 h-11 rounded-xl bg-lime-300 px-5 text-slate-950 hover:bg-lime-200">{initialize.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening secure checkout…</> : <><CreditCard className="mr-2 h-4 w-4" /> Upgrade to Pro</>}</Button>}</article><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Pro · ₦1,500/month</p><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">{["Unlimited question practice", "Full mock-exam access", "Personalised study plans", "Complete analytics and trends"].map(item => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />{item}</li>)}</ul><div className="mt-6 flex gap-2 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />ExamPilot verifies the final payment status on the server before it opens Pro access.</div></article></section>{notice ? <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-3"><CircleAlert className="h-5 w-5 shrink-0" /><div><p>{notice}</p>{pendingReference ? <Button disabled={verify.isPending} onClick={() => verify.mutate({ reference: pendingReference })} className="mt-3 h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800">{verify.isPending ? "Verifying…" : "I’ve completed payment — verify access"}<ExternalLink className="ml-2 h-3.5 w-3.5" /></Button> : null}{verify.error ? <p className="mt-2 text-xs text-red-700">{verify.error.message}</p> : null}{verify.data ? <p className="mt-2 text-sm font-semibold text-emerald-800">Pro is active. Your access has been updated.</p> : null}</div></div></section> : null}<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Payment history</p><h2 className="mt-1 font-display text-xl font-bold text-slate-950">Your billing activity</h2></div></div>{overview.isLoading ? <div className="mt-5 h-16 animate-pulse rounded-xl bg-slate-100" /> : overview.data?.history.length ? <div className="mt-5 divide-y divide-slate-100">{overview.data.history.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-medium text-slate-900">{item.plan === "pro" ? "ExamPilot Pro" : item.plan}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.startedAt).toLocaleDateString()} {item.paystackReference ? `· ${item.paystackReference}` : ""}</p></div><div className="text-right"><p className="font-semibold text-slate-950">{formatNaira(item.amountKobo)}</p><p className="mt-1 text-xs capitalize text-slate-500">{item.status}{item.autoRenew ? " · renewing" : ""}</p></div></div>)}</div> : <p className="mt-5 text-sm text-slate-500">No payment records yet. Your first verified Pro payment will appear here.</p>}</section></div>;
}
