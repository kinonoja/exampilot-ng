import { describe, expect, it } from "vitest";
import { getPracticeFilters } from "./db";
import { getPracticeMockSetup } from "./mockExam";

describe("approved JAMB syllabus availability", () => {
  it("exposes all 25 official subjects, preserves the Use of English ID, and labels source-mapped subjects through zero question counts", async () => {
    const filters = await getPracticeFilters();
    const jamb = filters.exams.find(exam => exam.name === "JAMB");
    const jambSubjects = filters.subjects.filter(subject => subject.examId === jamb?.id);
    const useOfEnglish = jambSubjects.find(subject => subject.name === "Use of English");
    const legacyEnglish = jambSubjects.find(subject => subject.name === "English");
    const agriculture = jambSubjects.find(subject => subject.name === "Agriculture Science");

    expect(jambSubjects).toHaveLength(25);
    expect(useOfEnglish).toMatchObject({ id: 2, questionCount: 16 });
    expect(legacyEnglish).toBeUndefined();
    expect(agriculture).toMatchObject({ questionCount: 0 });
    expect(filters.topics.filter(topic => topic.subjectId === agriculture?.id).length).toBeGreaterThan(0);
  });

  it("keeps zero-question syllabus subjects out of Practice Mock selection", async () => {
    const setup = await getPracticeMockSetup();

    expect(setup.subjects.some(subject => subject.name === "Agriculture Science")).toBe(false);
    expect(setup.subjects.every(subject => subject.originalQuestionCount + subject.aiQuestionCount > 0)).toBe(true);
  });
});
