import { writeFile } from "node:fs/promises";
import { approvedJambSyllabusCatalogue } from "../server/jambSyllabusCatalogue.ts";

const outputPath = "/home/ubuntu/exampilot-ng-v2/scripts/generated-jamb-syllabus-import.sql";
const quote = value => `'${value.replaceAll("'", "''")}'`;

const subjectValues = approvedJambSyllabusCatalogue
  .map(subject => `(1, ${quote(subject.name)})`)
  .join(",\n");

const topicStatements = approvedJambSyllabusCatalogue.flatMap(subject =>
  subject.topics.map(topic =>
    [
      "INSERT INTO topics (subjectId, name)",
      `SELECT subjects.id, ${quote(topic)}`,
      "FROM subjects",
      "WHERE subjects.examId = 1",
      `  AND subjects.name = ${quote(subject.name)}`,
      "ON DUPLICATE KEY UPDATE name = VALUES(name);",
    ].join("\n"),
  ),
);

const sql = [
  "-- Approved 22 August 2026 JAMB IBASS syllabus catalogue import.",
  "-- Syllabus structure only: no question, attempt, mock, Tutor, or payment rows are changed.",
  "START TRANSACTION;",
  "UPDATE subjects SET name = 'Use of English' WHERE examId = 1 AND name = 'English';",
  "INSERT INTO subjects (examId, name) VALUES",
  `${subjectValues}\nON DUPLICATE KEY UPDATE name = VALUES(name);`,
  ...topicStatements,
  "COMMIT;",
  "",
].join("\n\n");

await writeFile(outputPath, sql, "utf8");
console.log(`Generated ${approvedJambSyllabusCatalogue.length} subjects and ${topicStatements.length} topic upserts at ${outputPath}`);
