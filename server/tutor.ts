import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { attempts, questions, subjects, topics, tutorConversations } from "../drizzle/schema";
import { getTutorEntitlement } from "./entitlements";
import { getDb, getStudentProfile } from "./db";
import { invokeAnthropic, isTemporaryAnthropicAvailabilityError } from "./anthropic";
import { ENV } from "./_core/env";
import { INITIAL_MODE_MESSAGE, TUTOR_SYSTEM_PROMPT } from "./tutorPrompt";

export type TutorMode = "direct" | "guided";
export type TutorMessage = { role: "user" | "assistant"; content: string; createdAt: string };
type TutorQuestionContext = {
  questionText: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  topic: string;
  selectedAnswer: string | null;
  attemptWasCorrect: boolean | null;
};

const TUTOR_MODEL = ENV.anthropicTutorModel;
const INPUT_COST_MICROUSD_PER_TOKEN = 1;
const OUTPUT_COST_MICROUSD_PER_TOKEN = 5;

function todayRange(now = new Date()) {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export function detectTutorMode(message: string): TutorMode | null {
  const normalized = message.toLowerCase().trim();
  if (/\b(just|direct|directly|give)\b.*\b(answer|solution|tell me)\b|^answer me\b/.test(normalized)) return "direct";
  if (/\b(help me understand|work (it )?out|work together|learn together|work through|guide me|socratic|walk me through)\b/.test(normalized)) return "guided";
  return null;
}

export function getTutorBoundaryResponse(message: string): string | null {
  const normalized = message.toLowerCase();
  if (/\b(kill myself|suicide|self[- ]?harm|hurt myself|end my life|don't want to live)\b/.test(normalized)) {
    return "I’m really sorry you’re feeling this way. Please contact local emergency services or a crisis line now, and tell a trusted adult such as a parent, guardian, teacher, or counsellor right away. You deserve support.";
  }
  if (/\b(overwhelmed|hopeless|panic|really upset|feel alone|can't cope)\b/.test(normalized) && !/\b(exam|test|study|school|question)\b/.test(normalized)) {
    return "I’m sorry things feel heavy right now. You deserve support, so please consider speaking with a trusted adult, teacher, counsellor, parent, or guardian. When you’re ready, I can help with your schoolwork too.";
  }
  if (/\b(ignore (all|any|previous)|reveal (your|the) (prompt|instructions)|system prompt|write (my|an) essay|do my homework|be my friend)\b/.test(normalized)) {
    return "I’m here to help with your revision, concepts, and practice questions. Ask me about a subject or question you are working on, and we can tackle it together.";
  }
  return null;
}

export function getQuestionContextFallback(mode: TutorMode, questionContext: TutorQuestionContext) {
  const correctOption = questionContext.options.find(option => option.key === questionContext.correctAnswer);
  const correctAnswer = correctOption
    ? `${correctOption.key}. ${correctOption.text}`
    : questionContext.correctAnswer;

  if (mode === "direct") {
    return `The correct answer is ${correctAnswer}. ${questionContext.explanation}`;
  }

  return `Let’s work from the key idea: ${questionContext.explanation} Now compare that idea with the options in the question. Which option best matches it?`;
}

async function getDailyTutorRequestCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Tutor usage is currently unavailable.");
  const { start, end } = todayRange();
  const result = await db
    .select({ chargeableRequests: tutorConversations.chargeableRequests })
    .from(tutorConversations)
    .where(and(eq(tutorConversations.userId, userId), gte(tutorConversations.createdAt, start), lt(tutorConversations.createdAt, end)));
  return result.reduce((total, conversation) => total + conversation.chargeableRequests, 0);
}

async function getQuestionContext(userId: number, questionId: number) {
  const db = await getDb();
  if (!db) throw new Error("The practice question is currently unavailable.");
  const questionRows = await db
    .select({
      questionText: questions.questionText,
      options: questions.options,
      correctAnswer: questions.correctAnswer,
      explanation: questions.explanation,
      subject: subjects.name,
      topic: topics.name,
    })
    .from(questions)
    .innerJoin(subjects, eq(questions.subjectId, subjects.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(questions.id, questionId))
    .limit(1);
  const question = questionRows[0];
  if (!question) throw new Error("That practice question is no longer available.");
  const attemptRows = await db
    .select({ selectedAnswer: attempts.selectedAnswer, isCorrect: attempts.isCorrect })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.questionId, questionId)))
    .orderBy(desc(attempts.createdAt))
    .limit(1);
  return { ...question, selectedAnswer: attemptRows[0]?.selectedAnswer ?? null, attemptWasCorrect: attemptRows[0]?.isCorrect ?? null };
}

async function getOwnedConversation(userId: number, conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Tutor conversations are currently unavailable.");
  const rows = await db
    .select()
    .from(tutorConversations)
    .where(and(eq(tutorConversations.id, conversationId), eq(tutorConversations.userId, userId)))
    .limit(1);
  if (!rows[0]) throw new Error("Tutor session not found.");
  return rows[0];
}

export async function startTutorConversation(userId: number, input: { topic?: string; questionId?: number }) {
  const [profile, dailyTutorRequestCount] = await Promise.all([getStudentProfile(userId), getDailyTutorRequestCount(userId)]);
  if (!profile) throw new Error("Your student profile could not be found.");
  const entitlement = getTutorEntitlement({
    subscriptionStatus: profile.subscriptionStatus,
    subscriptionExpiresAt: profile.subscriptionExpiresAt,
    dailyTutorRequestCount,
  });
  if (!entitlement.canUseTutor) return { limitReached: true as const, entitlement, conversation: null };

  const db = await getDb();
  if (!db) throw new Error("Tutor conversations are currently unavailable.");
  const questionContext = input.questionId ? await getQuestionContext(userId, input.questionId) : null;
  const initialMessage: TutorMessage = { role: "assistant", content: INITIAL_MODE_MESSAGE, createdAt: new Date().toISOString() };
  const topic = input.topic?.trim() || questionContext?.topic || null;
  const result = await db.insert(tutorConversations).values({
    userId,
    topic,
    messages: [initialMessage],
    mode: null,
  });
  const conversationId = Number(result[0].insertId);
  return {
    limitReached: false as const,
    entitlement,
    conversation: { id: conversationId, topic, mode: null, messages: [initialMessage], questionContext },
  };
}

export async function sendTutorMessage(userId: number, input: { conversationId: number; message: string; questionId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Tutor conversations are currently unavailable.");
  const conversation = await getOwnedConversation(userId, input.conversationId);
  const history = (conversation.messages as TutorMessage[]) || [];
  const userMessage: TutorMessage = { role: "user", content: input.message.trim(), createdAt: new Date().toISOString() };
  if (!userMessage.content) throw new Error("Write a question for your tutor first.");
  const boundaryResponse = getTutorBoundaryResponse(userMessage.content);
  const detectedMode = detectTutorMode(userMessage.content);
  const mode = detectedMode ?? conversation.mode;
  const isChargeableRequest = !boundaryResponse && Boolean(mode);
  if (!boundaryResponse) {
    const [profile, dailyTutorRequestCount] = await Promise.all([getStudentProfile(userId), getDailyTutorRequestCount(userId)]);
    if (!profile) throw new Error("Your student profile could not be found.");
    const entitlement = getTutorEntitlement({
      subscriptionStatus: profile.subscriptionStatus,
      subscriptionExpiresAt: profile.subscriptionExpiresAt,
      dailyTutorRequestCount,
    });
    if (!entitlement.canUseTutor) throw new Error("You have used today’s Free Tutor question. Upgrade to Pro for unlimited Tutor help.");
  }
  const questionContext = input.questionId ? await getQuestionContext(userId, input.questionId) : null;
  let assistantContent: string;
  let usage = { inputTokens: 0, outputTokens: 0, estimatedCostMicrousd: 0 };

  if (boundaryResponse) {
    assistantContent = boundaryResponse;
  } else if (!mode) {
    assistantContent = "I can explain this in two ways. Would you like the answer directly, or should we work it out together?";
  } else {
    const sessionContext = {
      selectedMode: mode,
      topic: conversation.topic,
      questionContext,
      note: detectedMode && detectedMode !== conversation.mode ? `The student has just switched to ${mode.toUpperCase()} mode. Continue using that mode now.` : undefined,
    };
    const recentMessages = [...history, userMessage].slice(-12).map(message => ({ role: message.role, content: message.content }));
    try {
      // Anthropic's Messages API takes initial instructions in a top-level
      // system field, so the prior prompt + session context system messages
      // are combined there and the user/assistant history passes unchanged.
      const response = await invokeAnthropic({
        model: TUTOR_MODEL,
        maxTokens: 420,
        system: `${TUTOR_SYSTEM_PROMPT}\n\nSESSION CONTEXT\n${JSON.stringify(sessionContext)}`,
        messages: recentMessages,
      });
      assistantContent = response.text || "I’m sorry, I could not prepare that explanation. Please try again.";
      const inputTokens = response.inputTokens;
      const outputTokens = response.outputTokens;
      usage = { inputTokens, outputTokens, estimatedCostMicrousd: inputTokens * INPUT_COST_MICROUSD_PER_TOKEN + outputTokens * OUTPUT_COST_MICROUSD_PER_TOKEN };
    } catch (error) {
      if (!questionContext || !isTemporaryAnthropicAvailabilityError(error)) throw error;
      assistantContent = getQuestionContextFallback(mode, questionContext);
    }
  }

  const assistantMessage: TutorMessage = { role: "assistant", content: assistantContent, createdAt: new Date().toISOString() };
  const messages = [...history, userMessage, assistantMessage];
  await db
    .update(tutorConversations)
    .set({
      messages,
      mode,
      inputTokens: conversation.inputTokens + usage.inputTokens,
      outputTokens: conversation.outputTokens + usage.outputTokens,
      estimatedCostMicrousd: conversation.estimatedCostMicrousd + usage.estimatedCostMicrousd,
      chargeableRequests: conversation.chargeableRequests + (isChargeableRequest ? 1 : 0),
    })
    .where(eq(tutorConversations.id, conversation.id));
  return { id: conversation.id, mode, messages, usage };
}
