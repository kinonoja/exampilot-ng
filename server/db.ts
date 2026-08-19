import {
  and,
  asc,
  eq,
  gte,
  lt,
  notInArray,
  sql,
  type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  attempts,
  exams,
  type InsertUser,
  type QuestionOption,
  questions,
  subjects,
  topics,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the database client so local tooling remains usable without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    values[field] = value ?? null;
    updateSet[field] = value ?? null;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getStudentProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("The student profile is currently unavailable.");
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      examTarget: users.examTarget,
      examYear: users.examYear,
      subscriptionStatus: users.subscriptionStatus,
      subscriptionExpiresAt: users.subscriptionExpiresAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0];
}

export async function updateStudentProfile(
  userId: number,
  profile: { examTarget: "JAMB" | "WAEC" | "NECO" | "NABTEB"; examYear: number },
) {
  const db = await getDb();
  if (!db) throw new Error("The student profile is currently unavailable.");
  await db.update(users).set(profile).where(eq(users.id, userId));
  return getStudentProfile(userId);
}

export type PracticeFilters = {
  examId: number;
  subjectId?: number;
  topicId?: number;
  difficulty?: "easy" | "medium" | "hard";
  excludeQuestionIds?: number[];
};

export async function getPracticeFilters() {
  const db = await getDb();
  if (!db) throw new Error("The practice catalogue is currently unavailable.");
  const examRows = await db.select().from(exams).orderBy(asc(exams.name));
  const subjectRows = await db.select().from(subjects).orderBy(asc(subjects.name));
  const topicRows = await db.select().from(topics).orderBy(asc(topics.name));
  return { exams: examRows, subjects: subjectRows, topics: topicRows };
}

export async function getRandomPracticeQuestion(filters: PracticeFilters) {
  const db = await getDb();
  if (!db) throw new Error("The practice catalogue is currently unavailable.");

  const conditions: SQL[] = [eq(questions.examId, filters.examId)];
  if (filters.subjectId) conditions.push(eq(questions.subjectId, filters.subjectId));
  if (filters.topicId) conditions.push(eq(questions.topicId, filters.topicId));
  if (filters.difficulty) conditions.push(eq(questions.difficulty, filters.difficulty));
  if (filters.excludeQuestionIds?.length) {
    conditions.push(notInArray(questions.id, filters.excludeQuestionIds));
  }

  const rows = await db
    .select({
      id: questions.id,
      questionText: questions.questionText,
      options: questions.options,
      difficulty: questions.difficulty,
      subjectId: subjects.id,
      subjectName: subjects.name,
      topicId: topics.id,
      topicName: topics.name,
    })
    .from(questions)
    .innerJoin(subjects, eq(questions.subjectId, subjects.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(and(...conditions))
    .orderBy(sql`RAND()`)
    .limit(1);

  const question = rows[0];
  if (!question) return null;
  return { ...question, options: question.options as QuestionOption[] };
}

export async function getDailyAttemptCount(userId: number, now = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("Practice usage is currently unavailable.");
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const nextDay = new Date(dayStart);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), gte(attempts.createdAt, dayStart), lt(attempts.createdAt, nextDay)));
  return Number(result[0]?.count ?? 0);
}

export async function submitPracticeAttempt(
  userId: number,
  questionId: number,
  selectedAnswer: string,
  timeSpentSeconds: number,
) {
  const db = await getDb();
  if (!db) throw new Error("The answer could not be recorded at this time.");
  const questionRows = await db
    .select({
      id: questions.id,
      correctAnswer: questions.correctAnswer,
      explanation: questions.explanation,
      options: questions.options,
    })
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);
  const question = questionRows[0];
  if (!question) throw new Error("That practice question is no longer available.");

  const validAnswer = (question.options as QuestionOption[]).some(option => option.key === selectedAnswer);
  if (!validAnswer) throw new Error("Choose one of the available answer options.");

  const isCorrect = question.correctAnswer === selectedAnswer;
  await db.insert(attempts).values({
    userId,
    questionId,
    selectedAnswer,
    isCorrect,
    timeSpentSeconds: Math.max(0, Math.min(timeSpentSeconds, 7200)),
  });

  return { isCorrect, correctAnswer: question.correctAnswer, explanation: question.explanation };
}
