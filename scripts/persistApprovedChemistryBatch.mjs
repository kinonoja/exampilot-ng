import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const batchPath = "/home/ubuntu/exampilot-research/held-user-chemistry-final-48.json";
const source = "ExamPilot Approved Claude Chemistry Batch v1";
const jambDescription = "University Tertiary Matriculation Examination practice catalogue.";
const expectedAnswerCounts = { A: 12, B: 12, C: 12, D: 12 };

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

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
assert(Array.isArray(batch) && batch.length === 48, "The approved Chemistry import must contain exactly 48 records.");

const answerCounts = countBy(batch, "correctAnswer");
assert(
  Object.entries(expectedAnswerCounts).every(([letter, count]) => answerCounts[letter] === count),
  "The approved Chemistry import must retain exactly 12 A, B, C, and D answer keys.",
);
assert(new Set(batch.map(question => question.questionText)).size === 48, "The approved Chemistry import contains duplicate question text.");
assert(batch.every(question => question.subject === "Chemistry" && question.isAIGenerated === true), "Every imported record must be Chemistry content with isAIGenerated=true.");
assert(batch.every(question => ["easy", "medium", "hard"].includes(question.difficulty)), "Every imported record must have a supported difficulty.");
assert(batch.every(question => Array.isArray(question.options) && question.options.length === 4 && new Set(question.options.map(option => option.key)).size === 4), "Every imported record must have four distinct options.");
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
    [examId, "Chemistry"],
  );
  const [subjectRows] = await connection.execute("SELECT id FROM subjects WHERE examId = ? AND name = ? LIMIT 1", [examId, "Chemistry"]);
  const subjectId = subjectRows[0]?.id;
  assert(subjectId, "The Chemistry subject record could not be resolved.");

  const [chemistryRows] = await connection.execute("SELECT COUNT(*) AS count FROM questions WHERE subjectId = ?", [subjectId]);
  const chemistryCountBefore = Number(chemistryRows[0]?.count ?? 0);
  assert(chemistryCountBefore === 0, `Chemistry already contains ${chemistryCountBefore} question(s); the importer will not mix or duplicate banks.`);

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
  assert(topicIdByName.size === topicNames.length, "One or more Chemistry topics could not be resolved.");

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
    JSON.stringify(["JAMB", "Chemistry", question.topic, "user-authorized", "claude-authored", "approved-batch-v1"]),
    true,
  ]);
  const [insertResult] = await connection.execute(
    `INSERT INTO questions (examId, subjectId, topicId, year, difficulty, questionText, options, correctAnswer, explanation, source, tags, isAIGenerated) VALUES ${questionPlaceholders}`,
    questionValues,
  );
  assert(Number(insertResult.affectedRows) === 48, `Expected to insert 48 Chemistry questions but inserted ${insertResult.affectedRows}.`);

  const [verificationRows] = await connection.execute(
    "SELECT COUNT(*) AS count, SUM(isAIGenerated = 1) AS aiCount FROM questions WHERE subjectId = ? AND source = ?",
    [subjectId, source],
  );
  const persistedCount = Number(verificationRows[0]?.count ?? 0);
  const persistedAiCount = Number(verificationRows[0]?.aiCount ?? 0);
  assert(persistedCount === 48 && persistedAiCount === 48, "Post-insert provenance verification failed; rolling back Chemistry import.");

  await connection.commit();
  console.log(JSON.stringify({
    persisted: true,
    examId,
    subjectId,
    topicCount: topicNames.length,
    questionCount: persistedCount,
    aiQuestionCount: persistedAiCount,
    answerCounts,
    source,
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
