import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, CircleAlert, Clock3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

type Difficulty = "easy" | "medium" | "hard";

export default function Practice() {
  const [, setLocation] = useLocation();
  const catalogueQuery = trpc.practice.catalogue.useQuery(undefined, { refetchOnWindowFocus: false });
  const [examId, setExamId] = useState<number>();
  const [subjectId, setSubjectId] = useState<number>();
  const [topicId, setTopicId] = useState<number>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
  const [servedIds, setServedIds] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string } | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const accessQuery = trpc.practice.access.useQuery();

  useEffect(() => {
    if (!examId && catalogueQuery.data?.exams[0]) setExamId(catalogueQuery.data.exams[0].id);
  }, [catalogueQuery.data, examId]);

  const subjects = useMemo(() => (catalogueQuery.data?.subjects ?? []).filter(subject => subject.examId === examId), [catalogueQuery.data, examId]);
  const topics = useMemo(() => (catalogueQuery.data?.topics ?? []).filter(topic => topic.subjectId === subjectId), [catalogueQuery.data, subjectId]);
  const queryInput = useMemo(() => ({
    examId: examId ?? 0,
    subjectId,
    topicId,
    difficulty,
    previousQuestionIds: servedIds,
  }), [examId, subjectId, topicId, difficulty, servedIds]);
  const questionQuery = trpc.practice.next.useQuery(queryInput, { enabled: Boolean(examId), refetchOnWindowFocus: false });
  const submitAttempt = trpc.practice.submit.useMutation();
  const question = questionQuery.data?.question;
  const limitReached = questionQuery.data?.limitReached || accessQuery.data?.canPractice === false;

  useEffect(() => {
    if (!question) return;
    setSelectedAnswer("");
    setFeedback(null);
    setQuestionStartedAt(Date.now());
  }, [question?.id]);

  const submit = async () => {
    if (!question || !selectedAnswer) return;
    const result = await submitAttempt.mutateAsync({
      questionId: question.id,
      selectedAnswer,
      timeSpentSeconds: Math.round((Date.now() - questionStartedAt) / 1000),
    });
    if (result.limitReached || !result.feedback) return;
    setFeedback(result.feedback);
    accessQuery.refetch();
  };

  const nextQuestion = () => {
    if (!question) return;
    setServedIds(ids => [...ids, question.id].slice(-45));
  };

  if (catalogueQuery.isLoading || !examId) return <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-12">
      <header><p className="font-mono text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-700">Practice lab</p><h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">One question. One clearer step forward.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Choose your focus, then take your time. Every submitted answer is recorded in your learning history.</p></header>
      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Exam<select value={examId} onChange={event => { setExamId(Number(event.target.value)); setSubjectId(undefined); setTopicId(undefined); setServedIds([]); }} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:ring-2 focus:ring-lime-300">{catalogueQuery.data?.exams.map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}</select></label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject<select value={subjectId ?? "all"} onChange={event => { setSubjectId(event.target.value === "all" ? undefined : Number(event.target.value)); setTopicId(undefined); setServedIds([]); }} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:ring-2 focus:ring-lime-300"><option value="all">All subjects</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topic<select disabled={!subjectId} value={topicId ?? "all"} onChange={event => { setTopicId(event.target.value === "all" ? undefined : Number(event.target.value)); setServedIds([]); }} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-slate-50 focus:ring-2 focus:ring-lime-300"><option value="all">All topics</option>{topics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Level<select value={difficulty ?? "all"} onChange={event => { setDifficulty(event.target.value === "all" ? undefined : event.target.value as Difficulty); setServedIds([]); }} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:ring-2 focus:ring-lime-300"><option value="all">Mixed difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
      </section>

      {limitReached ? <UpgradePrompt /> : null}
      {!limitReached && questionQuery.isLoading ? <div className="h-96 animate-pulse rounded-3xl bg-slate-200" /> : null}
      {!limitReached && questionQuery.error ? <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800"><CircleAlert className="h-5 w-5" /><p className="mt-2 text-sm">{questionQuery.error.message}</p><Button onClick={() => questionQuery.refetch()} variant="outline" className="mt-4 rounded-xl">Try again</Button></section> : null}
      {!limitReached && !questionQuery.isLoading && !questionQuery.error && !question ? <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><p className="font-display text-xl font-bold text-slate-950">No matching question yet.</p><p className="mt-2 text-sm text-slate-600">Reset one or more filters to broaden your practice set.</p><Button onClick={() => { setSubjectId(undefined); setTopicId(undefined); setDifficulty(undefined); setServedIds([]); }} className="mt-5 rounded-xl bg-slate-950 text-white"><RotateCcw className="mr-2 h-4 w-4" /> Reset filters</Button></section> : null}
      {!limitReached && question ? <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4"><div className="flex items-center gap-2 text-xs font-semibold"><span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">{question.subjectName}</span><span className="rounded-full bg-violet-100 px-3 py-1 text-violet-800">{question.topicName}</span><span className="rounded-full bg-slate-200 px-3 py-1 capitalize text-slate-700">{question.difficulty}</span></div><span className="flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" /> Take your time</span></div><div className="p-5 sm:p-8"><p className="font-display text-xl font-bold leading-8 tracking-tight text-slate-950 sm:text-2xl">{question.questionText}</p><fieldset disabled={Boolean(feedback) || submitAttempt.isPending} className="mt-7 space-y-3">{question.options.map(option => { const isSelected = selectedAnswer === option.key; const isCorrect = feedback?.correctAnswer === option.key; const isWrong = Boolean(feedback && isSelected && !feedback.isCorrect); return <label key={option.key} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${isCorrect ? "border-emerald-400 bg-emerald-50" : isWrong ? "border-red-300 bg-red-50" : isSelected ? "border-lime-400 bg-lime-50" : "border-slate-200 bg-white hover:border-slate-300"}`}><input type="radio" name="answer" value={option.key} checked={isSelected} onChange={() => setSelectedAnswer(option.key)} className="h-4 w-4 accent-emerald-700" /><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">{option.key}</span><span className="text-sm font-medium leading-6 text-slate-800">{option.text}</span></label>; })}</fieldset>
        {!feedback ? <Button disabled={!selectedAnswer || submitAttempt.isPending} onClick={submit} className="mt-7 h-11 rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800">{submitAttempt.isPending ? "Checking your answer…" : "Submit answer"}</Button> : <div className={`mt-7 rounded-2xl border p-5 ${feedback.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}`}><div className="flex gap-3"><CheckCircle2 className={`mt-0.5 h-5 w-5 ${feedback.isCorrect ? "text-emerald-700" : "text-orange-600"}`} /><div><p className="font-semibold text-slate-950">{feedback.isCorrect ? "Correct — keep going." : `Not quite. The correct answer is ${feedback.correctAnswer}.`}</p><p className="mt-2 text-sm leading-6 text-slate-700">{feedback.explanation}</p><div className="mt-4 flex flex-wrap gap-3"><Button onClick={nextQuestion} className="h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800">Next question <ChevronRight className="ml-1.5 h-4 w-4" /></Button><Button onClick={() => setLocation(`/tutor?questionId=${question.id}`)} variant="outline" className="h-10 rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-50">Explain this with Tutor</Button></div></div></div></div>}
      </div></section> : null}
    </div>
  );
}
