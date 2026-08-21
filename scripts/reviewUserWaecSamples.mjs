import { readFile, writeFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const inputPath = process.env.INPUT_PATH;
const reportPath = process.env.REPORT_PATH;
const heldPaths = (process.env.HELD_PATHS ?? "").split(":").filter(Boolean);
const letters = ["A", "B", "C", "D"];

if (!inputPath || !reportPath) {
  throw new Error("INPUT_PATH and REPORT_PATH are required for WAEC sample review.");
}

const approvedTopics = {
  Mathematics: new Set([
    "Financial Mathematics",
    "Algebra and Equations",
    "Geometry and Mensuration",
    "Statistics",
    "Bearings, Distance and Rates",
  ]),
  Chemistry: new Set([
    "Atomic Structure and Periodicity",
    "Quantitative Chemistry and Acid-Base Reactions",
    "Kinetic Theory and Gases",
    "Organic Chemistry and Isomerism",
    "Electrolysis, Energy and Industry",
  ]),
  Physics: new Set([
    "Measurement and Dimensional Analysis",
    "Mechanics and Motion",
    "Elasticity and Material Behaviour",
    "Thermal, Kinetic Theory and Waves",
    "Space, Electronics and Practical Reasoning",
  ]),
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseSampleFile(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const lastArrayEnd = raw.lastIndexOf("]");
    if (lastArrayEnd < 0) throw new Error("The sample file does not contain a JSON array.");
    return JSON.parse(raw.slice(0, lastArrayEnd + 1));
  }
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, character => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(character)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, character => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(character)])
    .replace(/[₋⁻−-]/g, " minus ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenSet(text) {
  return new Set(normalize(text).split(" ").filter(token => token.length >= 4));
}

function jaccard(first, second) {
  const intersection = [...first].filter(token => second.has(token)).length;
  const union = new Set([...first, ...second]).size;
  return union ? intersection / union : 0;
}

const batch = parseSampleFile(await readFile(inputPath, "utf8"));
assert(Array.isArray(batch) && batch.length === 5, "A WAEC review sample must contain exactly five records.");
const subject = batch[0]?.subject;
assert(approvedTopics[subject], `Unsupported WAEC sample subject: ${subject}.`);

const structuralErrors = [];
const records = batch.map((question, index) => {
  const errors = [];
  const optionKeys = question.options?.map(option => option.key) ?? [];
  const optionTexts = question.options?.map(option => normalize(option.text)) ?? [];
  if (question.subject !== subject) errors.push("All records must use one subject.");
  if (question.examBoard !== "WAEC") errors.push("examBoard must be WAEC.");
  if (!approvedTopics[subject].has(question.topic)) errors.push("Topic is not mapped to the approved WAEC review plan.");
  if (!["easy", "medium", "hard"].includes(question.difficulty)) errors.push("Difficulty is invalid.");
  if (optionKeys.join(",") !== letters.join(",")) errors.push("Options are not exactly A–D in order.");
  if (new Set(optionTexts).size !== 4) errors.push("Options are duplicated or incomplete.");
  if (!optionKeys.includes(question.correctAnswer)) errors.push("Answer key does not point to an option.");
  if (typeof question.explanation !== "string" || question.explanation.trim().split(/\s+/).length < 10) errors.push("Explanation is too short.");
  if (question.isAIGenerated !== true) errors.push("AI provenance flag is absent.");
  structuralErrors.push(...errors.map(error => `Question ${index + 1}: ${error}`));
  return {
    index: index + 1,
    topic: question.topic,
    answer: question.correctAnswer,
    difficulty: question.difficulty,
    structuralPass: errors.length === 0,
    errors,
  };
});

const db = await mysql.createConnection(process.env.DATABASE_URL);
const [liveRows] = await db.execute(
  "SELECT q.id, q.questionText, e.name AS examBoard, s.name AS subject FROM questions q INNER JOIN exams e ON e.id = q.examId INNER JOIN subjects s ON s.id = q.subjectId ORDER BY q.id LIMIT 300",
);
await db.end();

const heldBatches = await Promise.all(heldPaths.map(async path => ({ path, records: parseSampleFile(await readFile(path, "utf8")) })));
const comparators = [
  ...liveRows.map(row => ({ source: "live question bank", questionId: row.id, subject: row.subject, questionText: row.questionText })),
  ...heldBatches.flatMap(({ path, records }) => records.map((question, index) => ({ source: path, questionId: index + 1, subject: question.subject, questionText: question.questionText }))),
];
const overlaps = batch.flatMap((question, index) => {
  const questionTokens = tokenSet(question.questionText);
  return comparators
    .map(row => ({ source: row.source, questionId: row.questionId, subject: row.subject, similarity: jaccard(questionTokens, tokenSet(row.questionText)) }))
    .filter(candidate => candidate.similarity >= 0.45)
    .map(candidate => ({ submittedQuestion: index + 1, ...candidate }));
});

const countBy = property => Object.fromEntries(
  [...new Set(batch.map(question => question[property]))].sort().map(value => [value, batch.filter(question => question[property] === value).length]),
);
const report = {
  reviewedAt: new Date().toISOString(),
  provenance: "User-authorized Claude-authored original WAEC-style practice sample; review-only authorization.",
  subject,
  recordCount: batch.length,
  structuralPass: structuralErrors.length === 0,
  structuralErrors,
  records,
  distributions: { answers: countBy("correctAnswer"), difficulties: countBy("difficulty"), topics: countBy("topic") },
  overlapAssessment: {
    threshold: 0.45,
    comparedHeldSampleCount: heldBatches.length,
    matches: overlaps,
    conclusion: overlaps.length ? "Potential semantic overlap requires manual review." : "No high-similarity stem overlap was found against the live bank or held WAEC samples.",
  },
  persistence: "No database write was attempted.",
};

await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ reportPath, subject, structuralPass: report.structuralPass, answerDistribution: report.distributions.answers, overlapMatches: overlaps.length }, null, 2));
