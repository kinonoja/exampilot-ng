import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourseDashboardGuidance } from "@/lib/courseDashboardGuidance";

type Course = {
  key: string;
  name: string;
  faculty: string;
  commonSubjects: string[];
  confidence: "high" | "medium" | "unvalidated";
};

type Subject = { id: number; examId: number; name: string };

export function CourseAdaptiveDashboardCard({
  course,
  subjects,
  onEditCourse,
  onPracticeSubject,
}: {
  course: Course | null | undefined;
  subjects: Subject[];
  onEditCourse: () => void;
  onPracticeSubject: (subjectId: number) => void;
}) {
  const guidance = getCourseDashboardGuidance(course, subjects);

  return <section className="rounded-2xl border border-[#DDE5EA] bg-white p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F0FA] text-[#245EA8]"><Compass className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">Course-aware focus</p><h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">{guidance ? `${guidance.courseName} path` : "Tell us what you are working toward."}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-[#607082]">{guidance ? `${guidance.faculty}. Your dashboard has been updated around this saved course direction.` : "Choose a course and, if you know it, a target university. You can select Not sure yet and update it later."}</p></div></div><Button onClick={onEditCourse} className="h-11 shrink-0 rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">{guidance ? "Edit course direction" : "Choose course direction"}<ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} /></Button></div>{guidance ? <div className="mt-5 rounded-xl border border-[#C8D6E1] bg-[#F7FAFD] p-4"><p className="text-sm font-bold text-[#163A5F]">Common combination — confirm for your university.</p><p className="mt-1 text-sm leading-6 text-[#607082]">{guidance.commonCombination}</p>{guidance.availableSubjects.length ? <div className="mt-4 flex flex-wrap gap-2">{guidance.availableSubjects.map(subject => <Button key={subject.id} onClick={() => onPracticeSubject(subject.id)} variant="outline" className="h-9 rounded-lg border-[#B8D0EA] bg-white text-[#245EA8] hover:bg-[#EEF4F8]">Practice {subject.name}</Button>)}</div> : <p className="mt-3 text-sm leading-6 text-[#607082]">No matching subject is in the current JAMB bank yet. Your course guidance remains saved while coverage expands.</p>}{guidance.needsExtraVerification ? <p className="mt-3 text-xs leading-5 text-[#8A571A]">Requirements can vary by university. Confirm your final combination in JAMB IBASS before registration.</p> : null}</div> : null}</section>;
}
