import { describe, expect, it } from "vitest";
import { SUBJECT_CONTRACTS, validateSubjectBatch } from "../scripts/scienceQuestionValidation.mjs";

function buildValidBatch(subject: "Chemistry" | "Physics") {
  const contract = SUBJECT_CONTRACTS[subject];
  const difficulties = Object.entries(contract.difficultyCounts).flatMap(([difficulty, count]) =>
    Array.from({ length: count }, () => difficulty),
  );
  const answers = Object.entries(contract.answerCounts).flatMap(([answer, count]) =>
    Array.from({ length: count }, () => answer),
  );
  let position = 0;
  return Object.entries(contract.topicCounts).flatMap(([topic, count]) =>
    Array.from({ length: count }, () => {
      const questionNumber = position + 1;
      const correctAnswer = answers[position] as "A" | "B" | "C" | "D";
      const question = {
        subject,
        topic,
        difficulty: difficulties[position++],
        questionText: `Original ${subject} validation stem ${questionNumber} with sufficient wording.`,
        options: [
          { key: "A", text: `Option alpha ${questionNumber}` },
          { key: "B", text: `Option beta ${questionNumber}` },
          { key: "C", text: `Option gamma ${questionNumber}` },
          { key: "D", text: `Option delta ${questionNumber}` },
        ],
        correctAnswer,
        explanation: `This substantive explanation for ${subject} item ${questionNumber} identifies the valid scientific principle and clearly supports the keyed option.`,
        calculationCheck: {
          kind: "conceptual",
          method: "Apply the stated scientific principle to the four alternatives and eliminate the inconsistent alternatives.",
          result: `The independently justified result is option ${correctAnswer}.`,
        },
      };
      return question;
    }),
  );
}

describe("science question batch validation", () => {
  it("accepts a complete Chemistry batch with the required coverage and answer balance", () => {
    const result = validateSubjectBatch("Chemistry", buildValidBatch("Chemistry"));
    expect(result.valid).toBe(true);
    expect(result.metrics.answerCounts).toEqual({ A: 12, B: 12, C: 12, D: 12 });
  });

  it("rejects a Physics batch when correct answers cluster on one letter", () => {
    const batch = buildValidBatch("Physics");
    batch[0].correctAnswer = "B";
    const result = validateSubjectBatch("Physics", batch);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("correct-answer letters");
  });

  it("rejects an incomplete explanation even when the shape otherwise looks valid", () => {
    const batch = buildValidBatch("Chemistry");
    batch[0].explanation = "Too short.";
    const result = validateSubjectBatch("Chemistry", batch);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("insufficient explanation");
  });
});
