type CourseDirection = {
  key: string;
  name: string;
  faculty: string;
  commonSubjects: string[];
  confidence: "high" | "medium" | "unvalidated";
};

type CatalogueSubject = {
  id: number;
  examId: number;
  name: string;
};

export function getCourseDashboardGuidance(course: CourseDirection | null | undefined, subjects: CatalogueSubject[]) {
  if (!course) return null;

  const commonCombination = course.commonSubjects.join(" · ");
  const availableSubjects = subjects.filter(subject =>
    course.commonSubjects.some(requirement => requirement.toLowerCase().includes(subject.name.toLowerCase())),
  );

  return {
    courseName: course.name,
    faculty: course.faculty,
    commonCombination,
    availableSubjects,
    needsExtraVerification: course.confidence !== "high",
  };
}
