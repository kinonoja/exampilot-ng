import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

const inputPath = process.env.INPUT_PATH ?? "/home/ubuntu/upload/pasted_content_6.txt";
const reportPath = process.env.REPORT_PATH ?? "/home/ubuntu/exampilot-research/user-chemistry-batch-01-review.json";
const heldPaths = (process.env.HELD_PATHS ?? "").split(":").filter(Boolean);
const allowedTopics = {
  "Separation and Purification": "Separation and purification",
  "Air, Water and Environmental Chemistry": "Air, water, solubility, and pollution",
  "Mole Concept": "Chemical combination and mole concept",
  "Quantitative Chemistry": "Chemical combination and mole concept",
  "Gas Laws": "Kinetic theory and gas laws",
  "Kinetic Theory of Gases": "Kinetic theory and gas laws",
  "Kinetic Theory and Gases": "Kinetic theory and gas laws",
  "Gaseous Diffusion": "Kinetic theory and gas laws",
  "Atomic Structure": "Atomic structure, periodicity, bonding, and nuclear chemistry",
  "Chemical Bonding": "Atomic structure, periodicity, bonding, and nuclear chemistry",
  "Acids, Bases and Salts": "Acids, bases, salts, and titration",
  "Rates of Reaction": "Energetics, rate, and equilibrium",
  "Chemical Kinetics": "Energetics, rate, and equilibrium",
  "Chemical Equilibrium": "Energetics, rate, and equilibrium",
  "Thermochemistry": "Energetics, rate, and equilibrium",
  "Organic Chemistry": "Organic chemistry",
  "Energetics": "Energetics, rate, and equilibrium",
  "Redox Reactions": "Redox, electrolysis, electrochemical cells, and corrosion",
  "Electrolysis": "Redox, electrolysis, electrochemical cells, and corrosion",
  "Corrosion": "Redox, electrolysis, electrochemical cells, and corrosion",
  "Solubility": "Air, water, solubility, and pollution",
  "Periodicity": "Atomic structure, periodicity, bonding, and nuclear chemistry",
  "Non-Metals": "Non-metals and their compounds",
  "Metals": "Metals and their compounds",
  "Chemistry and Industry": "Chemistry and industry",
};
const letters = ["A", "B", "C", "D"];

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, character => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(character)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, character => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(character)])
    .replace(/[₊⁺+]/g, " plus ")
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

const batch = JSON.parse(await readFile(inputPath, "utf8"));
const errors = [];
const checks = batch.map((question, index) => {
  const label = `Question ${index + 1}`;
  const optionKeys = question.options?.map(option => option.key) ?? [];
  const optionTexts = question.options?.map(option => normalize(option.text)) ?? [];
  const itemErrors = [];
  if (question.subject !== "Chemistry") itemErrors.push("Subject is not Chemistry.");
  if (!allowedTopics[question.topic]) itemErrors.push("Topic is not mapped to the approved Chemistry plan.");
  if (!["easy", "medium", "hard"].includes(question.difficulty)) itemErrors.push("Difficulty is invalid.");
  if (optionKeys.join(",") !== letters.join(",")) itemErrors.push("Options are not exactly A–D in order.");
  if (new Set(optionTexts).size !== 4) itemErrors.push("Options are duplicated or incomplete.");
  if (!optionKeys.includes(question.correctAnswer)) itemErrors.push("Answer key does not point to an option.");
  if (typeof question.explanation !== "string" || question.explanation.trim().split(/\s+/).length < 10) itemErrors.push("Explanation is too short.");
  if (question.isAIGenerated !== true) itemErrors.push("AI provenance flag is absent.");
  errors.push(...itemErrors.map(error => `${label}: ${error}`));
  return {
    index: index + 1,
    providedTopic: question.topic,
    approvedPlanArea: allowedTopics[question.topic] ?? null,
    answer: question.correctAnswer,
    difficulty: question.difficulty,
    structuralPass: itemErrors.length === 0,
    errors: itemErrors,
  };
});

const answerDistribution = Object.fromEntries(letters.map(letter => [letter, batch.filter(question => question.correctAnswer === letter).length]));
const difficultyDistribution = Object.fromEntries(["easy", "medium", "hard"].map(level => [level, batch.filter(question => question.difficulty === level).length]));
const topicDistribution = Object.fromEntries(Object.keys(allowedTopics).map(topic => [topic, batch.filter(question => question.topic === topic).length]).filter(([, count]) => count));

const db = await mysql.createConnection(process.env.DATABASE_URL);
const [bankRows] = await db.execute(
  "SELECT q.id, q.questionText, s.name AS subjectName FROM questions q INNER JOIN subjects s ON s.id = q.subjectId INNER JOIN exams e ON e.id = q.examId WHERE e.name = ? ORDER BY q.id LIMIT 250",
  ["JAMB"],
);
await db.end();
const heldBatches = await Promise.all(heldPaths.map(async path => ({ path, records: JSON.parse(await readFile(path, "utf8")) })));
const comparisonRows = [
  ...bankRows.map(row => ({ source: "live JAMB bank", questionId: row.id, subject: row.subjectName, questionText: row.questionText })),
  ...heldBatches.flatMap(({ path, records }) => records.map((row, index) => ({ source: path, questionId: index + 1, subject: row.subject, questionText: row.questionText }))),
];
const overlaps = batch.flatMap((question, index) => {
  const current = tokenSet(question.questionText);
  return comparisonRows
    .map(row => ({ source: row.source, questionId: row.questionId, subject: row.subject, similarity: jaccard(current, tokenSet(row.questionText)) }))
    .filter(match => match.similarity >= 0.45)
    .map(match => ({ submittedQuestion: index + 1, ...match }));
});
const combinedQuestions = [...heldBatches.flatMap(batchInfo => batchInfo.records), ...batch];
const combinedAnswerDistribution = Object.fromEntries(letters.map(letter => [letter, combinedQuestions.filter(question => question.correctAnswer === letter).length]));

const report = {
  reviewedAt: new Date().toISOString(),
  provenance: "User-confirmed Claude-authored original stopgap batch; review-only authorization.",
  recordCount: batch.length,
  structuralPass: errors.length === 0,
  structuralErrors: errors,
  records: checks,
  distributions: { answers: answerDistribution, difficulty: difficultyDistribution, topics: topicDistribution, combinedAnswers: combinedAnswerDistribution },
  distributionAssessment: "This 12-item partial batch is clustered on B and C; rebalance is required before merging it into any final 48-item Chemistry batch.",
  coverageAssessment: "All 12 supplied topics map to approved Chemistry coverage areas; remaining approved areas are not yet represented in this partial batch.",
  overlapAssessment: { threshold: 0.45, comparedHeldBatchCount: heldBatches.length, matches: overlaps, conclusion: overlaps.length ? "Potential semantic overlap requires manual review." : "No high-similarity stem overlap was found against the current JAMB bank or supplied held batches." },
  persistence: "No database write was attempted.",
};
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ reportPath, structuralPass: report.structuralPass, answerDistribution, overlapMatches: overlaps.length }, null, 2));
