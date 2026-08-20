import { describe, expect, it } from "vitest";
import { COURSE_VERIFICATION_COPY, JAMB_IBASS_ELIGIBILITY_URL, canPromoteInstitutionSpecificSubjects, getInternalCourse, internalCourseCatalogue } from "./courseCatalogue";

describe("internal course catalogue", () => {
  it("preserves all 46 internal-only course records with one confidence tier each", () => {
    expect(internalCourseCatalogue).toHaveLength(46);
    expect(new Set(internalCourseCatalogue.map(course => course.key)).size).toBe(46);
    expect(internalCourseCatalogue.filter(course => course.confidence === "unvalidated")).toHaveLength(8);
  });

  it("adopts the official IBASS corrections for known disagreement records", () => {
    expect(getInternalCourse("geology")?.commonSubjects).toEqual(["Mathematics", "Physics", "Chemistry"]);
    expect(getInternalCourse("surveying-geoinformatics")?.commonSubjects).toEqual(["Mathematics", "Physics", "Chemistry"]);
    expect(getInternalCourse("french")?.commonSubjects).toEqual(["Three Arts or Social Science subjects"]);
    expect(getInternalCourse("mass-communication")?.commonSubjects).toEqual(["Literature in English", "Two other Arts or Social Science subjects"]);
  });

  it("keeps permanent verification wording and the official IBASS checker destination", () => {
    expect(COURSE_VERIFICATION_COPY).toBe("Common combination — confirm for your university.");
    expect(JAMB_IBASS_ELIGIBILITY_URL).toBe("https://ibass.jamb.gov.ng/eligibility-checker");
  });

  it("permits a future institution-specific default only after a validated course, target institution, and validated subject set exist", () => {
    expect(canPromoteInstitutionSpecificSubjects({
      courseKey: "computer-science",
      targetInstitutionName: "University of Lagos",
      institutionPlanningStatus: "provided",
      institutionValidationStatus: "not_checked",
      validatedSubjects: ["Mathematics", "Physics", "Chemistry"],
    })).toBe(false);
    expect(canPromoteInstitutionSpecificSubjects({
      courseKey: "computer-science",
      targetInstitutionName: "University of Lagos",
      institutionPlanningStatus: "provided",
      institutionValidationStatus: "verified",
      validatedSubjects: ["Mathematics", "Physics", "Chemistry"],
    })).toBe(true);
    expect(canPromoteInstitutionSpecificSubjects({
      courseKey: "computer-science",
      targetInstitutionName: "University of Lagos",
      institutionPlanningStatus: "provided",
      institutionValidationStatus: "verified",
      validatedSubjects: [],
    })).toBe(false);
  });
});
