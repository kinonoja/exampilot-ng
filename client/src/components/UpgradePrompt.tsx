import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function UpgradePrompt({ compact = false }: { compact?: boolean }) {
  const [, setLocation] = useLocation();
  return (
    <section className={`overflow-hidden rounded-3xl border border-lime-200 bg-lime-100 text-slate-950 ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-lime-300">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">Daily practice complete</p>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight">You have used today’s 5 Free questions.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-700">
            Keep your momentum with unlimited practice, full mock exams, tailored explanations, and a weekly study plan in Pro.
          </p>
          <Button onClick={() => setLocation("/billing")} className="mt-5 h-11 rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800">
            <Sparkles className="mr-2 h-4 w-4 text-lime-300" /> Unlock Pro for ₦1,500/month <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
