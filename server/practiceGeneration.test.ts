import { describe, expect, it } from "vitest";
import { generatedQuestionInsert, parseGeneratedQuestionPayload, validateGeneratedQuestionSet } from "./practiceGeneration";

const validQuestions = [0, 1, 2].map(index => ({
  difficulty: index === 0 ? "easy" : index === 1 ? "medium" : "hard",
  questionText: `What is the correct solution for original practice example number ${index + 1}?`,
  options: ["A", "B", "C", "D"].map(key => ({ key, text: `Option ${key} for example ${index + 1}` })),
  correctAnswer: "B",
  explanation: `This explanation clearly shows why option B is correct for original practice example ${index + 1}.`,
  tags: ["algebra", "revision"],
}));

describe("AI practice generation validation", () => {
  it("accepts a complete original three-question payload", () => {
    expect(validateGeneratedQuestionSet({ questions: validQuestions }, 3)).toHaveLength(3);
  });

  it("rejects duplicate wording and malformed correct-answer labels", () => {
    const duplicate = structuredClone(validQuestions);
    duplicate[1].questionText = duplicate[0].questionText;
    expect(() => validateGeneratedQuestionSet({ questions: duplicate }, 3)).toThrow(/duplicate/i);
    const invalidAnswer = structuredClone(validQuestions);
    invalidAnswer[0].correctAnswer = "E";
    expect(() => validateGeneratedQuestionSet({ questions: invalidAnswer }, 3)).toThrow(/correct-answer/i);
  });

  it("always maps approved questions to AI-generated database rows", () => {
    const question = validateGeneratedQuestionSet({ questions: validQuestions }, 3)[0];
    const row = generatedQuestionInsert({ examId: 1, examName: "JAMB", subjectId: 2, subjectName: "Mathematics", topicId: 3, topicName: "Algebra" }, question);
    expect(row).toMatchObject({ examId: 1, subjectId: 2, topicId: 3, isAIGenerated: true, source: "ExamPilot AI Practice Generation v1", correctAnswer: "B" });
  });

  it("accepts a Claude response wrapped in an optional JSON code fence", () => {
    const payload = parseGeneratedQuestionPayload(`\`\`\`json\n${JSON.stringify({ questions: validQuestions })}\n\`\`\``);
    expect(validateGeneratedQuestionSet(payload, 3)).toHaveLength(3);
  });

  it("normalizes title-cased Claude difficulty labels", () => {
    const titleCased = structuredClone(validQuestions);
    titleCased[0].difficulty = "Easy";
    expect(validateGeneratedQuestionSet({ questions: titleCased }, 3)[0].difficulty).toBe("easy");
  });

  it("normalizes common descriptive Claude difficulty variants", () => {
    const descriptive = structuredClone(validQuestions);
    descriptive[0].difficulty = "Medium — JAMB standard";
    expect(validateGeneratedQuestionSet({ questions: descriptive }, 3)[0].difficulty).toBe("medium");
  });

  it("normalizes numeric difficulty levels from a compatible JSON response", () => {
    const numeric = structuredClone(validQuestions);
    numeric[0].difficulty = "2";
    expect(validateGeneratedQuestionSet({ questions: numeric }, 3)[0].difficulty).toBe("medium");
  });

  it("accepts a concise but complete explanation from the generated bank format", () => {
    const concise = structuredClone(validQuestions);
    concise[0].explanation = "It improves survival.";
    expect(validateGeneratedQuestionSet({ questions: concise }, 3)[0].explanation).toBe("It improves survival.");
  });
});
