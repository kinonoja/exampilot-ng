import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const services = vi.hoisted(() => ({
  getStudentProfile: vi.fn(),
  updateStudentCoursePreference: vi.fn(),
}));

vi.mock("./db", () => ({
  getDailyAttemptCount: vi.fn(),
  getPracticeFilters: vi.fn(),
  getRandomPracticeQuestion: vi.fn(),
  getStudentProfile: services.getStudentProfile,
  submitPracticeAttempt: vi.fn(),
  updateStudentCoursePreference: services.updateStudentCoursePreference,
  updateStudentProfile: vi.fn(),
}));

import { appRouter } from "./routers";

const profile = {
  id: 71,
  name: "Learner",
  email: "learner@example.com",
  examTarget: "JAMB" as const,
  examYear: 2027,
  courseKey: "computer-science",
  targetInstitutionName: null,
  institutionPlanningStatus: "not_sure" as const,
  institutionValidationStatus: "not_checked" as const,
  coursePreferenceUpdatedAt: new Date("2026-08-20T00:00:00.000Z"),
  subscriptionStatus: "free" as const,
  subscriptionExpiresAt: null,
};

function createCaller() {
  return appRouter.createCaller({
    user: { id: 71, openId: "course-student", role: "user" },
    req: {},
    res: {},
  } as TrpcContext);
}

describe("course direction router", () => {
  it("exposes every course, including the unvalidated records, with permanent verification copy", async () => {
    const result = await createCaller().courseDirection.catalogue();
    expect(result.courses).toHaveLength(46);
    expect(result.courses.find(course => course.key === "agriculture")?.confidence).toBe("unvalidated");
    expect(result.verificationCopy).toBe("Common combination — confirm for your university.");
  });

  it("saves a not-sure course preference without supplying an institution or subject default", async () => {
    services.updateStudentCoursePreference.mockResolvedValueOnce(profile);
    const result = await createCaller().courseDirection.save({
      courseKey: "computer-science",
      institutionPlanningStatus: "not_sure",
    });
    expect(services.updateStudentCoursePreference).toHaveBeenCalledWith(71, {
      courseKey: "computer-science",
      institutionPlanningStatus: "not_sure",
      targetInstitutionName: null,
    });
    expect(result.subjectDefault).toBeNull();
  });

  it("reads a persisted verified institution state without manufacturing a subject default", async () => {
    services.getStudentProfile.mockResolvedValueOnce({
      ...profile,
      targetInstitutionName: "University of Lagos",
      institutionPlanningStatus: "provided",
      institutionValidationStatus: "verified",
    });
    const result = await createCaller().courseDirection.get();
    expect(result.profile.institutionValidationStatus).toBe("verified");
    expect(result.course?.key).toBe("computer-science");
    expect(result.subjectDefault).toBeNull();
  });

  it("keeps a provided target institution in a not-checked state and never derives a subject default", async () => {
    services.updateStudentCoursePreference.mockResolvedValueOnce({
      ...profile,
      targetInstitutionName: "University of Lagos",
      institutionPlanningStatus: "provided",
    });
    const result = await createCaller().courseDirection.save({
      courseKey: "medicine-and-surgery",
      institutionPlanningStatus: "provided",
      targetInstitutionName: "University of Lagos",
    });
    expect(services.updateStudentCoursePreference).toHaveBeenCalledWith(71, {
      courseKey: "medicine-and-surgery",
      institutionPlanningStatus: "provided",
      targetInstitutionName: "University of Lagos",
    });
    expect(result.profile.institutionValidationStatus).toBe("not_checked");
    expect(result.subjectDefault).toBeNull();
  });
});
