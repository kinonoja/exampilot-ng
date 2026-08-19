import { useMemo, useState } from "react";
import { BookOpenCheck, CircleAlert, MessageCircleQuestion, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { AIChatBox } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type ActiveConversation = {
  id: number;
  topic: string | null;
  mode: "direct" | "guided" | null;
  messages: { role: "user" | "assistant"; content: string; createdAt: string }[];
  questionId?: number;
};

export default function Tutor() {
  const [location, setLocation] = useLocation();
  const linkedQuestionId = useMemo(() => {
    const value = new URLSearchParams(location.split("?")[1] ?? "").get("questionId");
    return value ? Number(value) : undefined;
  }, [location]);
  const [topic, setTopic] = useState("");
  const [conversation, setConversation] = useState<ActiveConversation | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const startTutor = trpc.tutor.start.useMutation();
  const sendTutor = trpc.tutor.send.useMutation();

  const begin = async () => {
    try {
      const result = await startTutor.mutateAsync({
        ...(topic.trim() ? { topic: topic.trim() } : {}),
        ...(linkedQuestionId ? { questionId: linkedQuestionId } : {}),
      });
      if (result.limitReached || !result.conversation) {
        setLimitReached(true);
        return;
      }
      setLimitReached(false);
      setConversation({ ...result.conversation, questionId: linkedQuestionId });
    } catch {
      // The mutation error is shown in the interface below.
    }
  };

  const send = async (message: string) => {
    if (!conversation) return;
    try {
      const result = await sendTutor.mutateAsync({
        conversationId: conversation.id,
        message,
        ...(conversation.questionId ? { questionId: conversation.questionId } : {}),
      });
      setConversation(previous => previous ? { ...previous, mode: result.mode, messages: result.messages } : previous);
    } catch {
      // The mutation error is shown in the interface below.
    }
  };

  const chooseMode = (mode: "direct" | "guided") => {
    const concept = conversation?.topic ? ` about ${conversation.topic}` : "";
    send(mode === "direct" ? `Please give me the answer directly${concept}.` : `Please help me understand and work it out${concept}.`);
  };

  return <div className="mx-auto w-full max-w-5xl space-y-5 pb-12"><header><p className="font-mono text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-700">AI Tutor · Sub-step 3a</p><h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Ask. Understand. Keep moving.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Choose the help style that works for you. You can switch between a direct answer and guided steps at any point.</p></header>
    {!conversation && !limitReached ? <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.8fr]"><div><MessageCircleQuestion className="h-6 w-6 text-emerald-700" /><h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-950">What are you studying?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Describe a concept, or come here from a practice question for help with the exact answer you chose.</p><label className="mt-5 block text-sm font-semibold text-slate-700">Concept or topic<input value={topic} onChange={event => setTopic(event.target.value)} disabled={Boolean(linkedQuestionId)} placeholder={linkedQuestionId ? "This session is linked to your practice question" : "For example: simultaneous equations"} className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-950 outline-none focus:ring-2 focus:ring-lime-300 disabled:cursor-not-allowed disabled:bg-slate-100" /></label><Button disabled={startTutor.isPending || (!topic.trim() && !linkedQuestionId)} onClick={begin} className="mt-5 h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800">{startTutor.isPending ? "Starting your Tutor…" : "Start Tutor session"}</Button>{startTutor.error ? <p className="mt-3 text-sm text-red-700">{startTutor.error.message}</p> : null}</div><aside className="rounded-2xl bg-slate-950 p-6 text-white"><Sparkles className="h-5 w-5 text-lime-300" /><p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-lime-300">Your choice, your pace</p><p className="mt-3 text-sm leading-6 text-slate-300">Ask for the answer when you need it, or work through the idea one step at a time. The Tutor remembers your preferred style for the session.</p></aside></section> : null}
    {limitReached ? <section className="rounded-3xl border border-lime-200 bg-lime-100 p-6 text-slate-950"><CircleAlert className="h-5 w-5" /><h2 className="mt-3 font-display text-2xl font-bold">You have used today’s Free Tutor question.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-700">Pro includes unlimited Tutor questions, so you can keep working through difficult concepts whenever you need support.</p><Button onClick={() => setLocation("/billing")} className="mt-5 h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800">See Pro access</Button></section> : null}
    {conversation ? <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800"><BookOpenCheck className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-slate-950">{conversation.topic || "Practice-question help"}</p><p className="text-xs text-slate-500">{conversation.mode ? `${conversation.mode === "direct" ? "Direct answer" : "Guided understanding"} mode` : "Choose your preferred style"}</p></div></div><button onClick={() => { setConversation(null); setLimitReached(false); setTopic(""); setLocation("/tutor"); }} className="text-xs font-semibold text-emerald-700 underline underline-offset-4">New session</button></div>{!conversation.mode ? <div className="flex flex-col gap-3 rounded-2xl border border-lime-200 bg-lime-50 p-4 sm:flex-row"><Button disabled={sendTutor.isPending} onClick={() => chooseMode("direct")} className="h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800">Give me the answer</Button><Button disabled={sendTutor.isPending} onClick={() => chooseMode("guided")} variant="outline" className="h-10 rounded-xl border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50">Help me work it out</Button></div> : null}<AIChatBox messages={conversation.messages} onSendMessage={send} isLoading={sendTutor.isPending} placeholder={conversation.mode ? "Ask a follow-up question…" : "Choose a style above, or tell the Tutor naturally"} height="min(63vh, 620px)" suggestedPrompts={conversation.mode ? undefined : ["Give me the answer directly", "Help me understand and work it out"]} className="rounded-3xl border-slate-200" />{sendTutor.error ? <p className="text-sm text-red-700">{sendTutor.error.message}</p> : null}</section> : null}
  </div>;
}
