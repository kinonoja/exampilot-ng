import { describe, expect, it } from "vitest";
import { getCourseDashboardGuidance } from "./courseDashboardGuidance";

const subjects = [
  { id: 1, examId: 1, name: "Mathematics" },
  { id: 2, examId: 1, name: "Biology" },
  { id: 3, examId: 1, name: "Chemistry" },
  { id: 4, examId: 1, name: "Physics" },
];

describe("course dashboard guidance", () => {
  it("recalculates the available focus subjects from the saved course combination", () => {
    const nutrition = getCourseDashboardGuidance({ key: "nutrition", name: "Nutrition and Dietetics", faculty: "Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics or Mathematics"], confidence: "unvalidated" }, subjects);
    const engineering = getCourseDashboardGuidance({ key: "engineering", name: "Civil Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"], confidence: "high" }, subjects);

    expect(nutrition?.availableSubjects.map(subject => subject.name)).toEqual(["Mathematics", "Biology", "Chemistry", "Physics"]);
    expect(engineering?.availableSubjects.map(subject => subject.name)).toEqual(["Mathematics", "Chemistry", "Physics"]);
  });

  it("keeps institution confirmation visible even for courses with no matching current-bank subject", () => {
    const guidance = getCourseDashboardGuidance({ key: "law", name: "Law", faculty: "Law", commonSubjects: ["Three Arts or Social Science subjects"], confidence: "medium" }, subjects);
    expect(guidance?.availableSubjects).toEqual([]);
    expect(guidance?.commonCombination).toContain("Arts or Social Science");
  });

  it("does not turn syllabus-only subjects into live practice actions", () => {
    const guidance = getCourseDashboardGuidance(
      { key: "agriculture", name: "Agriculture", faculty: "Agriculture", commonSubjects: ["Agricultural Science", "Chemistry"], confidence: "high" },
      [
        { id: 1, examId: 1, name: "Agriculture Science", questionCount: 0 },
        { id: 3, examId: 1, name: "Chemistry", questionCount: 48 },
      ],
    );

    expect(guidance?.availableSubjects.map(subject => subject.name)).toEqual(["Chemistry"]);
  });

  it("recognises official catalogue labels when a course dataset uses a verified equivalent", () => {
    const guidance = getCourseDashboardGuidance(
      { key: "accounting", name: "Accounting", faculty: "Management", commonSubjects: ["Financial Accounting", "Economics"], confidence: "high" },
      [
        { id: 1, examId: 1, name: "Principles of Accounts", questionCount: 0 },
        { id: 2, examId: 1, name: "Economics", questionCount: 12 },
      ],
    );

    expect(guidance?.availableSubjects.map(subject => subject.name)).toEqual(["Economics"]);
  });
});
