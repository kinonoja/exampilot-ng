import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, CreditCard, Flame, Sparkles, Target } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const examTargets = ["JAMB", "WAEC", "NECO", "NABTEB"] as const;

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const profileQuery = trpc.profile.get.useQuery();
  const accessQuery = trpc.practice.access.useQuery();
  const saveProfile = trpc.profile.save.useMutation({ onSuccess: () => profileQuery.refetch() });
  const [examTarget, setExamTarget] = useState<(typeof examTargets)[number]>("JAMB");
  const [examYear, setExamYear] = useState(2027);

  useEffect(() => {
    if (profileQuery.data?.examTarget) setExamTarget(profileQuery.data.examTarget);
    if (profileQuery.data?.examYear) setExamYear(profileQuery.data.examYear);
  }, [profileQuery.data]);

  if (profileQuery.isLoading) {
    return <div className="animate-pulse space-y-5"><div className="h-44 rounded-3xl bg-slate-200" /><div className="grid gap-4 sm:grid-cols-3"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /></div></div>;
  }

  const profile = profileQuery.data;
  const isConfigured = Boolean(profile?.examTarget && profile?.examYear);
  const firstName = profile?.name?.split(" ")[0] || "Learner";
  const isPro = accessQuery.data?.isPro;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime-300/15 blur-2xl" />
        <div className="relative max-w-2xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.17em] text-lime-300">Your study cockpit</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Hello, {firstName}. Ready for your next win?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Small, focused practice today builds the confidence you need on exam day.</p>
          <Button onClick={() => setLocation("/practice")} className="mt-6 h-11 rounded-xl bg-lime-300 px-5 font-semibold text-slate-950 hover:bg-lime-200">
            Start practice <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {!isConfigured ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4"><Target className="mt-0.5 h-5 w-5 text-amber-700" /><div><h2 className="font-display text-xl font-bold tracking-tight text-slate-950">Set your exam target</h2><p className="mt-1 text-sm leading-6 text-slate-600">This helps ExamPilot prioritise the right practice path from your first session.</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Exam target<select value={examTarget} onChange={event => setExamTarget(event.target.value as (typeof examTargets)[number])} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-950 outline-none ring-lime-300 focus:ring-2">{examTargets.map(target => <option key={target} value={target}>{target}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Exam year<select value={examYear} onChange={event => setExamYear(Number(event.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-950 outline-none ring-lime-300 focus:ring-2">{[2026, 2027, 2028, 2029, 2030].map(year => <option key={year} value={year}>{year}</option>)}</select></label>
          </div>
          <Button disabled={saveProfile.isPending} onClick={() => saveProfile.mutate({ examTarget, examYear })} className="mt-5 h-11 rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800">{saveProfile.isPending ? "Saving your target…" : "Save my study target"}</Button>
          {saveProfile.error ? <p className="mt-3 text-sm text-red-700">{saveProfile.error.message}</p> : null}
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><BookOpenCheck className="h-5 w-5 text-emerald-700" /><p className="mt-5 text-sm font-medium text-slate-500">Practice today</p><p className="mt-1 font-display text-3xl font-bold text-slate-950">{accessQuery.data?.isPro ? "Unlimited" : `${accessQuery.data?.dailyAttemptCount ?? 0} / 5`}</p><p className="mt-1 text-xs text-slate-500">{accessQuery.data?.isPro ? "Pro practice is open" : "Free daily questions"}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Target className="h-5 w-5 text-violet-700" /><p className="mt-5 text-sm font-medium text-slate-500">Your target</p><p className="mt-1 font-display text-3xl font-bold text-slate-950">{profile?.examTarget || "—"}</p><p className="mt-1 text-xs text-slate-500">{profile?.examYear ? `${profile.examYear} sitting` : "Set your exam year"}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Flame className="h-5 w-5 text-orange-600" /><p className="mt-5 text-sm font-medium text-slate-500">Study rhythm</p><p className="mt-1 font-display text-3xl font-bold text-slate-950">Start now</p><p className="mt-1 text-xs text-slate-500">Build your first streak</p></article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">The next smart step</p><h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950">Try a mixed JAMB warm-up.</h2></div><Sparkles className="h-7 w-7 text-violet-600" /></div><p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Choose a subject and topic, then answer one question at a time with clear feedback and explanations.</p><Button onClick={() => setLocation("/practice")} variant="outline" className="mt-5 h-10 rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-50">Open Practice</Button></article>
        <article className="rounded-3xl bg-emerald-700 p-6 text-white"><CreditCard className="h-5 w-5 text-lime-200" /><p className="mt-5 text-sm text-emerald-100">Current plan</p><h2 className="mt-1 font-display text-2xl font-bold">{isPro ? "Pro" : "Free"}</h2><p className="mt-2 text-sm leading-6 text-emerald-100">{isPro ? "Unlimited practice is active for your current billing period." : "Get 5 questions each day. Upgrade when you are ready for uninterrupted practice."}</p><button onClick={() => setLocation("/billing")} className="mt-5 text-sm font-semibold text-lime-200 underline underline-offset-4">{isPro ? "Manage billing" : "Compare plans"}</button></article>
      </section>
    </div>
  );
}
