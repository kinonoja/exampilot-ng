import { describe, expect, it } from "vitest";
import { getCourseDirectionSaveConfirmation, getCourseDirectionSaveValidation } from "./courseDirectionSaveState";

describe("Course Direction save state", () => {
  it("explains why an incomplete direction cannot be saved", () => {
    expect(getCourseDirectionSaveValidation({ courseKey: undefined, planningStatus: "not_sure", institutionName: "" })).toBe("Choose a course before saving your direction.");
    expect(getCourseDirectionSaveValidation({ courseKey: "law", planningStatus: "provided", institutionName: " " })).toBe("Enter your target university before saving your direction.");
  });

  it("returns explicit confirmation for both supported planning paths", () => {
    expect(getCourseDirectionSaveConfirmation("Law", "not_sure", "")).toContain("You can add a target university later.");
    expect(getCourseDirectionSaveConfirmation("Computer Science", "provided", "University of Lagos")).toContain("University of Lagos");
  });
});
