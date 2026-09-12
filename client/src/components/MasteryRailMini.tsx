type MasteryStage = "focus" | "practice" | "understand" | "ready";

const stages = ["Focus", "Practice", "Ready"] as const;

export function MasteryRailMini({ current }: { current: MasteryStage }) {
  const activeIndex = current === "focus" ? 0 : current === "practice" || current === "understand" ? 1 : 2;
  return <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#DDE5EA] bg-white px-3 py-2" aria-label={`Mastery path: ${stages[activeIndex]}`}><span className="hidden text-[10px] font-bold uppercase tracking-[0.13em] text-[#607082] sm:inline">Mastery path</span><div className="flex flex-1 items-center gap-1.5">{stages.map((stage, index) => <div key={stage} className="flex min-w-0 flex-1 items-center gap-1.5"><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold ${index <= activeIndex ? "bg-[#163A5F] text-white" : "bg-[#EEF3F6] text-[#607082]"}`}>{index + 1}</span><span className={`truncate text-[10px] font-bold uppercase tracking-[0.08em] ${index === activeIndex ? "text-[#245EA8]" : "text-[#607082]"}`}>{stage}</span>{index < stages.length - 1 ? <span className={`h-px flex-1 ${index < activeIndex ? "bg-[#245EA8]" : "bg-[#DDE5EA]"}`} /> : null}</div>)}</div></div>;
}
