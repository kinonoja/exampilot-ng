import { describe, expect, it } from "vitest";
import { getPracticeFilters } from "./db";
import { getPracticeMockSetup } from "./mockExam";

describe("persisted Physics availability", () => {
  it("surfaces the approved JAMB Physics bank in Practice filters and Practice Mock setup", async () => {
    const filters = await getPracticeFilters();
    const jamb = filters.exams.find(exam => exam.name === "JAMB");
    const physics = filters.subjects.find(subject => subject.name === "Physics" && subject.examId === jamb?.id);

    expect(jamb).toBeDefined();
    expect(physics).toBeDefined();

    const physicsTopics = filters.topics.filter(topic => topic.subjectId === physics?.id);
    expect(physicsTopics).toHaveLength(34);

    const setup = await getPracticeMockSetup();
    const physicsSetup = setup.subjects.find(subject => subject.id === physics?.id);

    expect(physicsSetup).toMatchObject({
      name: "Physics",
      originalQuestionCount: 0,
      aiQuestionCount: 48,
    });
  });
});
