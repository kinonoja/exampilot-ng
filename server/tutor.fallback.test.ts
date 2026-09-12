import { describe, expect, it } from "vitest";
import { getQuestionContextFallback } from "./tutor";

const questionContext = {
  questionText: "Simplify 3x + 5x - 2.",
  options: [
    { key: "A", text: "8x - 2" },
    { key: "B", text: "8x + 2" },
    { key: "C", text: "15x - 2" },
    { key: "D", text: "15x + 2" },
  ],
  correctAnswer: "A",
  explanation: "Combine like terms: 3x + 5x = 8x, so the expression is 8x - 2.",
  subject: "Mathematics",
  topic: "Algebraic Expressions",
  selectedAnswer: "B",
  attemptWasCorrect: false,
};

describe("Tutor question-context fallback", () => {
  it("gives a self-contained direct explanation when the provider is unavailable", () => {
    const response = getQuestionContextFallback("direct", questionContext);
    expect(response).toContain("The correct answer is A. 8x - 2.");
    expect(response).toContain(questionContext.explanation);
  });

  it("keeps guided help focused on the key idea and a next step", () => {
    const response = getQuestionContextFallback("guided", questionContext);
    expect(response).toContain("Let’s work from the key idea:");
    expect(response).toContain("Which option best matches it?");
  });
});
