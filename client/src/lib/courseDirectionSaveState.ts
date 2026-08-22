type CourseDirectionSaveInput = {
  courseKey?: string;
  planningStatus: "not_sure" | "provided";
  institutionName: string;
};

export function getCourseDirectionSaveValidation(input: CourseDirectionSaveInput) {
  if (!input.courseKey) return "Choose a course before saving your direction.";
  if (input.planningStatus === "provided" && input.institutionName.trim().length < 2) {
    return "Enter your target university before saving your direction.";
  }
  return null;
}

export function getCourseDirectionSaveConfirmation(courseName: string, planningStatus: CourseDirectionSaveInput["planningStatus"], institutionName: string) {
  return planningStatus === "provided"
    ? `Saved. ${courseName} and ${institutionName.trim()} are now your course direction.`
    : `Saved. ${courseName} is now your course direction. You can add a target university later.`;
}
