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
  questionCount?: number;
};

const JAMB_SUBJECT_MATCH_ALIASES: Record<string, readonly string[]> = {
  "agriculture science": ["agriculture science", "agricultural science"],
  "principles of accounts": ["principles of accounts", "financial accounting"],
  "christian religious studies": ["christian religious studies", "crs"],
  "islamic studies": ["islamic studies", "irs"],
  "use of english": ["use of english", "english language"],
};

function requirementMatchesSubject(requirement: string, subjectName: string) {
  const normalizedSubject = subjectName.toLowerCase();
  const aliases = JAMB_SUBJECT_MATCH_ALIASES[normalizedSubject] ?? [normalizedSubject];
  return aliases.some(alias => requirement.toLowerCase().includes(alias));
}

export function getCourseDashboardGuidance(course: CourseDirection | null | undefined, subjects: CatalogueSubject[]) {
  if (!course) return null;

  const commonCombination = course.commonSubjects.join(" · ");
  const availableSubjects = subjects.filter(subject =>
    subject.questionCount !== 0 && course.commonSubjects.some(requirement => requirementMatchesSubject(requirement, subject.name)),
  );

  return {
    courseName: course.name,
    faculty: course.faculty,
    commonCombination,
    availableSubjects,
    needsExtraVerification: course.confidence !== "high",
  };
}
