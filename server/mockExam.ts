import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import {
  exams,
  mockExamQuestions,
  mockExams,
  questions,
  subjects,
  topics,
  type QuestionOption,
} from "../drizzle/schema";
import { getDb, getStudentProfile } from "./db";
import { getPracticeMockEntitlement } from "./entitlements";

export const PRACTICE_MOCK_QUESTION_COUNTS = [5, 10, 15] as const;
export const PRACTICE_MOCK_DURATION_MINUTES = [5, 10, 15] as const;

type MockStatus = "in_progress" | "submitted" | "expired";

type HistoryCandidate = {
  id: number;
  status: MockStatus;
  startedAt: Date;
  durationSeconds: number;
  submittedAt: Date | null;
  score: number | null;
  examId: number;
  examName: string;
  subjectIds: number[];
  questionCount: number | string | null;
};

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

export function getRestoredQuestionPosition(position: number, questionCount: number) {
  if (questionCount <= 0) return 1;
  return Math.max(1, Math.min(position, questionCount));
}

export function shouldResumePracticeMock(
  status: MockStatus,
  startedAt: Date,
  durationSeconds: number,
  now = new Date(),
) {
  return getMockLifecycle(status, startedAt, durationSeconds, now).status === "in_progress";
}

export function getHistoryFinalizationIds(
  rows: Array<Pick<HistoryCandidate, "id" | "status" | "startedAt" | "durationSeconds" | "score">>,
  now = new Date(),
) {
  return rows
    .filter(row => row.score === null && (
      row.status === "expired" || getMockLifecycle(row.status, row.startedAt, row.durationSeconds, now).status === "expired"
    ))
    .map(row => row.id);
}

export function buildMockHistory(rows: Array<Omit<HistoryCandidate, "durationSeconds">>) {
  return rows
    .filter(row => (row.status === "submitted" || row.status === "expired") && row.score !== null)
    .sort((first, second) => (second.submittedAt ?? second.startedAt).getTime() - (first.submittedAt ?? first.startedAt).getTime())
    .map(row => ({
      id: row.id,
      examId: row.examId,
      examName: row.examName,
      subjectIds: row.subjectIds,
      startedAt: row.startedAt,
      submittedAt: row.submittedAt,
      score: row.score,
      status: row.status,
      questionCount: Number(row.questionCount ?? 0),
    }));
}

type ScoreableMockQuestion = {
  selectedAnswer: string | null;
  correctAnswer: string;
};

export function getMockScore(rows: ScoreableMockQuestion[]) {
  const correct = rows.filter(row => row.selectedAnswer === row.correctAnswer).length;
  const total = rows.length;
  return { correct, total, score: total ? Math.round((correct / total) * 100) : 0 };
}

export function getMockTopicBreakdown(rows: Array<ScoreableMockQuestion & { topicName: string }>) {
  const topics = new Map<string, { total: number; correct: number }>();
  rows.forEach(row => {
    const summary = topics.get(row.topicName) ?? { total: 0, correct: 0 };
    summary.total += 1;
    if (row.selectedAnswer === row.correctAnswer) summary.correct += 1;
    topics.set(row.topicName, summary);
  });
  return Array.from(topics.entries()).map(([topicName, summary]) => ({
    topicName,
    ...summary,
    accuracy: summary.total ? Math.round((summary.correct / summary.total) * 100) : 0,
  }));
}

export function getMockPace(input: { startedAt: Date; submittedAt: Date; durationSeconds: number; questionCount: number }) {
  const elapsedSeconds = Math.max(0, Math.min(input.durationSeconds, Math.floor((input.submittedAt.getTime() - input.startedAt.getTime()) / 1000)));
  const plannedSecondsPerQuestion = input.questionCount ? Math.round(input.durationSeconds / input.questionCount) : 0;
  const actualSecondsPerQuestion = input.questionCount ? Math.round(elapsedSeconds / input.questionCount) : 0;
  return {
    elapsedSeconds,
    plannedSecondsPerQuestion,
    actualSecondsPerQuestion,
    paceStatus: actualSecondsPerQuestion > plannedSecondsPerQuestion * 1.1 ? "over_pace" as const : "within_pace" as const,
  };
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
      currentQuestionPosition: mockExams.currentQuestionPosition,
      score: mockExams.score,
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
    subjects: rows
      .map(row => ({
        ...row,
        originalQuestionCount: Number(row.originalQuestionCount ?? 0),
        aiQuestionCount: Number(row.aiQuestionCount ?? 0),
      }))
      .filter(subject => subject.originalQuestionCount + subject.aiQuestionCount > 0),
    questionCounts: PRACTICE_MOCK_QUESTION_COUNTS,
    durationMinutes: PRACTICE_MOCK_DURATION_MINUTES,
  };
}

export async function getMockEntitlement(userId: number) {
  const profile = await getStudentProfile(userId);
  if (!profile) throw new Error("Your student profile could not be found.");
  return getPracticeMockEntitlement({ subscriptionStatus: profile.subscriptionStatus, subscriptionExpiresAt: profile.subscriptionExpiresAt });
}

export async function startPracticeMock(userId: number, input: StartPracticeMockInput) {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const activeSession = await getActivePracticeMock(userId);
  if (activeSession) return activeSession;
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
    currentQuestionPosition: 1,
    status: "in_progress",
  });
  const mockExamId = Number(result[0].insertId);
  await db.insert(mockExamQuestions).values(selectedQuestions.map((question, index) => ({
    mockExamId,
    questionId: question.id,
    position: index + 1,
  })));
  console.info("[Analytics] practice_mock_started", {
    userId,
    mockExamId,
    examId: input.examId,
    subjectIds: uniqueSubjectIds,
    questionCount: selectedQuestions.length,
    durationSeconds: input.durationMinutes * 60,
  });
  return getPracticeMockSession(userId, mockExamId);
}

export async function getActivePracticeMock(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const rows = await db
    .select({ id: mockExams.id })
    .from(mockExams)
    .where(and(eq(mockExams.userId, userId), eq(mockExams.status, "in_progress")))
    .orderBy(desc(mockExams.startedAt))
    .limit(1);
  const activeMockId = rows[0]?.id;
  if (!activeMockId) return null;
  const header = await getResolvedMockHeader(userId, activeMockId);
  if (!header || !shouldResumePracticeMock(header.status, header.startedAt, header.durationSeconds)) return null;
  return getPracticeMockSession(userId, activeMockId);
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
  const currentQuestionPosition = getRestoredQuestionPosition(header.currentQuestionPosition, sessionRows.length);
  return {
    id: header.id,
    examId: header.examId,
    subjectIds: header.subjectIds,
    startedAt: header.startedAt,
    submittedAt: header.submittedAt,
    durationSeconds: header.durationSeconds,
    currentQuestionPosition,
    status: lifecycle.status,
    remainingSeconds: lifecycle.remainingSeconds,
    questions: sessionRows,
    progress: getMockProgress(sessionRows),
  };
}

async function finalizePracticeMock(userId: number, mockExamId: number, requestedStatus: "submitted" | "expired") {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  const db = await getDb();
  if (!db) throw new Error("Practice Mock is currently unavailable.");
  const status = header.status === "in_progress" ? requestedStatus : header.status;
  const submittedAt = header.submittedAt ?? new Date();
  const rows = await db
    .select({ id: mockExamQuestions.id, selectedAnswer: mockExamQuestions.selectedAnswer, correctAnswer: questions.correctAnswer })
    .from(mockExamQuestions)
    .innerJoin(questions, eq(mockExamQuestions.questionId, questions.id))
    .where(eq(mockExamQuestions.mockExamId, mockExamId));
  const scoreSummary = getMockScore(rows);
  if (header.score === null) {
    await Promise.all(rows.map(row => db
      .update(mockExamQuestions)
      .set({ isCorrect: row.selectedAnswer === row.correctAnswer })
      .where(eq(mockExamQuestions.id, row.id))));
    const updateResult = await db
      .update(mockExams)
      .set({ status, submittedAt, score: scoreSummary.score })
      .where(and(eq(mockExams.id, mockExamId), eq(mockExams.userId, userId), isNull(mockExams.score)));
    if (Number(updateResult[0]?.affectedRows ?? 0) > 0) {
      console.info("[Analytics] practice_mock_completed", {
        userId,
        mockExamId,
        status,
        score: scoreSummary.score,
        correct: scoreSummary.correct,
        total: scoreSummary.total,
      });
    }
  }
  return { status, submittedAt, ...scoreSummary };
}

export async function getMockHistory(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Practice Mock history is currently unavailable.");
  const possibleExpiredRows = await db
    .select({ id: mockExams.id, status: mockExams.status, startedAt: mockExams.startedAt, durationSeconds: mockExams.durationSeconds, score: mockExams.score })
    .from(mockExams)
    .where(and(eq(mockExams.userId, userId), inArray(mockExams.status, ["in_progress", "expired"])))
    .orderBy(desc(mockExams.startedAt));
  const finalizationIds = getHistoryFinalizationIds(possibleExpiredRows);
  for (const mockExamId of finalizationIds) {
    await expirePracticeMock(userId, mockExamId);
  }
  const rows = await db
    .select({
      id: mockExams.id,
      examId: mockExams.examId,
      examName: exams.name,
      subjectIds: mockExams.subjectIds,
      startedAt: mockExams.startedAt,
      submittedAt: mockExams.submittedAt,
      score: mockExams.score,
      status: mockExams.status,
      questionCount: sql<number>`COUNT(${mockExamQuestions.id})`,
    })
    .from(mockExams)
    .innerJoin(exams, eq(mockExams.examId, exams.id))
    .leftJoin(mockExamQuestions, eq(mockExamQuestions.mockExamId, mockExams.id))
    .where(and(eq(mockExams.userId, userId), inArray(mockExams.status, ["submitted", "expired"])))
    .groupBy(
      mockExams.id,
      mockExams.examId,
      exams.name,
      mockExams.subjectIds,
      mockExams.startedAt,
      mockExams.submittedAt,
      mockExams.score,
      mockExams.status,
    )
    .orderBy(desc(mockExams.submittedAt), desc(mockExams.startedAt));
  return buildMockHistory(rows);
}

export async function getPracticeMockResults(userId: number, mockExamId: number) {
  let header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  if (header.status === "in_progress") throw new Error("Finish this Practice Mock before viewing its results.");
  if (header.score === null) {
    await finalizePracticeMock(userId, mockExamId, header.status === "expired" ? "expired" : "submitted");
    header = await getOwnedMockHeader(userId, mockExamId);
    if (!header) throw new Error("That Practice Mock was not found.");
  }
  const db = await getDb();
  if (!db) throw new Error("Practice Mock results are currently unavailable.");
  const rows = await db
    .select({
      position: mockExamQuestions.position,
      selectedAnswer: mockExamQuestions.selectedAnswer,
      isCorrect: mockExamQuestions.isCorrect,
      flagged: mockExamQuestions.flagged,
      questionId: questions.id,
      questionText: questions.questionText,
      options: questions.options,
      correctAnswer: questions.correctAnswer,
      explanation: questions.explanation,
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
  const review = rows.map(row => ({ ...row, options: row.options as QuestionOption[], isCorrect: Boolean(row.isCorrect) }));
  const scoreSummary = getMockScore(review);
  const previousRows = await db
    .select({ id: mockExams.id, score: mockExams.score, submittedAt: mockExams.submittedAt })
    .from(mockExams)
    .where(and(eq(mockExams.userId, userId), eq(mockExams.examId, header.examId), inArray(mockExams.status, ["submitted", "expired"])))
    .orderBy(desc(mockExams.submittedAt))
    .limit(20);
  const previous = previousRows.find(row => row.id !== mockExamId && row.score !== null) ?? null;
  const submittedAt = header.submittedAt ?? new Date();
  return {
    id: header.id,
    status: header.status,
    score: header.score ?? scoreSummary.score,
    correct: scoreSummary.correct,
    total: scoreSummary.total,
    submittedAt,
    topicBreakdown: getMockTopicBreakdown(review),
    pace: getMockPace({ startedAt: header.startedAt, submittedAt, durationSeconds: header.durationSeconds, questionCount: review.length }),
    previousMock: previous ? { id: previous.id, score: previous.score!, submittedAt: previous.submittedAt } : null,
    review,
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

export async function setPracticeMockPosition(userId: number, input: { mockExamId: number; position: number }) {
  await requireEditableMock(userId, input.mockExamId);
  const db = await getDb();
  if (!db) throw new Error("Your Practice Mock position could not be saved at this time.");
  const rows = await db
    .select({ position: mockExamQuestions.position })
    .from(mockExamQuestions)
    .where(and(eq(mockExamQuestions.mockExamId, input.mockExamId), eq(mockExamQuestions.position, input.position)))
    .limit(1);
  if (!rows[0]) throw new Error("That question position is not part of this Practice Mock.");
  await db
    .update(mockExams)
    .set({ currentQuestionPosition: input.position })
    .where(and(eq(mockExams.id, input.mockExamId), eq(mockExams.userId, userId)));
  return { saved: true, position: input.position };
}

export async function submitPracticeMock(userId: number, mockExamId: number) {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  return finalizePracticeMock(userId, mockExamId, header.status === "expired" ? "expired" : "submitted");
}

export async function expirePracticeMock(userId: number, mockExamId: number) {
  const header = await getResolvedMockHeader(userId, mockExamId);
  if (!header) throw new Error("That Practice Mock was not found.");
  if (header.status === "in_progress") return { status: "in_progress" as const };
  return finalizePracticeMock(userId, mockExamId, "expired");
}
