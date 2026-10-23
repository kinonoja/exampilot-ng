import mysql from "mysql2/promise";
import { approvedJambSyllabusCatalogue } from "../server/jambSyllabusCatalogue.ts";

const dryRun = process.argv.includes("--dry-run");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is required for the approved JAMB syllabus import.");

const connection = await mysql.createConnection(databaseUrl);

try {
  const [[exam]] = await connection.execute("SELECT id FROM exams WHERE name = 'JAMB' LIMIT 1");
  if (!exam?.id) throw new Error("JAMB exam row was not found. Import cancelled without changes.");

  const topicTargetCount = approvedJambSyllabusCatalogue.reduce((count, subject) => count + subject.topics.length, 0);
  const [currentSubjects] = await connection.execute("SELECT id, name FROM subjects WHERE examId = ? ORDER BY id", [exam.id]);
  const [currentTopicCountRows] = await connection.execute("SELECT COUNT(*) AS count FROM topics t JOIN subjects s ON s.id = t.subjectId WHERE s.examId = ?", [exam.id]);
  const currentTopicCount = Number(currentTopicCountRows[0]?.count ?? 0);

  if (dryRun) {
    console.log(JSON.stringify({
      mode: "dry-run",
      jambExamId: exam.id,
      currentSubjectCount: currentSubjects.length,
      currentTopicCount,
      approvedSubjectCount: approvedJambSyllabusCatalogue.length,
      approvedTopicUpsertCount: topicTargetCount,
      canonicalUseOfEnglish: approvedJambSyllabusCatalogue.find(subject => subject.name === "Use of English")?.name,
    }, null, 2));
    process.exit(0);
  }

  await connection.beginTransaction();
  try {
    await connection.execute("UPDATE subjects SET name = 'Use of English' WHERE examId = ? AND name = 'English'", [exam.id]);

    for (const subject of approvedJambSyllabusCatalogue) {
      await connection.execute(
        "INSERT INTO subjects (examId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
        [exam.id, subject.name],
      );

      const [[subjectRow]] = await connection.execute(
        "SELECT id FROM subjects WHERE examId = ? AND name = ? LIMIT 1",
        [exam.id, subject.name],
      );
      if (!subjectRow?.id) throw new Error(`Unable to resolve approved subject ${subject.name}.`);

      for (const topic of subject.topics) {
        await connection.execute(
          "INSERT INTO topics (subjectId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
          [subjectRow.id, topic],
        );
      }
    }

    const [finalSubjects] = await connection.execute("SELECT id, name FROM subjects WHERE examId = ? ORDER BY name", [exam.id]);
    const [finalTopicRows] = await connection.execute("SELECT COUNT(*) AS count FROM topics t JOIN subjects s ON s.id = t.subjectId WHERE s.examId = ?", [exam.id]);
    const [useOfEnglishRows] = await connection.execute("SELECT id, name FROM subjects WHERE examId = ? AND name = 'Use of English'", [exam.id]);
    const [legacyEnglishRows] = await connection.execute("SELECT id FROM subjects WHERE examId = ? AND name = 'English'", [exam.id]);
    const approvedNames = new Set(approvedJambSyllabusCatalogue.map(subject => subject.name));
    const unexpectedSubjects = finalSubjects.filter(subject => !approvedNames.has(subject.name));

    if (finalSubjects.length !== approvedJambSyllabusCatalogue.length) {
      throw new Error(`Expected ${approvedJambSyllabusCatalogue.length} JAMB subjects but found ${finalSubjects.length}.`);
    }
    if (useOfEnglishRows.length !== 1 || legacyEnglishRows.length !== 0) {
      throw new Error("Use of English canonical-label verification failed.");
    }
    if (unexpectedSubjects.length) {
      throw new Error(`Unexpected JAMB subjects remain: ${unexpectedSubjects.map(subject => subject.name).join(", ")}.`);
    }

    await connection.commit();
    console.log(JSON.stringify({
      mode: "import",
      jambExamId: exam.id,
      finalSubjectCount: finalSubjects.length,
      finalTopicCount: Number(finalTopicRows[0]?.count ?? 0),
      attemptedOfficialTopicUpserts: topicTargetCount,
      useOfEnglishId: useOfEnglishRows[0].id,
    }, null, 2));
  } catch (error) {
    await connection.rollback();
    throw error;
  }
} finally {
  await connection.end();
}
