import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const batchPaths = [
  "/home/ubuntu/upload/pasted_content_11.txt",
  "/home/ubuntu/upload/pasted_content_12.txt",
  "/home/ubuntu/upload/pasted_content_13.txt",
  "/home/ubuntu/upload/pasted_content_14.txt",
];
const source = "ExamPilot Approved Claude Physics Batch v1";
const jambDescription = "University Tertiary Matriculation Examination practice catalogue.";
const expectedAnswerCounts = { A: 12, B: 12, C: 12, D: 12 };
const expectedDifficultyCounts = { easy: 14, medium: 26, hard: 8 };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(items, property) {
  return items.reduce((counts, item) => {
    const key = item[property];
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

const batches = await Promise.all(batchPaths.map(async path => JSON.parse(await fs.readFile(path, "utf8"))));
const batch = batches.flat();
// User-confirmed correction: the Batch 1 electrostatics result is 0.6 N, option B.
batch[9] = { ...batch[9], correctAnswer: "B" };

assert(batch.length === 48, "The approved Physics import must contain exactly 48 records.");
const answerCounts = countBy(batch, "correctAnswer");
const difficultyCounts = countBy(batch, "difficulty");
assert(
  Object.entries(expectedAnswerCounts).every(([letter, count]) => answerCounts[letter] === count),
  "The approved Physics import must retain exactly 12 A, B, C, and D answer keys.",
);
assert(
  Object.entries(expectedDifficultyCounts).every(([difficulty, count]) => difficultyCounts[difficulty] === count),
  "The approved Physics import must retain the accepted 14/26/8 difficulty mix.",
);
assert(new Set(batch.map(question => question.questionText)).size === 48, "The approved Physics import contains duplicate question text.");
assert(batch.every(question => question.subject === "Physics" && question.isAIGenerated === true), "Every imported record must be Physics content with isAIGenerated=true.");
assert(batch.every(question => ["easy", "medium", "hard"].includes(question.difficulty)), "Every imported record must have a supported difficulty.");
assert(batch.every(question => Array.isArray(question.options) && question.options.length === 4 && question.options.map(option => option.key).join(",") === "A,B,C,D"), "Every imported record must have A–D options in order.");
assert(batch.every(question => new Set(question.options.map(option => option.text.trim().toLowerCase())).size === 4), "Every imported record must have four distinct option texts.");
assert(batch.every(question => question.options.some(option => option.key === question.correctAnswer)), "Every imported record must have a correct answer contained in its options.");

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await connection.beginTransaction();

  await connection.execute(
    "INSERT INTO exams (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)",
    ["JAMB", jambDescription],
  );
  const [examRows] = await connection.execute("SELECT id FROM exams WHERE name = ? LIMIT 1", ["JAMB"]);
  const examId = examRows[0]?.id;
  assert(examId, "The JAMB exam record could not be resolved.");

  await connection.execute(
    "INSERT INTO subjects (examId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
    [examId, "Physics"],
  );
  const [subjectRows] = await connection.execute("SELECT id FROM subjects WHERE examId = ? AND name = ? LIMIT 1", [examId, "Physics"]);
  const subjectId = subjectRows[0]?.id;
  assert(subjectId, "The Physics subject record could not be resolved.");

  const [physicsRows] = await connection.execute("SELECT COUNT(*) AS count FROM questions WHERE subjectId = ?", [subjectId]);
  const physicsCountBefore = Number(physicsRows[0]?.count ?? 0);
  assert(physicsCountBefore === 0, `Physics already contains ${physicsCountBefore} question(s); the importer will not mix or duplicate banks.`);

  const topicNames = [...new Set(batch.map(question => question.topic))];
  for (const topicName of topicNames) {
    await connection.execute(
      "INSERT INTO topics (subjectId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
      [subjectId, topicName],
    );
  }

  const placeholders = topicNames.map(() => "?").join(",");
  const [topicRows] = await connection.execute(
    `SELECT id, name FROM topics WHERE subjectId = ? AND name IN (${placeholders})`,
    [subjectId, ...topicNames],
  );
  const topicIdByName = new Map(topicRows.map(topic => [topic.name, topic.id]));
  assert(topicIdByName.size === topicNames.length, "One or more Physics topics could not be resolved.");

  const questionPlaceholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");
  const questionValues = batch.flatMap(question => [
    examId,
    subjectId,
    topicIdByName.get(question.topic),
    null,
    question.difficulty,
    question.questionText,
    JSON.stringify(question.options),
    question.correctAnswer,
    question.explanation,
    source,
    JSON.stringify(["JAMB", "Physics", question.topic, "user-authorized", "claude-authored", "approved-batch-v1"]),
    true,
  ]);
  const [insertResult] = await connection.execute(
    `INSERT INTO questions (examId, subjectId, topicId, year, difficulty, questionText, options, correctAnswer, explanation, source, tags, isAIGenerated) VALUES ${questionPlaceholders}`,
    questionValues,
  );
  assert(Number(insertResult.affectedRows) === 48, `Expected to insert 48 Physics questions but inserted ${insertResult.affectedRows}.`);

  const [verificationRows] = await connection.execute(
    "SELECT COUNT(*) AS count, SUM(isAIGenerated = 1) AS aiCount FROM questions WHERE subjectId = ? AND source = ?",
    [subjectId, source],
  );
  const persistedCount = Number(verificationRows[0]?.count ?? 0);
  const persistedAiCount = Number(verificationRows[0]?.aiCount ?? 0);
  assert(persistedCount === 48 && persistedAiCount === 48, "Post-insert provenance verification failed; rolling back Physics import.");

  await connection.commit();
  console.log(JSON.stringify({
    persisted: true,
    examId,
    subjectId,
    topicCount: topicNames.length,
    questionCount: persistedCount,
    aiQuestionCount: persistedAiCount,
    answerCounts,
    difficultyCounts,
    source,
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
