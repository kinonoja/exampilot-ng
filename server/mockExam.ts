import { and, asc, eq, inArray, sql } from "drizzle-orm";
import {
  exams,
  mockExamQuestions,
  mockExams,
  questions,
  subjects,
  topics,
  type QuestionOption,
} from "../drizzle/schema";
import { getDb } from "./db";

export const PRACTICE_MOCK_QUESTION_COUNTS = [5, 10, 15] as const;
export const PRACTICE_MOCK_DURATION_MINUTES = [5, 10, 15] as const;

type MockStatus = "in_progress" | "submitted" | "expired";

export function getMockLifecycle(
  status: MockStatus,
  startedAt: Date,
  durationSeconds: number,
  now = new Date(),
) {
  const remainingSeconds = Math.max(
    0,
    durationSeconds - Math.floor((now.getTime() - startedAt.getTime()) / 1000),
  );
  return {
    status: status === "in_progress" && remainingSeconds === 0 ? "expired" : status,
    remainingSeconds,
  } as const;
}

export function getMockProgress(
  rows: Array<{ selectedAnswer: string | null; flagged: boolean }>,
) {
  const answered = rows.filter(row => Boolean(row.selectedAnswer)).length;
  const flagged = rows.filter(row => row.flagged).length;
  return { answered, flagged, unanswered: rows.length - answered, total: rows.length };
}

type StartPracticeMockInput = {
  examId: number;
  subjectIds: number[];
  questionCount: (typeof PRACTICE_MOCK_QUESTION_COUNTS)[number];
  durationMinutes: (typeof PRACTICE_MOCK_DURATION_MINUTES)[number];
  includeAIGenerated: boolean;
};

async function getOwnedMockHeader(userId: number, mockExamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const rows = await db
    .select({
      id: mockExams.id,
      userId: mockExams.userId,
      examId: mockExams.examId,
      subjectIds: mockExams.subjectIds,
      startedAt: mockExams.startedAt,
      submittedAt: mockExams.submittedAt,
      durationSeconds: mockExams.durationSeconds,
      status: mockExams.status,
    })
    .from(mockExams)
    .where(and(eq(mockExams.id, mockExamId), eq(mockExams.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

async function getResolvedMockHeader(userId: number, mockExamId: number, now = new Date()) {
  const header = await getOwnedMockHeader(userId, mockExamId);
  if (!header) return null;
  const lifecycle = getMockLifecycle(header.status, header.startedAt, header.durationSeconds, now);
  if (lifecycle.status !== header.status) {
    const db = await getDb();
    if (!db) throw new Error("Practice Mock is currently unavailable.");
    await db
      .update(mockExams)
      .set({ status: "expired", submittedAt: now })
      .where(and(eq(mockExams.id, mockExamId), eq(mockExams.userId, userId), eq(mockExams.status, "in_progress")));
    return { ...header, status: "expired" as const, submittedAt: now };
  }
  return header;
}

export async function getPracticeMockSetup() {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock setup is currently unavailable.");
  const jamb = await db.select().from(exams).where(eq(exams.name, "JAMB")).limit(1);
  const exam = jamb[0];
  if (!exam) throw new Error("The current JAMB practice catalogue is unavailable.");
  const rows = await db
    .select({ id: subjects.id, name: subjects.name, originalQuestionCount: sql<number>`SUM(CASE WHEN ${questions.isAIGenerated} = 0 THEN 1 ELSE 0 END)`, aiQuestionCount: sql<number>`SUM(CASE WHEN ${questions.isAIGenerated} = 1 THEN 1 ELSE 0 END)` })
    .from(subjects)
    .leftJoin(questions, eq(questions.subjectId, subjects.id))
    .where(eq(subjects.examId, exam.id))
    .groupBy(subjects.id, subjects.name)
    .orderBy(asc(subjects.name));
  return {
    exam: { id: exam.id, name: exam.name },
    subjects: rows.map(row => ({
      ...row,
      originalQuestionCount: Number(row.originalQuestionCount ?? 0),
      aiQuestionCount: Number(row.aiQuestionCount ?? 0),
    })),
    questionCounts: PRACTICE_MOCK_QUESTION_COUNTS,
    durationMinutes: PRACTICE_MOCK_DURATION_MINUTES,
  };
}

export async function startPracticeMock(userId: number, input: StartPracticeMockInput) {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const uniqueSubjectIds = input.subjectIds.filter((subjectId, index, all) => all.indexOf(subjectId) === index);
  const examRows = await db.select({ id: exams.id, name: exams.name }).from(exams).where(eq(exams.id, input.examId)).limit(1);
  if (examRows[0]?.name !== "JAMB") throw new Error("Practice Mock is currently available for the existing JAMB bank only.");
  const selectedSubjects = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(and(eq(subjects.examId, input.examId), inArray(subjects.id, uniqueSubjectIds)));
  if (selectedSubjects.length !== uniqueSubjectIds.length) throw new Error("Choose available JAMB subjects for this Practice Mock.");

  const conditions = [eq(questions.examId, input.examId), inArray(questions.subjectId, uniqueSubjectIds)];
  if (!input.includeAIGenerated) conditions.push(eq(questions.isAIGenerated, false));
  const selectedQuestions = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(...conditions))
    .orderBy(sql`RAND()`)
    .limit(input.questionCount);
  if (selectedQuestions.length !== input.questionCount) {
    throw new Error(`This selection has ${selectedQuestions.length} eligible questions. Choose fewer questions, more subjects, or include approved AI practice questions.`);
  }

  const startedAt = new Date();
  const result = await db.insert(mockExams).values({
    userId,
    examId: input.examId,
    subjectIds: uniqueSubjectIds,
    startedAt,
    durationSeconds: input.durationMinutes * 60,
    status: "in_progress",
  });
  const mockExamId = Number(result[0].insertId);
  await db.insert(mockExamQuestions).values(selectedQuestions.map((question, index) => ({
    mockExamId,
    questionId: question.id,
    position: index + 1,
  })));
  return getPracticeMockSession(userId, mockExamId);
}

export async function getPracticeMockSession(userId: number, mockExamId: number) {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const rows = await db
    .select({
      id: mockExamQuestions.id,
      position: mockExamQuestions.position,
      selectedAnswer: mockExamQuestions.selectedAnswer,
      flagged: mockExamQuestions.flagged,
      questionId: questions.id,
      questionText: questions.questionText,
      options: questions.options,
      subjectName: subjects.name,
      topicName: topics.name,
      difficulty: questions.difficulty,
    })
    .from(mockExamQuestions)
    .innerJoin(questions, eq(mockExamQuestions.questionId, questions.id))
    .innerJoin(subjects, eq(questions.subjectId, subjects.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(mockExamQuestions.mockExamId, mockExamId))
    .orderBy(asc(mockExamQuestions.position));
  const lifecycle = getMockLifecycle(header.status, header.startedAt, header.durationSeconds);
  const sessionRows = rows.map(row => ({ ...row, options: row.options as QuestionOption[] }));
  return {
    id: header.id,
    examId: header.examId,
    subjectIds: header.subjectIds,
    startedAt: header.startedAt,
    submittedAt: header.submittedAt,
    durationSeconds: header.durationSeconds,
    status: lifecycle.status,
    remainingSeconds: lifecycle.remainingSeconds,
    questions: sessionRows,
    progress: getMockProgress(sessionRows),
  };
}

async function requireEditableMock(userId: number, mockExamId: number) {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  if (header.status !== "in_progress") throw new Error("This Practice Mock is no longer accepting changes.");
  return header;
}

export async function savePracticeMockAnswer(userId: number, input: { mockExamId: number; questionId: number; selectedAnswer: string }) {
  await requireEditableMock(userId, input.mockExamId);
  const db = await getDb();
  if (!db) throw new Error("Your answer could not be saved at this time.");
  const rows = await db
    .select({ id: mockExamQuestions.id, options: questions.options })
    .from(mockExamQuestions)
    .innerJoin(questions, eq(mockExamQuestions.questionId, questions.id))
    .where(and(eq(mockExamQuestions.mockExamId, input.mockExamId), eq(mockExamQuestions.questionId, input.questionId)))
    .limit(1);
  const row = rows[0];
  if (!row) throw new Error("That question is not part of this Practice Mock.");
  const isValidAnswer = (row.options as QuestionOption[]).some(option => option.key === input.selectedAnswer);
  if (!isValidAnswer) throw new Error("Choose one of the available answer options.");
  await db.update(mockExamQuestions).set({ selectedAnswer: input.selectedAnswer }).where(eq(mockExamQuestions.id, row.id));
  return { saved: true };
}

export async function setPracticeMockFlag(userId: number, input: { mockExamId: number; questionId: number; flagged: boolean }) {
  await requireEditableMock(userId, input.mockExamId);
  const db = await getDb();
  if (!db) throw new Error("Your review flag could not be saved at this time.");
  const result = await db
    .update(mockExamQuestions)
    .set({ flagged: input.flagged })
    .where(and(eq(mockExamQuestions.mockExamId, input.mockExamId), eq(mockExamQuestions.questionId, input.questionId)));
  if (Number(result[0]?.affectedRows ?? 0) === 0) throw new Error("That question is not part of this Practice Mock.");
  return { saved: true };
}

export async function submitPracticeMock(userId: number, mockExamId: number) {
  await requireEditableMock(userId, mockExamId);
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const submittedAt = new Date();
  await db.update(mockExams).set({ status: "submitted", submittedAt }).where(and(eq(mockExams.id, mockExamId), eq(mockExams.userId, userId)));
  return { status: "submitted" as const, submittedAt };
}

export async function expirePracticeMock(userId: number, mockExamId: number) {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  return { status: header.status };
}
