import { and, eq, sql } from "drizzle-orm";
import { exams, questions, subjects, topics } from "../drizzle/schema";
import { getDb } from "./db";
import { jambSeedQuestions, seedSubjects } from "./seedData";

const JAMB_DESCRIPTION = "University Tertiary Matriculation Examination practice catalogue.";
const ORIGINAL_SOURCE = "ExamPilot Original Practice Bank v1";

/** Idempotently installs the original question bank when the catalogue is first requested. */
export async function ensurePracticeCatalogue(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("The question catalogue is currently unavailable.");

  await db
    .insert(exams)
    .values({ name: "JAMB", description: JAMB_DESCRIPTION })
    .onDuplicateKeyUpdate({ set: { description: JAMB_DESCRIPTION } });

  const [jamb] = await db.select().from(exams).where(eq(exams.name, "JAMB")).limit(1);
  if (!jamb) throw new Error("Unable to initialize the JAMB catalogue.");

  const [legacyEnglish] = await db
    .select()
    .from(subjects)
    .where(and(eq(subjects.examId, jamb.id), eq(subjects.name, "English")))
    .limit(1);
  if (legacyEnglish) {
    await db.update(subjects).set({ name: "Use of English" }).where(eq(subjects.id, legacyEnglish.id));
  }

  for (const name of seedSubjects) {
    await db
      .insert(subjects)
      .values({ examId: jamb.id, name })
      .onDuplicateKeyUpdate({ set: { name } });
  }

  const subjectRows = await db.select().from(subjects).where(eq(subjects.examId, jamb.id));
  const subjectIdByName = new Map(subjectRows.map(subject => [subject.name, subject.id]));
  const topicsToSeed = new Map<string, { subjectId: number; name: string }>();

  for (const item of jambSeedQuestions) {
    const subjectId = subjectIdByName.get(item.subject);
    if (!subjectId) throw new Error(`Missing subject during catalogue setup: ${item.subject}`);
    topicsToSeed.set(`${subjectId}:${item.topic}`, { subjectId, name: item.topic });
  }

  for (const item of Array.from(topicsToSeed.values())) {
    await db
      .insert(topics)
      .values(item)
      .onDuplicateKeyUpdate({ set: { name: item.name } });
  }

  const topicRows = await db.select().from(topics);
  const topicIdByKey = new Map(topicRows.map(topic => [`${topic.subjectId}:${topic.name}`, topic.id]));

  for (const item of jambSeedQuestions) {
    const subjectId = subjectIdByName.get(item.subject);
    if (!subjectId) continue;
    const topicId = topicIdByKey.get(`${subjectId}:${item.topic}`);
    if (!topicId) continue;

    const existing = await db
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.questionText, item.questionText), eq(questions.source, ORIGINAL_SOURCE)))
      .limit(1);

    if (existing.length > 0) continue;

    await db.insert(questions).values({
      examId: jamb.id,
      subjectId,
      topicId,
      year: null,
      difficulty: item.difficulty,
      questionText: item.questionText,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      source: ORIGINAL_SOURCE,
      tags: item.tags,
      isAIGenerated: false,
    });
  }
}

export async function getQuestionCatalogueCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(questions);
  return Number(result[0]?.count ?? 0);
}
