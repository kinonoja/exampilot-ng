import { describe, expect, it } from "vitest";
import { practiceMockStartInput } from "./mockExamRouter";

describe("Practice Mock start input", () => {
  const valid = { examId: 1, subjectIds: [1, 2, 3], questionCount: 10, durationMinutes: 10, includeAIGenerated: false };

  it("accepts at most three subjects and rejects the previously submitted five-subject payload", () => {
    expect(practiceMockStartInput.safeParse(valid).success).toBe(true);
    const parsed = practiceMockStartInput.safeParse({ ...valid, subjectIds: [1, 2, 3, 4, 5] });
    expect(parsed.success).toBe(false);
  });
});
