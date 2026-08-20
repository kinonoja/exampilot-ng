import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type UpgradePromptProps = {
  compact?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
};

export function UpgradePrompt({
  compact = false,
  eyebrow = "Daily practice complete",
  title = "You have used today’s 5 Free questions.",
  description = "Keep your momentum with unlimited practice, full mock exams, tailored explanations, and a weekly study plan in Pro.",
  ctaLabel = "Unlock Pro for ₦1,500/month",
}: UpgradePromptProps) {
  const [, setLocation] = useLocation();
  return (
    <section className={`overflow-hidden rounded-3xl border border-[#C8D6E1] bg-[#E8F0FA] text-[#163A5F] ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#163A5F] text-[#C9E4FE]">
          <LockKeyhole className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#245EA8]">{eyebrow}</p>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#526477]">{description}</p>
          <Button onClick={() => setLocation("/billing")} className="mt-5 h-11 rounded-xl bg-[#245EA8] px-5 text-white hover:bg-[#1D4F8F]">
            <Sparkles className="mr-2 h-4 w-4" strokeWidth={1.8} /> {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </section>
  );
}
