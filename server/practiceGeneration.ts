import { and, desc, eq } from "drizzle-orm";
import { exams, questions, subjects, topics, type QuestionOption } from "../drizzle/schema";
import { getDb } from "./db";
import { invokeLLM } from "./_core/llm";

const GENERATION_MODEL = "claude-haiku-4-5";
const AI_GENERATION_SOURCE = "ExamPilot AI Practice Generation v1";
const optionKeys = ["A", "B", "C", "D"] as const;

export type GeneratedQuestion = {
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  options: QuestionOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  tags: string[];
};

type GenerationContext = {
  examId: number;
  examName: string;
  subjectId: number;
  subjectName: string;
  topicId: number;
  topicName: string;
  existingQuestionTexts: string[];
};

function completionText(content: unknown) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .filter((part): part is { type: "text"; text: string } =>
      typeof part === "object" && part !== null && "type" in part && "text" in part &&
      (part as { type?: unknown }).type === "text" && typeof (part as { text?: unknown }).text === "string",
    )
    .map(part => part.text)
    .join("\n")
    .trim();
}

export function parseGeneratedQuestionPayload(content: unknown) {
  const text = completionText(content);
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced?.[1] ?? text);
}

function normalizeQuestion(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function readableText(value: unknown, min: number, max: number) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function canonicalDifficulty(value: unknown): GeneratedQuestion["difficulty"] | null {
  if (value === 1 || value === "1") return "easy";
  if (value === 2 || value === "2") return "medium";
  if (value === 3 || value === "3") return "hard";
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (/\b(easy|basic|beginner)\b/.test(normalized)) return "easy";
  if (/\b(medium|moderate|intermediate|standard)\b/.test(normalized)) return "medium";
  if (/\b(hard|advanced|challenging|difficult)\b/.test(normalized)) return "hard";
  return null;
}

export function validateGeneratedQuestionSet(payload: unknown, expectedCount: number): GeneratedQuestion[] {
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { questions?: unknown }).questions)) {
    throw new Error("Claude did not return a usable question set.");
  }
  const rawQuestions = (payload as { questions: unknown[] }).questions;
  if (rawQuestions.length !== expectedCount || rawQuestions.length < 3 || rawQuestions.length > 5) {
    throw new Error("Claude must return exactly the requested 3–5 questions.");
  }

  const seenTexts = new Set<string>();
  return rawQuestions.map((raw, index) => {
    if (!raw || typeof raw !== "object") throw new Error(`Generated question ${index + 1} is invalid.`);
    const question = raw as Record<string, unknown>;
    const difficulty = canonicalDifficulty(question.difficulty);
    if (!difficulty) {
      throw new Error(`Generated question ${index + 1} has an unsupported difficulty.`);
    }
    if (!readableText(question.questionText, 16, 900) || !readableText(question.explanation, 12, 1200)) {
      throw new Error(`Generated question ${index + 1} needs a complete prompt and explanation.`);
    }
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Generated question ${index + 1} must have exactly four options.`);
    }
    const options = question.options.map((option, optionIndex) => {
      if (!option || typeof option !== "object") throw new Error(`Generated question ${index + 1} has an invalid option.`);
      const item = option as Record<string, unknown>;
      if (item.key !== optionKeys[optionIndex] || !readableText(item.text, 1, 320)) {
        throw new Error(`Generated question ${index + 1} options must use ordered A–D labels.`);
      }
      return { key: item.key, text: (item.text as string).trim() } as QuestionOption;
    });
    if (!optionKeys.includes(question.correctAnswer as (typeof optionKeys)[number])) {
      throw new Error(`Generated question ${index + 1} needs a valid correct-answer label.`);
    }
    if (!Array.isArray(question.tags) || question.tags.length < 1 || question.tags.length > 5 || !question.tags.every(tag => readableText(tag, 2, 48))) {
      throw new Error(`Generated question ${index + 1} needs one to five clear topic tags.`);
    }
    const questionText = (question.questionText as string).trim();
    const normalized = normalizeQuestion(questionText);
    if (seenTexts.has(normalized)) throw new Error("Claude generated duplicate question wording.");
    seenTexts.add(normalized);
    return {
      difficulty,
      questionText,
      options,
      correctAnswer: question.correctAnswer as GeneratedQuestion["correctAnswer"],
      explanation: (question.explanation as string).trim(),
      tags: (question.tags as string[]).map(tag => tag.trim()),
    };
  });
}

export function generatedQuestionInsert(context: Omit<GenerationContext, "existingQuestionTexts">, question: GeneratedQuestion) {
  return {
    examId: context.examId,
    subjectId: context.subjectId,
    topicId: context.topicId,
    year: null,
    difficulty: question.difficulty,
    questionText: question.questionText,
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    source: AI_GENERATION_SOURCE,
    tags: question.tags,
    isAIGenerated: true,
  };
}

async function getGenerationContext(topicId: number): Promise<GenerationContext> {
  const db = await getDb();
  if (!db) throw new Error("Question generation is currently unavailable.");
  const rows = await db
    .select({
      examId: exams.id,
      examName: exams.name,
      subjectId: subjects.id,
      subjectName: subjects.name,
      topicId: topics.id,
      topicName: topics.name,
    })
    .from(topics)
    .innerJoin(subjects, eq(topics.subjectId, subjects.id))
    .innerJoin(exams, eq(subjects.examId, exams.id))
    .where(eq(topics.id, topicId))
    .limit(1);
  const context = rows[0];
  if (!context) throw new Error("Choose an available topic before generating practice.");
  const recentRows = await db
    .select({ questionText: questions.questionText })
    .from(questions)
    .where(and(eq(questions.topicId, topicId), eq(questions.subjectId, context.subjectId)))
    .orderBy(desc(questions.createdAt))
    .limit(40);
  return { ...context, existingQuestionTexts: recentRows.map(row => row.questionText) };
}

function generationPrompt(context: GenerationContext, count: number) {
  return `Create exactly ${count} original ${context.examName} multiple-choice practice questions for Nigerian students.

Exam: ${context.examName}
Subject: ${context.subjectName}
Topic: ${context.topicName}

Return only one valid JSON object, with no Markdown or commentary. It must have exactly this shape: {"questions":[{"difficulty":"easy|medium|hard","questionText":"a self-contained question","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correctAnswer":"A|B|C|D","explanation":"at least one complete sentence","tags":["topic"]}]}. Include exactly ${count} questions. Each question must be academically sound, self-contained, age-appropriate, and genuinely different from the existing-question wording below. Use four plausible A–D options, one objectively correct answer, and a concise but complete explanation of at least one sentence. Use only lowercase easy, medium, or hard for difficulty. Do not cite sources, reuse copyrighted exam questions, refer to being an AI, or add any surrounding commentary.

Existing questions to avoid repeating:
${context.existingQuestionTexts.map((text, index) => `${index + 1}. ${text}`).join("\n")}`;
}

export async function generateTopicPracticeQuestions(input: { topicId: number; count: number }) {
  const context = await getGenerationContext(input.topicId);
  const response = await invokeLLM({
    model: GENERATION_MODEL,
    max_tokens: 3200,
    messages: [
      { role: "system", content: "You generate original, accurate exam-preparation questions in strict JSON only." },
      { role: "user", content: generationPrompt(context, input.count) },
    ],
    response_format: { type: "json_object" },
  });
  const questionsToInsert = validateGeneratedQuestionSet(parseGeneratedQuestionPayload(response.choices[0]?.message.content ?? "{}"), input.count);
  const existingNormalized = new Set(context.existingQuestionTexts.map(normalizeQuestion));
  if (questionsToInsert.some(question => existingNormalized.has(normalizeQuestion(question.questionText)))) {
    throw new Error("Claude returned wording already in this topic. Please try generating again.");
  }
  const db = await getDb();
  if (!db) throw new Error("Question generation is currently unavailable.");
  const inserted = [] as { id: number; difficulty: GeneratedQuestion["difficulty"]; questionText: string }[];
  for (const question of questionsToInsert) {
    const result = await db.insert(questions).values(generatedQuestionInsert(context, question));
    inserted.push({ id: Number(result[0].insertId), difficulty: question.difficulty, questionText: question.questionText });
  }
  return { topic: { id: context.topicId, name: context.topicName, subject: context.subjectName, exam: context.examName }, questions: inserted };
}
