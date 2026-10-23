import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, Building2, CheckCircle2, ExternalLink, GraduationCap, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCourseDirectionSaveConfirmation, getCourseDirectionSaveValidation } from "@/lib/courseDirectionSaveState";
import { getStudentFacingError } from "@/lib/studentErrorMessage";
import { trpc } from "@/lib/trpc";

type PlanningStatus = "not_sure" | "provided";

export default function CourseDirection() {
  const catalogue = trpc.courseDirection.catalogue.useQuery();
  const savedDirection = trpc.courseDirection.get.useQuery();
  const utils = trpc.useUtils();
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const save = trpc.courseDirection.save.useMutation({
    onSuccess: result => {
      utils.courseDirection.get.setData(undefined, result);
      utils.profile.get.invalidate();
      setSaveFeedback(getCourseDirectionSaveConfirmation(result.course.name, result.profile.institutionPlanningStatus, result.profile.targetInstitutionName ?? ""));
    },
    onError: () => setSaveFeedback(null),
  });
  const [search, setSearch] = useState("");
  const [courseKey, setCourseKey] = useState<string>();
  const [planningStatus, setPlanningStatus] = useState<PlanningStatus>("not_sure");
  const [institutionName, setInstitutionName] = useState("");

  useEffect(() => {
    const profile = savedDirection.data?.profile;
    if (!profile || courseKey) return;
    if (profile.courseKey) setCourseKey(profile.courseKey);
    if (profile.institutionPlanningStatus) setPlanningStatus(profile.institutionPlanningStatus);
    if (profile.targetInstitutionName) setInstitutionName(profile.targetInstitutionName);
  }, [savedDirection.data, courseKey]);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    const allCourses = catalogue.data?.courses ?? [];
    if (!term) return allCourses;
    return allCourses.filter(course => `${course.name} ${course.faculty}`.toLowerCase().includes(term));
  }, [catalogue.data?.courses, search]);
  const selectedCourse = catalogue.data?.courses.find(course => course.key === courseKey);
  const savedCourse = savedDirection.data?.course;

  const submit = () => {
    const validationMessage = getCourseDirectionSaveValidation({ courseKey, planningStatus, institutionName });
    if (validationMessage) {
      setSaveFeedback(validationMessage);
      return;
    }
    setSaveFeedback(null);
    if (planningStatus === "provided") {
      save.mutate({ courseKey: courseKey!, institutionPlanningStatus: "provided", targetInstitutionName: institutionName.trim() });
    } else {
      save.mutate({ courseKey: courseKey!, institutionPlanningStatus: "not_sure" });
    }
  };

  if (catalogue.isLoading || savedDirection.isLoading) return <div className="mx-auto w-full max-w-6xl space-y-5 pb-12"><div className="h-40 animate-pulse rounded-3xl bg-[#E6EDF2]" /><div className="h-80 animate-pulse rounded-2xl bg-[#E6EDF2]" /></div>;
  if (catalogue.error || savedDirection.error) return <div className="mx-auto max-w-3xl rounded-2xl border border-[#E9B8AF] bg-[#FFF4F1] p-5 text-sm leading-6 text-[#8A3429]"><p className="font-bold">Course direction is unavailable right now.</p><p className="mt-1">Please try again. Your existing study settings have not changed.</p><Button onClick={() => { catalogue.refetch(); savedDirection.refetch(); }} variant="outline" className="mt-4 border-[#E9B8AF] text-[#8A3429]">Try again</Button></div>;

  return <div className="mx-auto w-full max-w-6xl space-y-5 pb-12"><section className="relative overflow-hidden rounded-3xl bg-[#163A5F] px-6 py-7 text-white sm:px-8"><div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_100%_0%,rgba(93,160,214,0.28),transparent_60%)]" /><div className="relative"><p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9E4FE]"><GraduationCap className="h-4 w-4" strokeWidth={1.8} /> Course direction</p><h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Plan your route without guessing your subjects.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#C9D8E6]">Choose the course you are working toward and, if you know it, your target university. ExamPilot will not change your practice subjects from this choice alone.</p></div></section>

    {savedCourse ? <section className="rounded-2xl border border-[#8AC7B4] bg-[#EEF8F4] p-5"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16775A]" strokeWidth={1.8} /><div><p className="text-sm font-bold text-[#146148]">Your current direction: {savedCourse.name}</p><p className="mt-1 text-sm leading-6 text-[#486959]">{savedDirection.data?.profile?.institutionPlanningStatus === "provided" ? `Target institution: ${savedDirection.data?.profile?.targetInstitutionName}.` : "You have not chosen a target institution yet."} {savedDirection.data?.validationMessage}</p></div></div></section> : null}

    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-[#DDE5EA] bg-white p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F0FA] text-[#245EA8]"><Search className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">1. Choose a course</p><h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">What are you preparing for?</h2></div></div><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search Medicine, Law, Computer Science…" className="mt-5 h-11 rounded-xl border-[#C8D6E1] bg-[#F7FAFD] text-[#162235] placeholder:text-[#77899A] focus-visible:ring-[#245EA8]" /><div className="mt-4 max-h-[490px] space-y-2 overflow-y-auto pr-1">{filteredCourses.map(course => <button type="button" key={course.key} onClick={() => { setCourseKey(course.key); setSaveFeedback(null); }} className={`w-full rounded-xl border p-4 text-left transition-colors ${course.key === courseKey ? "border-[#245EA8] bg-[#E8F0FA]" : "border-[#DDE5EA] bg-white hover:border-[#AFC6DD] hover:bg-[#F7FAFD]"}`}><div className="flex gap-3"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${course.key === courseKey ? "border-[#245EA8] bg-[#245EA8] text-white" : "border-[#AFC6DD] text-transparent"}`}><CheckCircle2 className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-[#163A5F]">{course.name}</p>{course.confidence === "unvalidated" ? <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6E6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9A5B13]"><AlertTriangle className="h-3 w-3" /> Extra verification recommended</span> : null}</div><p className="mt-1 text-xs text-[#607082]">{course.faculty}</p></div></div></button>)}{filteredCourses.length === 0 ? <p className="rounded-xl border border-dashed border-[#C8D6E1] p-4 text-sm text-[#607082]">No course matches that search. Try a broader course or faculty name.</p> : null}</div></div>

      <aside className="space-y-5"><section className="rounded-2xl border border-[#DDE5EA] bg-white p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F4F0] text-[#16775A]"><Building2 className="h-5 w-5" strokeWidth={1.8} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#16775A]">2. Target university</p><h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">Do you know where?</h2></div></div><div className="mt-5 grid gap-2"><button type="button" onClick={() => { setPlanningStatus("not_sure"); setSaveFeedback(null); }} className={`rounded-xl border p-4 text-left ${planningStatus === "not_sure" ? "border-[#245EA8] bg-[#E8F0FA]" : "border-[#DDE5EA] hover:bg-[#F7FAFD]"}`}><p className="text-sm font-bold text-[#163A5F]">Not sure yet</p><p className="mt-1 text-xs leading-5 text-[#607082]">Keep exploring. We will show common guidance only.</p></button><button type="button" onClick={() => { setPlanningStatus("provided"); setSaveFeedback(null); }} className={`rounded-xl border p-4 text-left ${planningStatus === "provided" ? "border-[#245EA8] bg-[#E8F0FA]" : "border-[#DDE5EA] hover:bg-[#F7FAFD]"}`}><p className="text-sm font-bold text-[#163A5F]">I have a target university</p><p className="mt-1 text-xs leading-5 text-[#607082]">Save its name for a future official check.</p></button></div>{planningStatus === "provided" ? <label className="mt-4 block text-sm font-semibold text-[#46586B]">Target university<Input value={institutionName} onChange={event => { setInstitutionName(event.target.value); setSaveFeedback(null); }} placeholder="e.g. University of Lagos" className="mt-1.5 h-11 rounded-xl border-[#C8D6E1] text-[#162235] focus-visible:ring-[#245EA8]" /></label> : null}</section>

        <section className="rounded-2xl border border-[#C8D6E1] bg-[#F7FAFD] p-5"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#245EA8]" strokeWidth={1.8} /><div><p className="text-sm font-bold text-[#163A5F]">{catalogue.data?.verificationCopy}</p><p className="mt-1 text-sm leading-6 text-[#607082]">{catalogue.data?.verificationDetail}</p><a href={catalogue.data?.ibassEligibilityUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#245EA8] underline-offset-4 hover:underline">Open JAMB IBASS Eligibility Checker <ExternalLink className="h-3.5 w-3.5" /></a></div></div></section>

        {selectedCourse ? <section className="rounded-2xl border border-[#DDE5EA] bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">Common planning guide</p><h3 className="mt-2 font-display text-xl font-bold text-[#163A5F]">{selectedCourse.name}</h3><p className="mt-3 text-sm leading-6 text-[#607082]">English Language plus:</p><ul className="mt-3 space-y-2">{selectedCourse.commonSubjects.map(subject => <li key={subject} className="flex gap-2 text-sm text-[#46586B]"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16775A]" strokeWidth={1.8} />{subject}</li>)}</ul><p className="mt-4 rounded-xl border border-[#C8D6E1] bg-[#F7FAFD] p-3 text-xs leading-5 text-[#526477]">This is course-requirement guidance, not a Practice availability list. Subjects with live questions appear as Practice actions on your dashboard; subjects without a question bank are labelled <strong>Syllabus mapped — questions coming</strong> in Practice.</p>{selectedCourse.confidence === "unvalidated" ? <p className="mt-4 flex gap-2 rounded-xl bg-[#FFF6E6] p-3 text-xs leading-5 text-[#8A571A]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Extra verification recommended: this course is selectable, but its current internal baseline does not yet have a sampled primary-source match.</p> : null}<p className="mt-4 text-xs leading-5 text-[#607082]">No practice subjects have been selected from this course yet.</p></section> : <section className="rounded-2xl border border-dashed border-[#C8D6E1] bg-white p-5"><GraduationCap className="h-5 w-5 text-[#245EA8]" strokeWidth={1.8} /><p className="mt-3 text-sm font-bold text-[#163A5F]">Choose a course to see its common planning guide.</p><p className="mt-1 text-sm leading-6 text-[#607082]">Your practice path will remain unchanged.</p></section>}
        <Button disabled={save.isPending} onClick={submit} className="h-11 w-full rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">{save.isPending ? "Saving your direction…" : "Save course direction"}<ArrowRight className="ml-2 h-4 w-4" /></Button>{saveFeedback ? <p role="status" className="rounded-xl border border-[#8AC7B4] bg-[#EEF8F4] p-3 text-sm leading-6 text-[#146148]">{saveFeedback}</p> : null}{save.error ? <p role="alert" className="text-sm text-[#B5473A]">{getStudentFacingError(save.error, "We could not save your course direction. Please try again.")}</p> : null}</aside></section></div>;
}
