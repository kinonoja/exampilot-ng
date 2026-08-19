import { describe, expect, it } from "vitest";
import { jambSeedQuestions } from "./seedData";

describe("original JAMB practice catalogue", () => {
  it("contains fifty authored questions across the three launch subjects", () => {
    expect(jambSeedQuestions).toHaveLength(50);
    expect(jambSeedQuestions.filter(question => question.subject === "Mathematics")).toHaveLength(18);
    expect(jambSeedQuestions.filter(question => question.subject === "English")).toHaveLength(16);
    expect(jambSeedQuestions.filter(question => question.subject === "Biology")).toHaveLength(16);
  });

  it("gives each question four answer choices, an answer key, and an explanation", () => {
    for (const question of jambSeedQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.some(option => option.key === question.correctAnswer)).toBe(true);
      expect(question.explanation.length).toBeGreaterThanOrEqual(30);
    }
  });
});
