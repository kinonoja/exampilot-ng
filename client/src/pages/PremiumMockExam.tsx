import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Flag, ListChecks, LockKeyhole, Play, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { getClampedCountdown } from "@/lib/mockTimer";
import { getRestoredQuestionIndex, resolvePracticeMockRoute } from "@/lib/mockSessionRecovery";

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function sessionIdFromSearch(search: string) {
  const raw = new URLSearchParams(search).get("session");
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export default function PremiumMockExam() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const sessionId = useMemo(() => sessionIdFromSearch(search), [search]);
  const activeSessionQuery = trpc.mock.active.useQuery(undefined, { enabled: !sessionId, refetchOnWindowFocus: false });
  const route = useMemo(() => resolvePracticeMockRoute(sessionId, activeSessionQuery.data?.id), [activeSessionQuery.data?.id, sessionId]);

  useEffect(() => {
    if (route.kind === "session" && route.recoveredFromActiveSession) setLocation(`/mock-exam?session=${route.sessionId}`);
  }, [route, setLocation]);

  if (sessionId) return <LivePracticeMock sessionId={sessionId} onReturnToSetup={() => setLocation("/mock-exam")} />;
  if (activeSessionQuery.isLoading || activeSessionQuery.data?.id) return <section className="mx-auto grid min-h-72 max-w-3xl place-items-center rounded-3xl border border-[#DDE5EA] bg-white p-8 text-center"><div><TimerReset className="mx-auto h-7 w-7 animate-spin text-[#245EA8]" strokeWidth={1.8} /><p className="mt-4 font-display text-xl font-bold text-[#163A5F]">Restoring your saved Practice Mock…</p><p className="mt-2 text-sm leading-6 text-[#607082]">Your timer, answers, review flags, and last question are being recovered.</p></div></section>;
  return <PracticeMockSetup onStart={id => setLocation(`/mock-exam?session=${id}`)} />;
}

function PracticeMockSetup({
  onStart,
}: {
  onStart: (id: number) => void;
}) {
  const setupQuery = trpc.mock.setup.useQuery(undefined, { refetchOnWindowFocus: false });
  const startMock = trpc.mock.start.useMutation({ onSuccess: session => onStart(session.id) });
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [includeAIGenerated, setIncludeAIGenerated] = useState(false);

  useEffect(() => {
    if (subjectIds.length === 0 && setupQuery.data?.subjects.length) setSubjectIds(setupQuery.data.subjects.map(subject => subject.id));
  }, [setupQuery.data, subjectIds.length]);

  if (setupQuery.isLoading) return <div className="mx-auto h-96 max-w-5xl animate-pulse rounded-3xl bg-[#E6EDF2]" />;
  if (setupQuery.error || !setupQuery.data) return <section className="mx-auto max-w-3xl rounded-2xl border border-[#E8C8C5] bg-[#FFF5F4] p-6 text-[#862E26]"><CircleAlert className="h-5 w-5" /><p className="mt-2 text-sm">{setupQuery.error?.message ?? "Practice Mock setup is unavailable."}</p><Button onClick={() => setupQuery.refetch()} variant="outline" className="mt-4 border-[#DCA8A2] bg-white">Try again</Button></section>;

  const setup = setupQuery.data;
  const toggleSubject = (id: number) => setSubjectIds(ids => ids.includes(id) ? ids.filter(subjectId => subjectId !== id) : [...ids, id]);
  const selectedQuestionCapacity = setup.subjects.filter(subject => subjectIds.includes(subject.id)).reduce((sum, subject) => sum + subject.originalQuestionCount + (includeAIGenerated ? subject.aiQuestionCount : 0), 0);
  const canStart = subjectIds.length > 0 && selectedQuestionCapacity >= questionCount;

  return <div className="mx-auto w-full max-w-5xl space-y-5 pb-12">
    <section className="relative overflow-hidden rounded-3xl bg-[#163A5F] px-6 py-7 text-white sm:px-8"><div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_100%_0%,rgba(93,160,214,0.26),transparent_58%)]" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9E4FE]"><TimerReset className="h-4 w-4" strokeWidth={1.8} /> Practice Mock</p><h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Build exam stamina, one short session at a time.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#C9D8E6]">Choose the subjects and time that fit today. Your answers save as you move, even if you need to return later.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#C9E4FE]"><LockKeyhole className="h-3.5 w-3.5" /> Progress saves automatically</span></div></section>

    <section className="rounded-2xl border border-[#F0D39B] bg-[#FFF9EC] p-5"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#A96500]" strokeWidth={1.8} /><div><p className="font-bold text-[#704500]">This is a practice-length mock, not the full JAMB format.</p><p className="mt-1 text-sm leading-6 text-[#805D25]">It uses ExamPilot’s current {setup.subjects.reduce((total, subject) => total + subject.originalQuestionCount + subject.aiQuestionCount, 0)}-question JAMB bank across Biology, English, and Mathematics. The 180-question, 120-minute JAMB mock will stay unavailable until the bank has the required four-subject coverage.</p></div></div></section>

    <section className="grid gap-5 lg:grid-cols-[1.28fr_0.72fr]"><div className="rounded-2xl border border-[#DDE5EA] bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">1. Select your focus</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">{setup.exam.name} subjects</h2></div><span className="rounded-full bg-[#E8F0FA] px-3 py-1 text-xs font-bold text-[#245EA8]">Short mock</span></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{setup.subjects.map(subject => { const selected = subjectIds.includes(subject.id); return <button key={subject.id} type="button" onClick={() => toggleSubject(subject.id)} className={`rounded-2xl border p-4 text-left transition-colors ${selected ? "border-[#82ADD8] bg-[#EFF5FC]" : "border-[#DDE5EA] bg-white hover:border-[#AABFCE]"}`}><span className={`grid h-6 w-6 place-items-center rounded-full ${selected ? "bg-[#245EA8] text-white" : "border border-[#C8D6E1] text-transparent"}`}><Check className="h-3.5 w-3.5" strokeWidth={2.4} /></span><p className="mt-4 font-display text-lg font-bold text-[#163A5F]">{subject.name}</p><p className="mt-1 text-xs leading-5 text-[#607082]">{subject.originalQuestionCount} original questions{subject.aiQuestionCount ? ` · ${subject.aiQuestionCount} approved AI questions` : ""}</p></button>; })}</div><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#DDE5EA] bg-[#F9FBFC] p-4"><input type="checkbox" checked={includeAIGenerated} onChange={event => setIncludeAIGenerated(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#245EA8]" /><span><span className="block text-sm font-bold text-[#163A5F]">Include approved AI practice questions</span><span className="mt-1 block text-xs leading-5 text-[#607082]">Off by default for a pure original-bank experience. When enabled, approved questions from generated weak-topic sets may appear.</span></span></label></div>
      <aside className="rounded-2xl border border-[#DDE5EA] bg-white p-5 sm:p-6"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">2. Set the session</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.035em] text-[#163A5F]">Keep it deliberate.</h2><label className="mt-5 block text-sm font-bold text-[#46586B]">Questions<select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-[#C8D6E1] bg-white px-3 text-sm font-semibold text-[#163A5F] outline-none focus:ring-2 focus:ring-[#245EA8]">{setup.questionCounts.map(count => <option key={count} value={count}>{count} questions</option>)}</select></label><label className="mt-4 block text-sm font-bold text-[#46586B]">Time limit<select value={durationMinutes} onChange={event => setDurationMinutes(Number(event.target.value))} className="mt-1.5 h-11 w-full rounded-xl border border-[#C8D6E1] bg-white px-3 text-sm font-semibold text-[#163A5F] outline-none focus:ring-2 focus:ring-[#245EA8]">{setup.durationMinutes.map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label><div className="mt-5 rounded-xl bg-[#F7FAFD] p-4 text-sm"><div className="flex items-center justify-between text-[#526477]"><span>Eligible questions</span><span className="font-bold text-[#163A5F]">{selectedQuestionCapacity}</span></div><div className="mt-2 flex items-center justify-between text-[#526477]"><span>Included subjects</span><span className="font-bold text-[#163A5F]">{subjectIds.length}</span></div></div>{!canStart ? <p className="mt-3 flex gap-2 text-xs leading-5 text-[#B5473A]"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />Choose enough eligible questions to build this session.</p> : null}<Button disabled={!canStart || startMock.isPending} onClick={() => startMock.mutate({ examId: setup.exam.id, subjectIds, questionCount: questionCount as 5 | 10 | 15, durationMinutes: durationMinutes as 5 | 10 | 15, includeAIGenerated })} className="mt-5 h-11 w-full rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]"><Play className="mr-2 h-4 w-4" strokeWidth={1.8} />{startMock.isPending ? "Starting your session…" : "Start Practice Mock"}</Button>{startMock.error ? <p className="mt-3 flex gap-2 text-xs leading-5 text-[#B5473A]"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{startMock.error.message}</p> : null}</aside></section>
  </div>;
}

function LivePracticeMock({
  sessionId,
  onReturnToSetup,
}: {
  sessionId: number;
  onReturnToSetup: () => void;
}) {
  const utils = trpc.useUtils();
  const sessionQuery = trpc.mock.session.useQuery({ mockExamId: sessionId }, { refetchOnWindowFocus: false });
  const saveAnswer = trpc.mock.saveAnswer.useMutation({ onSuccess: () => utils.mock.session.invalidate({ mockExamId: sessionId }) });
  const setFlag = trpc.mock.setFlag.useMutation({ onSuccess: () => utils.mock.session.invalidate({ mockExamId: sessionId }) });
  const setPosition = trpc.mock.setPosition.useMutation();
  const submitMock = trpc.mock.submit.useMutation({ onSuccess: () => utils.mock.session.invalidate({ mockExamId: sessionId }) });
  const expireMock = trpc.mock.expire.useMutation({ onSuccess: () => utils.mock.session.invalidate({ mockExamId: sessionId }) });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clientNow, setClientNow] = useState(() => Date.now());
  const expiryRequested = useRef(false);
  const restoredSessionId = useRef<number | null>(null);
  const lastSavedQuestionIndex = useRef<number | null>(null);
  const applyingInitialPosition = useRef(false);
  const session = sessionQuery.data;

  useEffect(() => {
    if (session?.status !== "in_progress") return;
    const interval = window.setInterval(() => setClientNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [session?.status]);
  useEffect(() => {
    if (!session) return;
    if (restoredSessionId.current !== session.id) {
      const restoredIndex = getRestoredQuestionIndex(session.currentQuestionPosition, session.questions.length);
      restoredSessionId.current = session.id;
      lastSavedQuestionIndex.current = restoredIndex;
      applyingInitialPosition.current = true;
      setCurrentIndex(restoredIndex);
    }
  }, [session?.id, session?.currentQuestionPosition, session?.questions.length]);
  useEffect(() => {
    if (!session || session.status !== "in_progress" || restoredSessionId.current !== session.id) return;
    if (applyingInitialPosition.current) {
      if (lastSavedQuestionIndex.current !== currentIndex) return;
      applyingInitialPosition.current = false;
      return;
    }
    if (lastSavedQuestionIndex.current === currentIndex) return;
    lastSavedQuestionIndex.current = currentIndex;
    setPosition.mutate({ mockExamId: sessionId, position: currentIndex + 1 });
  }, [currentIndex, session?.id, session?.status, sessionId, setPosition]);

  const remainingSeconds = session ? getClampedCountdown(session.startedAt, session.durationSeconds, clientNow) : 0;
  const isFinalFiveMinutes = remainingSeconds <= 300;
  useEffect(() => {
    if (!session || session.status !== "in_progress" || remainingSeconds > 0 || expiryRequested.current) return;
    expiryRequested.current = true;
    expireMock.mutate({ mockExamId: sessionId });
  }, [expireMock, remainingSeconds, session, sessionId]);

  if (sessionQuery.isLoading) return <div className="mx-auto h-96 max-w-5xl animate-pulse rounded-3xl bg-[#E6EDF2]" />;
  if (sessionQuery.error || !session) return <section className="mx-auto max-w-3xl rounded-2xl border border-[#E8C8C5] bg-[#FFF5F4] p-6 text-[#862E26]"><CircleAlert className="h-5 w-5" /><p className="mt-2 text-sm">{sessionQuery.error?.message ?? "This Practice Mock is unavailable."}</p><Button onClick={onReturnToSetup} variant="outline" className="mt-4 border-[#DCA8A2] bg-white">Back to setup</Button></section>;
  if (session.status !== "in_progress") return <section className="mx-auto max-w-3xl rounded-3xl border border-[#DDE5EA] bg-white p-8 text-center"><span className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${session.status === "expired" ? "bg-[#FFF0EF] text-[#B5473A]" : "bg-[#E8F4F0] text-[#16775A]"}`}>{session.status === "expired" ? <Clock3 className="h-6 w-6" /> : <Check className="h-6 w-6" />}</span><h1 className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-[#163A5F]">{session.status === "expired" ? "Time is up. Your progress is safe." : "Practice Mock submitted."}</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607082]">Your saved answers and flags are locked. Scoring and review are intentionally held for Phase 4 Sub-step 4b.</p><Button onClick={onReturnToSetup} className="mt-6 rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">Start another Practice Mock</Button></section>;

  const question = session.questions[currentIndex];
  const answerSaving = saveAnswer.isPending || setFlag.isPending;
  const moveToQuestion = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(session.questions.length - 1, nextIndex));
    setCurrentIndex(boundedIndex);
  };
  return <div className="mx-auto w-full max-w-6xl space-y-4 pb-12"><header className="sticky top-16 z-10 rounded-2xl border border-[#DDE5EA] bg-white/95 p-4 shadow-sm backdrop-blur sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#245EA8]">Practice Mock · {session.questions.length} questions</p><p className="mt-1 text-sm font-semibold text-[#526477]">{session.progress.answered} answered · {session.progress.flagged} flagged · {session.progress.unanswered} remaining</p></div><div className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-2xl font-bold tabular-nums ${isFinalFiveMinutes ? "bg-[#FFF0EF] text-[#B5473A] ring-2 ring-[#E5ACA6]" : "bg-[#E8F0FA] text-[#163A5F]"}`}><TimerReset className="h-5 w-5" strokeWidth={1.8} />{formatTime(remainingSeconds)}</div></div>{isFinalFiveMinutes ? <p className="mt-3 flex items-center gap-2 text-xs font-bold text-[#B5473A]"><AlertCircle className="h-4 w-4" /> Final five minutes: review flags or complete unanswered questions.</p> : null}</header>
    <div className="grid gap-5 lg:grid-cols-[1fr_244px]"><section className="overflow-hidden rounded-3xl border border-[#DDE5EA] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE5EA] bg-[#F9FBFC] px-5 py-4"><div className="flex flex-wrap items-center gap-2 text-xs font-bold"><span className="rounded-full bg-[#E8F0FA] px-3 py-1 text-[#245EA8]">{question.subjectName}</span><span className="rounded-full bg-[#E9EFF5] px-3 py-1 text-[#163A5F]">{question.topicName}</span><span className="rounded-full border border-[#DDE5EA] bg-white px-3 py-1 capitalize text-[#607082]">{question.difficulty}</span></div><Button onClick={() => setFlag.mutate({ mockExamId: sessionId, questionId: question.questionId, flagged: !question.flagged })} disabled={answerSaving} variant="outline" className={`h-9 rounded-xl ${question.flagged ? "border-[#E5B267] bg-[#FFF9EC] text-[#8A5800]" : "border-[#C8D6E1] bg-white text-[#526477]"}`}><Flag className="mr-2 h-3.5 w-3.5" fill={question.flagged ? "currentColor" : "none"} />{question.flagged ? "Flagged" : "Flag for review"}</Button></div><div className="p-5 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#607082]">Question {currentIndex + 1} of {session.questions.length}</p><p className="mt-3 font-display text-xl font-bold leading-8 tracking-[-0.025em] text-[#163A5F] sm:text-2xl">{question.questionText}</p><fieldset disabled={answerSaving} className="mt-7 space-y-3">{question.options.map(option => { const isSelected = question.selectedAnswer === option.key; return <label key={option.key} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${isSelected ? "border-[#8AB1E0] bg-[#EFF5FC]" : "border-[#DDE5EA] bg-white hover:border-[#AABFCE]"}`}><input type="radio" name={`mock-question-${question.questionId}`} value={option.key} checked={isSelected} onChange={() => saveAnswer.mutate({ mockExamId: sessionId, questionId: question.questionId, selectedAnswer: option.key })} className="h-4 w-4 accent-[#245EA8]" /><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EEF3F6] text-xs font-bold text-[#46586B]">{option.key}</span><span className="flex-1 text-sm font-semibold leading-6 text-[#162235]">{option.text}</span>{isSelected ? <span className="rounded-full bg-[#DCEBFA] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#245EA8]">Selected</span> : null}{isSelected ? <Check className="h-5 w-5 text-[#245EA8]" strokeWidth={2} /> : null}</label>; })}</fieldset>{saveAnswer.error || setFlag.error ? <p className="mt-4 flex gap-2 text-xs text-[#B5473A]"><CircleAlert className="h-4 w-4 shrink-0" />{saveAnswer.error?.message ?? setFlag.error?.message}</p> : null}<div className="mt-7 flex flex-wrap justify-between gap-3"><Button onClick={() => setCurrentIndex(index => Math.max(0, index - 1))} disabled={currentIndex === 0} variant="outline" className="h-10 rounded-xl border-[#C8D6E1] bg-white text-[#245EA8]"><ArrowLeft className="mr-1.5 h-4 w-4" />Previous</Button><Button onClick={() => setCurrentIndex(index => Math.min(session.questions.length - 1, index + 1))} disabled={currentIndex === session.questions.length - 1} className="h-10 rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">Next<ArrowRight className="ml-1.5 h-4 w-4" /></Button></div></div></section>
      <aside className="space-y-4"><section className="rounded-2xl border border-[#DDE5EA] bg-white p-4"><div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-[#245EA8]" /><p className="text-sm font-bold text-[#163A5F]">Question navigator</p></div><div className="mt-4 grid grid-cols-5 gap-2">{session.questions.map((item, index) => <button key={item.questionId} onClick={() => moveToQuestion(index)} className={`grid aspect-square place-items-center rounded-lg text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#245EA8] ${index === currentIndex ? "bg-[#245EA8] text-white" : item.flagged ? "border border-[#E5B267] bg-[#FFF9EC] text-[#8A5800]" : item.selectedAnswer ? "bg-[#E8F4F0] text-[#16775A]" : "bg-[#EEF3F6] text-[#526477]"}`} aria-label={`Question ${index + 1}${item.selectedAnswer ? ", answered" : ", unanswered"}${item.flagged ? ", flagged" : ""}`}>{index + 1}</button>)}</div><div className="mt-4 space-y-1.5 text-xs text-[#607082]"><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#16775A]" />Answered</p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#E5B267]" />Flagged</p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#B6C5D0]" />Unanswered</p></div></section><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" className="h-11 w-full rounded-xl border border-[#C8D6E1] bg-white text-[#163A5F] hover:bg-[#EEF4F8]">Submit Practice Mock</Button></AlertDialogTrigger><AlertDialogContent className="border-[#DDE5EA] bg-white text-[#162235]"><AlertDialogHeader><AlertDialogTitle className="font-display text-2xl text-[#163A5F]">Submit this Practice Mock?</AlertDialogTitle><AlertDialogDescription className="leading-6 text-[#607082]">You have answered {session.progress.answered} of {session.progress.total} questions. {session.progress.unanswered} remain unanswered. Submission locks this session; scoring and review arrive in Sub-step 4b.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="rounded-xl border-[#C8D6E1] bg-white text-[#46586B]">Keep working</AlertDialogCancel><AlertDialogAction onClick={() => submitMock.mutate({ mockExamId: sessionId })} className="rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">{submitMock.isPending ? "Submitting…" : "Submit now"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></aside></div>
  </div>;
}
