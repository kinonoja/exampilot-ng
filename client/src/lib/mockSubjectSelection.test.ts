import { describe, expect, it } from "vitest";
import { togglePracticeMockSubject } from "./mockSubjectSelection";

describe("Practice Mock subject selection", () => {
  it("blocks a fourth selected subject with a student-facing explanation", () => {
    expect(togglePracticeMockSubject([1, 2, 3], 4)).toEqual({
      subjectIds: [1, 2, 3],
      notice: "Choose up to 3 subjects for this short Practice Mock.",
    });
  });

  it("allows removing a selected subject", () => {
    expect(togglePracticeMockSubject([1, 2, 3], 2)).toEqual({ subjectIds: [1, 3], notice: undefined });
  });
});
