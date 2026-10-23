import { describe, expect, it } from "vitest";
import { getPracticeFilters } from "./db";
import { getPracticeMockSetup } from "./mockExam";

describe("persisted Chemistry availability", () => {
  it("surfaces the approved JAMB Chemistry bank in practice filters and Practice Mock setup", async () => {
    const filters = await getPracticeFilters();
    const jamb = filters.exams.find(exam => exam.name === "JAMB");
    const chemistry = filters.subjects.find(subject => subject.name === "Chemistry" && subject.examId === jamb?.id);

    expect(jamb).toBeDefined();
    expect(chemistry).toBeDefined();

    const chemistryTopics = filters.topics.filter(topic => topic.subjectId === chemistry?.id);
    expect(chemistryTopics.length).toBeGreaterThanOrEqual(23);
    expect(chemistryTopics.some(topic => topic.name === "Acids, Bases and Salts")).toBe(true);

    const setup = await getPracticeMockSetup();
    const chemistrySetup = setup.subjects.find(subject => subject.id === chemistry?.id);

    expect(chemistrySetup).toMatchObject({
      name: "Chemistry",
      originalQuestionCount: 0,
      aiQuestionCount: 48,
    });
  });
});
