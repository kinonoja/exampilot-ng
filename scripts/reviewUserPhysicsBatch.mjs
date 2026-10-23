import { readFile, writeFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const inputPath = process.env.INPUT_PATH ?? "/home/ubuntu/upload/pasted_content_11.txt";
const reportPath = process.env.REPORT_PATH ?? "/home/ubuntu/exampilot-research/user-physics-batch-01-review.json";
const correctedAnswerIndex = Number(process.env.CORRECTED_ANSWER_INDEX ?? 9);
const correctedAnswer = process.env.CORRECTED_ANSWER ?? "B";
const heldPaths = (process.env.HELD_PATHS ?? "").split(":").filter(Boolean);
const heldCorrections = JSON.parse(process.env.HELD_CORRECTIONS ?? "{}");
const letters = ["A", "B", "C", "D"];
const allowedTopics = {
  "Measurements and Significant Figures": "Measurements, units, dimensions, and errors",
  "Measurements and Errors": "Measurements, units, dimensions, and errors",
  "Density and Relative Density": "Pressure and liquids at rest",
  "Vectors and Scalars": "Scalars and vectors",
  Kinematics: "Motion, Newton’s laws, projectiles, circular motion, and SHM",
  "Momentum and Collisions": "Motion, Newton’s laws, projectiles, circular motion, and SHM",
  "Circular Motion": "Motion, Newton’s laws, projectiles, circular motion, and SHM",
  "Simple Harmonic Motion": "Motion, Newton’s laws, projectiles, circular motion, and SHM",
  "Projectile Motion": "Motion, Newton’s laws, projectiles, circular motion, and SHM",
  Gravitation: "Gravitation and equilibrium",
  "Equilibrium of Forces": "Gravitation and equilibrium",
  "Centre of Gravity and Stability": "Gravitation and equilibrium",
  "Pressure in Liquids": "Pressure and liquids at rest",
  "Work, Energy and Power": "Work, energy, power, friction, machines, and elasticity",
  "Electrical Energy and Power": "Work, energy, power, friction, machines, and elasticity",
  Elasticity: "Work, energy, power, friction, machines, and elasticity",
  "Simple Machines": "Work, energy, power, friction, machines, and elasticity",
  "Thermal Physics": "Thermal physics",
  "Heat Capacity and Latent Heat": "Thermal physics",
  Waves: "Waves and sound",
  "Wave Motion": "Waves and sound",
  "Waves and Sound": "Waves and sound",
  "Sound Waves": "Waves and sound",
  "Refraction and Optics": "Light and optics",
  "Reflection of Light": "Light and optics",
  "Lenses and Optical Instruments": "Light and optics",
  "Light and Optics": "Light and optics",
  Electrostatics: "Electrostatics and current electricity",
  "Current Electricity": "Electrostatics and current electricity",
  Electromagnetism: "Magnetism, electromagnetic induction, and alternating current",
  "Electromagnetic Induction": "Magnetism, electromagnetic induction, and alternating current",
  "Magnetism and Electromagnetic Induction": "Magnetism, electromagnetic induction, and alternating current",
  "Nuclear Physics": "Atomic, nuclear, and basic electronics",
  "Semiconductors and Electronics": "Atomic, nuclear, and basic electronics",
  "Atomic Structure": "Atomic, nuclear, and basic electronics",
};

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

const submittedBatch = JSON.parse(await readFile(inputPath, "utf8"));
const correctionIsActive = correctedAnswerIndex >= 0 && correctedAnswerIndex < submittedBatch.length;
const batch = submittedBatch.map((question, index) => correctionIsActive && index === correctedAnswerIndex ? { ...question, correctAnswer: correctedAnswer } : question);
const errors = [];
const checks = batch.map((question, index) => {
  const itemErrors = [];
  const optionKeys = question.options?.map(option => option.key) ?? [];
  const optionTexts = question.options?.map(option => normalize(option.text)) ?? [];
  if (question.subject !== "Physics") itemErrors.push("Subject is not Physics.");
  if (!allowedTopics[question.topic]) itemErrors.push("Topic is not mapped to the approved Physics plan.");
  if (!["easy", "medium", "hard"].includes(question.difficulty)) itemErrors.push("Difficulty is invalid.");
  if (optionKeys.join(",") !== letters.join(",")) itemErrors.push("Options are not exactly A–D in order.");
  if (new Set(optionTexts).size !== 4) itemErrors.push("Options are duplicated or incomplete.");
  if (!optionKeys.includes(question.correctAnswer)) itemErrors.push("Answer key does not point to an option.");
  if (typeof question.explanation !== "string" || question.explanation.trim().split(/\s+/).length < 10) itemErrors.push("Explanation is too short.");
  if (question.isAIGenerated !== true) itemErrors.push("AI provenance flag is absent.");
  errors.push(...itemErrors.map(error => `Question ${index + 1}: ${error}`));
  return { index: index + 1, providedTopic: question.topic, approvedPlanArea: allowedTopics[question.topic] ?? null, answer: question.correctAnswer, difficulty: question.difficulty, structuralPass: itemErrors.length === 0, errors: itemErrors };
});

const db = await mysql.createConnection(process.env.DATABASE_URL);
const [bankRows] = await db.execute(
  "SELECT q.id, q.questionText, s.name AS subjectName FROM questions q INNER JOIN subjects s ON s.id = q.subjectId INNER JOIN exams e ON e.id = q.examId WHERE e.name = ? ORDER BY q.id LIMIT 250",
  ["JAMB"],
);
await db.end();
const heldBatches = await Promise.all(heldPaths.map(async path => {
  const corrections = heldCorrections[path] ?? {};
  const records = JSON.parse(await readFile(path, "utf8")).map((question, index) => corrections[index] ? { ...question, correctAnswer: corrections[index] } : question);
  return { path, records };
}));
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
const distribution = Object.fromEntries(letters.map(letter => [letter, batch.filter(question => question.correctAnswer === letter).length]));
const difficulty = Object.fromEntries(["easy", "medium", "hard"].map(level => [level, batch.filter(question => question.difficulty === level).length]));
const topics = Object.fromEntries(Object.keys(allowedTopics).map(topic => [topic, batch.filter(question => question.topic === topic).length]).filter(([, count]) => count));
const combinedQuestions = [...heldBatches.flatMap(batchInfo => batchInfo.records), ...batch];
const combinedAnswers = Object.fromEntries(letters.map(letter => [letter, combinedQuestions.filter(question => question.correctAnswer === letter).length]));
const combinedDifficulty = Object.fromEntries(["easy", "medium", "hard"].map(level => [level, combinedQuestions.filter(question => question.difficulty === level).length]));
const report = {
  reviewedAt: new Date().toISOString(),
  provenance: "User-confirmed Claude-authored original stopgap batch; review-only authorization.",
  correctionAppliedInMemory: correctionIsActive ? { submittedQuestion: correctedAnswerIndex + 1, answer: correctedAnswer, reason: "User-confirmed electrostatics arithmetic correction; submitted explanation already computed 0.6 N." } : null,
  recordCount: batch.length,
  structuralPass: errors.length === 0,
  structuralErrors: errors,
  records: checks,
  distributions: { answers: distribution, difficulty, topics, combinedAnswers, combinedDifficulty },
  coverageAssessment: "Each supplied topic maps to an approved Physics plan area; this partial batch does not yet cover every plan area.",
  overlapAssessment: { threshold: 0.45, comparedHeldBatchCount: heldBatches.length, matches: overlaps, conclusion: overlaps.length ? "Potential semantic overlap requires manual review." : "No high-similarity stem overlap was found against the current JAMB bank or held batches." },
  persistence: "No database write was attempted.",
};
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ reportPath, structuralPass: report.structuralPass, answerDistribution: distribution, overlapMatches: overlaps.length }, null, 2));
