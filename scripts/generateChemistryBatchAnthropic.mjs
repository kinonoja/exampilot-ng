import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { validateSubjectBatch } from "./scienceQuestionValidation.mjs";

// Chemistry batch drafting through the direct Anthropic Messages API
// (the same transport as server/anthropic.ts). This replaces the Forge-backed
// transport in generateScienceBatch.mjs while preserving the approved slot
// plan, prompt, and structural contract. The run is review-only: it performs
// no database writes. It reads the live JAMB bank once to record stem-overlap
// evidence in the artifact.

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../exampilot-research/chemistry-anthropic-draft.json");
const model = process.env.ANTHROPIC_BATCH_MODEL ?? "claude-sonnet-4-6";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const RETRY_MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 500;
const RETRY_MAX_DELAY_MS = 30_000;

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

// Equal-jitter exponential backoff, mirroring server/anthropic.ts.
const computeBackoffDelay = (attempt, retryAfterMs) => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};

const parseRetryAfter = (value) => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
};

async function invokeAnthropicStructured({ system, messages, maxTokens, schema }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  let lastError;
  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system,
          messages,
          output_config: { format: schema },
        }),
      });
      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      if (!response.ok && retryable && attempt < RETRY_MAX_RETRIES) {
        await sleep(computeBackoffDelay(attempt, parseRetryAfter(response.headers.get("retry-after"))));
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
      }
      const body = await response.json();
      const text = (Array.isArray(body.content) ? body.content : [])
        .filter((part) => part && part.type === "text" && typeof part.text === "string")
        .map((part) => part.text)
        .join("\n")
        .trim();
      return {
        text,
        inputTokens: body.usage?.input_tokens ?? 0,
        outputTokens: body.usage?.output_tokens ?? 0,
      };
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      await sleep(computeBackoffDelay(attempt));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Anthropic request failed after exhausting retries");
}

// The approved Chemistry slot allocation from the quality contract. Exactly
// 48 questions, 14 easy / 25 medium / 9 hard, with A–D answer letters assigned
// 12 times each in order.
const topicSlots = [
  ["Separation and purification", ["easy", "medium", "medium"]],
  ["Chemical combination and mole concept", ["easy", "medium", "medium", "hard"]],
  ["Kinetic theory and gas laws", ["easy", "medium", "hard"]],
  ["Atomic structure, periodicity, bonding, and nuclear chemistry", ["easy", "easy", "medium", "medium", "hard"]],
  ["Air, water, solubility, and pollution", ["easy", "easy", "medium", "medium"]],
  ["Acids, bases, salts, and titration", ["easy", "medium", "medium", "hard"]],
  ["Redox, electrolysis, electrochemical cells, and corrosion", ["easy", "medium", "medium", "hard"]],
  ["Energetics, rate, and equilibrium", ["easy", "medium", "medium", "hard"]],
  ["Non-metals and their compounds", ["easy", "medium", "medium", "medium"]],
  ["Metals and their compounds", ["easy", "medium", "medium", "hard"]],
  ["Organic chemistry", ["easy", "medium", "medium", "medium", "hard"]],
  ["Chemistry and industry", ["easy", "medium", "medium", "hard"]],
];

const answerLetters = Array.from({ length: 12 }, () => ["A", "B", "C", "D"]).flat();

function buildSlots() {
  const slots = topicSlots.flatMap(([topic, difficulties]) =>
    difficulties.map((difficulty) => ({ subject: "Chemistry", topic, difficulty })),
  );
  return slots.map((slot, index) => ({ ...slot, desiredCorrectAnswer: answerLetters[index] }));
}

// Structured-output schema. Array-length constraints (minItems/maxItems) are
// not part of Anthropic's supported schema subset; the app-side
// validateSubjectBatch enforces the exact option and batch counts.
const itemSchema = {
  type: "object",
  properties: {
    subject: { type: "string" },
    topic: { type: "string" },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    questionText: { type: "string" },
    options: {
      type: "array",
      items: {
        type: "object",
        properties: { key: { type: "string", enum: ["A", "B", "C", "D"] }, text: { type: "string" } },
        required: ["key", "text"],
        additionalProperties: false,
      },
    },
    correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] },
    explanation: { type: "string" },
    calculationCheck: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["numeric", "conceptual"] },
        method: { type: "string" },
        result: { type: "string" },
      },
      required: ["kind", "method", "result"],
      additionalProperties: false,
    },
  },
  required: ["subject", "topic", "difficulty", "questionText", "options", "correctAnswer", "explanation", "calculationCheck"],
  additionalProperties: false,
};

const SYSTEM_PROMPT =
  "You write rigorous, original Nigerian university-entrance science practice questions. Never reproduce or closely paraphrase any past-paper prompt. Every item must be self-contained, have one unambiguous answer, use clear units and assumptions, and provide a pedagogically complete explanation. Output only the requested JSON.";

function chunkPrompt(chunk) {
  return `Create exactly ${chunk.length} original Chemistry multiple-choice practice questions for the following preassigned slots. Preserve every slot's subject, topic, difficulty, and desiredCorrectAnswer exactly. Return the questions in the same order as the slots. Options must be ordered A through D and must contain plausible, distinct distractors. An explanation must state the valid principle or calculation and why the keyed option is correct. calculationCheck is internal quality evidence: use kind numeric where calculation is required and show independent method/result; otherwise use conceptual and state the decision rule. Do not mention real past papers, other exam bodies, or source websites.

SLOTS:
${JSON.stringify(chunk)}`;
}

// Token-level stem-overlap evidence against the live JAMB bank, matching the
// threshold the review scripts use (Jaccard >= 0.45).
function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (character) => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(character)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (character) => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(character)])
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenSet(text) {
  return new Set(normalize(text).split(" ").filter((token) => token.length >= 4));
}

function jaccard(first, second) {
  const intersection = [...first].filter((token) => second.has(token)).length;
  const union = new Set([...first, ...second]).size;
  return union ? intersection / union : 0;
}

async function collectBankOverlaps(questions) {
  if (!process.env.DATABASE_URL) return { skipped: "DATABASE_URL is not configured." };
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    const [bankRows] = await connection.execute(
      "SELECT q.id, q.questionText FROM questions q INNER JOIN exams e ON e.id = q.examId WHERE e.name = ? ORDER BY q.id LIMIT 250",
      ["JAMB"],
    );
    const bankSets = bankRows.map((row) => ({ id: row.id, tokens: tokenSet(row.questionText) }));
    const matches = [];
    questions.forEach((question, index) => {
      const current = tokenSet(question.questionText);
      for (const bank of bankSets) {
        const similarity = jaccard(current, bank.tokens);
        if (similarity >= 0.45) matches.push({ draftQuestion: index + 1, bankQuestionId: bank.id, similarity });
      }
    });
    return { threshold: 0.45, comparedBankCount: bankSets.length, matches };
  } finally {
    await connection.end();
  }
}

async function main() {
  const slots = buildSlots();
  const chunks = Array.from({ length: Math.ceil(slots.length / 12) }, (_, index) => slots.slice(index * 12, index * 12 + 12));
  const generated = [];
  const usage = [];
  for (const [index, chunk] of chunks.entries()) {
    console.log(`Generating Chemistry chunk ${index + 1}/${chunks.length} via direct Anthropic (${model})...`);
    const response = await invokeAnthropicStructured({
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: chunkPrompt(chunk) }],
      maxTokens: 9000,
      schema: {
        type: "object",
        properties: { questions: { type: "array", items: itemSchema } },
        required: ["questions"],
        additionalProperties: false,
      },
    });
    usage.push({ chunk: index + 1, inputTokens: response.inputTokens, outputTokens: response.outputTokens });
    const parsed = JSON.parse(response.text || "{}");
    if (!Array.isArray(parsed.questions)) throw new Error(`Chunk ${index + 1} did not return a questions array.`);
    generated.push(...parsed.questions);
  }

  const validation = validateSubjectBatch("Chemistry", generated);
  if (!validation.valid) {
    throw new Error(`Generated batch failed the structural contract:\n${validation.errors.join("\n")}`);
  }

  const overlaps = await collectBankOverlaps(generated);

  const artifact = {
    generatedAt: new Date().toISOString(),
    transport: "direct-anthropic-messages-api",
    model,
    provenance: "Pipeline-drafted original content; review-only authorization; not persisted.",
    usage,
    validation: { valid: validation.valid, metrics: validation.metrics },
    bankOverlap: overlaps,
    batch: generated,
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(artifact, null, 2), "utf8");
  console.log(JSON.stringify({ outputPath, validation: validation.metrics, overlapMatches: overlaps.matches?.length ?? null, usage }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
