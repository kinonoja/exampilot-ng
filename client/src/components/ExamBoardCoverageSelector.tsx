import { BookOpenCheck, CircleAlert, FileSearch, LockKeyhole } from "lucide-react";
import { EXAM_BOARD_AVAILABILITY, getExamBoardAvailability, type ExamBoard } from "@/lib/examBoardAvailability";

const statusCopy = {
  live: "Practice live",
  coming_soon: "Coming soon",
  authorised_source_required: "Authorised source required",
} as const;

export function ExamBoardCoverageSelector({ activeBoard, onBoardChange }: { activeBoard: ExamBoard; onBoardChange: (board: ExamBoard) => void }) {
  return <section aria-label="Exam board coverage" className="rounded-2xl border border-[#DDE5EA] bg-white p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#245EA8]">Exam board coverage</p><p className="mt-1 text-sm leading-6 text-[#607082]">JAMB practice is currently live. Other boards remain visible with their accurate availability state.</p></div><div role="tablist" aria-label="Choose an exam board" className="flex flex-wrap gap-2">{EXAM_BOARD_AVAILABILITY.map(item => <button key={item.board} role="tab" aria-selected={activeBoard === item.board} onClick={() => onBoardChange(item.board)} className={`rounded-lg border px-3 py-2 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#245EA8] ${activeBoard === item.board ? "border-[#245EA8] bg-[#E8F0FA] text-[#163A5F]" : "border-[#C8D6E1] bg-white text-[#526477] hover:bg-[#F7FAFD]"}`}>{item.board}</button>)}</div></div></section>;
}

export function FutureExamBoardEmptyState({ board, onReturnToJamb }: { board: Exclude<ExamBoard, "JAMB">; onReturnToJamb: () => void }) {
  const availability = getExamBoardAvailability(board);
  const Icon = availability.status === "coming_soon" ? FileSearch : LockKeyhole;
  const eyebrow = statusCopy[availability.status];
  return <section role="status" className="rounded-3xl border border-[#C8D6E1] bg-[#F7FAFD] p-6 text-center sm:p-8"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#E8F0FA] text-[#245EA8]"><Icon className="h-5 w-5" strokeWidth={1.8} /></span><p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">{eyebrow}</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">{availability.title}</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#607082]">{availability.description}</p><button onClick={onReturnToJamb} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#245EA8] px-4 text-sm font-bold text-white outline-none hover:bg-[#1D4F8F] focus-visible:ring-2 focus-visible:ring-[#245EA8] focus-visible:ring-offset-2"><BookOpenCheck className="h-4 w-4" />Return to live JAMB practice</button><p className="mt-4 flex items-center justify-center gap-2 text-xs leading-5 text-[#607082]"><CircleAlert className="h-4 w-4 shrink-0" />No questions are loaded or saved for this board.</p></section>;
}
