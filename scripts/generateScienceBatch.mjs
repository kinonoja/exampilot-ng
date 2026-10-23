import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateScienceBatch } from "./scienceQuestionValidation.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../../exampilot-research/chemistry-physics-generated.json");
const model = "claude-sonnet-4-6";

const topicSlots = {
  Chemistry: [
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
  ],
  Physics: [
    ["Measurements, units, dimensions, and errors", ["easy", "easy", "medium"]],
    ["Scalars and vectors", ["easy", "medium"]],
    ["Motion, Newton’s laws, projectiles, circular motion, and SHM", ["easy", "medium", "medium", "medium", "hard", "hard"]],
    ["Gravitation and equilibrium", ["easy", "medium", "hard"]],
    ["Work, energy, power, friction, machines, and elasticity", ["easy", "medium", "medium", "medium", "hard"]],
    ["Pressure and liquids at rest", ["easy", "medium", "medium"]],
    ["Thermal physics", ["easy", "easy", "medium", "medium", "medium", "medium", "hard"]],
    ["Waves and sound", ["easy", "medium", "medium", "medium", "medium", "hard"]],
    ["Light and optics", ["easy", "medium", "medium", "medium", "hard"]],
    ["Electrostatics and current electricity", ["easy", "medium", "hard"]],
    ["Magnetism, electromagnetic induction, and alternating current", ["easy", "medium", "medium"]],
    ["Atomic, nuclear, and basic electronics", ["easy", "medium"]],
  ],
};

const answerLetters = Array.from({ length: 12 }, () => ["A", "B", "C", "D"]).flat();

function buildSlots(subject) {
  const slots = topicSlots[subject].flatMap(([topic, difficulties]) =>
    difficulties.map(difficulty => ({ subject, topic, difficulty })),
  );
  return slots.map((slot, index) => ({ ...slot, desiredCorrectAnswer: answerLetters[index] }));
}

const itemSchema = {
  type: "object",
  properties: {
    subject: { type: "string" },
    topic: { type: "string" },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    questionText: { type: "string" },
    options: {
      type: "array",
      minItems: 4,
      maxItems: 4,
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

function parseModelJson(content) {
  const trimmed = String(content).trim();
  const unfenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(unfenced);
  return Array.isArray(parsed) ? { questions: parsed } : parsed;
}

async function invokeStructured(messages, schemaName, schema) {
  let latestError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 9000,
          response_format: { type: "json_schema", json_schema: { name: schemaName, strict: true, schema } },
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(`LLM request failed (${response.status}): ${JSON.stringify(body)}`);
      const content = body.choices?.[0]?.message?.content;
      if (!content) throw new Error("LLM returned an empty generation response.");
      return parseModelJson(content);
    } catch (error) {
      latestError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  throw latestError;
}

async function generateSubject(subject) {
  const slots = buildSlots(subject);
  const chunks = Array.from({ length: Math.ceil(slots.length / 12) }, (_, index) => slots.slice(index * 12, index * 12 + 12));
  const generated = [];
  for (const [index, chunk] of chunks.entries()) {
    console.log(`Generating ${subject} chunk ${index + 1}/${chunks.length}...`);
    const response = await invokeStructured(
      [
        {
          role: "system",
          content:
            "You write rigorous, original Nigerian university-entrance science practice questions. Never reproduce or closely paraphrase any past-paper prompt. Every item must be self-contained, have one unambiguous answer, use clear units and assumptions, and provide a pedagogically complete explanation. Output only the requested JSON.",
        },
        {
          role: "user",
          content: `Create exactly ${chunk.length} original ${subject} multiple-choice practice questions for the following preassigned slots. Preserve every slot's subject, topic, difficulty, and desiredCorrectAnswer exactly. Return the questions in the same order as the slots. Options must be ordered A through D and must contain plausible, distinct distractors. An explanation must state the valid principle or calculation and why the keyed option is correct. calculationCheck is internal quality evidence: use kind numeric where calculation is required and show independent method/result; otherwise use conceptual and state the decision rule. Do not mention real past papers, other exam bodies, or source websites.\n\nSLOTS:\n${JSON.stringify(chunk)}`,
        },
      ],
      `${subject.toLowerCase()}_question_chunk_${index + 1}`,
      {
        type: "object",
        properties: { questions: { type: "array", minItems: chunk.length, maxItems: chunk.length, items: itemSchema } },
        required: ["questions"],
        additionalProperties: false,
      },
    );
    generated.push(...response.questions);
  }
  return generated;
}

async function main() {
  if (!process.env.BUILT_IN_FORGE_API_URL || !process.env.BUILT_IN_FORGE_API_KEY) {
    throw new Error("Built-in LLM credentials are not available in this project shell.");
  }
  const batch = {
    Chemistry: await generateSubject("Chemistry"),
    Physics: await generateSubject("Physics"),
  };
  const validation = validateScienceBatch(batch);
  if (!validation.valid) throw new Error(`Generated batch failed the structural contract:\n${validation.errors.join("\n")}`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), model, batch, validation }, null, 2),
    "utf8",
  );
  console.log(JSON.stringify({ outputPath, subjects: validation.subjects }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
