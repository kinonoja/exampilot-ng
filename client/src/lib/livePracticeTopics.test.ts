import { describe, expect, it } from "vitest";
import { getLivePracticeTopics } from "./livePracticeTopics";

describe("getLivePracticeTopics", () => {
  it("keeps only topics belonging to subjects with a question bank", () => {
    const topics = getLivePracticeTopics(
      [
        { id: 1, questionCount: 18 },
        { id: 2, questionCount: 0 },
        { id: 3, questionCount: 48 },
      ],
      [
        { id: 11, subjectId: 1, name: "Algebraic Expressions" },
        { id: 12, subjectId: 2, name: "Culture and Civilisation" },
        { id: 13, subjectId: 3, name: "Refraction and Optics" },
      ],
    );

    expect(topics.map(topic => topic.name)).toEqual([
      "Algebraic Expressions",
      "Refraction and Optics",
    ]);
  });
});
