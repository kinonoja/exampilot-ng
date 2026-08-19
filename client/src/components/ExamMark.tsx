import { GraduationCap } from "lucide-react";

export function ExamMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="ExamPilot NG">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${inverted ? "bg-lime-300 text-slate-950" : "bg-slate-950 text-lime-300"}`}>
        <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className={`font-display text-lg font-bold tracking-[-0.04em] ${inverted ? "text-white" : "text-slate-950"}`}>
        ExamPilot<span className={inverted ? "text-lime-300" : "text-emerald-700"}>.NG</span>
      </span>
    </div>
  );
}
