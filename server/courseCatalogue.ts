export type CourseConfidence = "high" | "medium" | "unvalidated";

export type InternalCourse = {
  key: string;
  name: string;
  faculty: string;
  commonSubjects: string[];
  confidence: CourseConfidence;
};

const highConfidenceCourseKeys = new Set([
  "medicine-and-surgery", "nursing-science", "pharmacy", "pharmacology", "biochemistry", "industrial-engineering", "agricultural-engineering", "computer-science", "economics", "theatre-arts", "education-biology", "education-physics",
]);

const unvalidatedCourseKeys = new Set([
  "nutrition-and-dietetics", "english-literary-studies", "history-international-studies", "fine-applied-arts", "agriculture", "fisheries-aquaculture", "forestry-wildlife", "food-science-technology",
]);

const courseRows: Omit<InternalCourse, "confidence">[] = [
  { key: "medicine-and-surgery", name: "Medicine and Surgery", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics"] },
  { key: "nursing-science", name: "Nursing Science", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics"] },
  { key: "pharmacy", name: "Pharmacy", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Physics", "Chemistry", "Biology"] },
  { key: "pharmacology", name: "Pharmacology", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics"] },
  { key: "nutrition-and-dietetics", name: "Nutrition and Dietetics", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics or Mathematics"] },
  { key: "biochemistry", name: "Biochemistry", faculty: "Medical and Pharmaceutical Health Sciences", commonSubjects: ["Biology", "Chemistry", "Physics"] },
  { key: "civil-engineering", name: "Civil Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "electrical-electronics-engineering", name: "Electrical/Electronics Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "mechanical-engineering", name: "Mechanical Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "chemical-engineering", name: "Chemical Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "computer-engineering", name: "Computer Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "industrial-engineering", name: "Industrial Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "agricultural-engineering", name: "Agricultural Engineering", faculty: "Engineering", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "architecture", name: "Architecture", faculty: "Environmental Sciences and Architecture", commonSubjects: ["Mathematics", "Physics", "Chemistry, Geography, Economics, Biology, or Fine Arts"] },
  { key: "quantity-surveying", name: "Quantity Surveying", faculty: "Environmental Sciences and Architecture", commonSubjects: ["Mathematics", "Physics", "Economics, Geography, or Chemistry"] },
  { key: "surveying-geoinformatics", name: "Surveying and Geoinformatics", faculty: "Environmental Sciences and Architecture", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "urban-regional-planning", name: "Urban and Regional Planning", faculty: "Environmental Sciences and Architecture", commonSubjects: ["Mathematics", "Geography or Economics", "Chemistry, Physics, Biology, Fine Arts, or Technical Drawing"] },
  { key: "computer-science", name: "Computer Science", faculty: "Sciences", commonSubjects: ["Mathematics", "Physics", "Chemistry or Biology"] },
  { key: "mathematics", name: "Mathematics", faculty: "Sciences", commonSubjects: ["Mathematics", "Physics", "Chemistry, Biology, Computer Studies, or Data Processing"] },
  { key: "physics", name: "Physics", faculty: "Sciences", commonSubjects: ["Physics", "Mathematics", "Chemistry"] },
  { key: "chemistry", name: "Chemistry", faculty: "Sciences", commonSubjects: ["Chemistry", "Two of Physics, Biology, Agricultural Science, or Integrated Science"] },
  { key: "biology", name: "Biology", faculty: "Sciences", commonSubjects: ["Biology", "Two of Chemistry, Physics, Mathematics, or Integrated Science"] },
  { key: "geology", name: "Geology", faculty: "Sciences", commonSubjects: ["Mathematics", "Physics", "Chemistry"] },
  { key: "accounting", name: "Accounting", faculty: "Management and Administration", commonSubjects: ["Mathematics", "Economics", "Financial Accounting, Geography, Government, or Biology"] },
  { key: "business-administration", name: "Business Administration", faculty: "Management and Administration", commonSubjects: ["Mathematics", "Economics", "One Science, Social Science, or Arts subject"] },
  { key: "banking-finance", name: "Banking and Finance", faculty: "Management and Administration", commonSubjects: ["Mathematics", "Economics", "One Science, Social Science, or Arts subject"] },
  { key: "economics", name: "Economics", faculty: "Management and Administration", commonSubjects: ["Mathematics", "Economics", "Biology, Financial Accounting, Geography, or Government"] },
  { key: "political-science", name: "Political Science", faculty: "Social Sciences", commonSubjects: ["Government", "Economics or Geography", "History, Literature in English, CRS, or IRS"] },
  { key: "sociology", name: "Sociology", faculty: "Social Sciences", commonSubjects: ["Two Social Science subjects", "One Arts subject", "Mathematics may be accepted"] },
  { key: "psychology", name: "Psychology", faculty: "Social Sciences", commonSubjects: ["Three of Mathematics, Biology, Physics, Chemistry, Economics, Government, or Literature in English"] },
  { key: "mass-communication", name: "Mass Communication", faculty: "Social Sciences", commonSubjects: ["Literature in English", "Two other Arts or Social Science subjects"] },
  { key: "law", name: "Law", faculty: "Law", commonSubjects: ["Three Arts or Social Science subjects", "Institution-specific restrictions may apply"] },
  { key: "english-literary-studies", name: "English and Literary Studies", faculty: "Arts and Humanities", commonSubjects: ["Literature in English", "Two other Arts or Social Science subjects"] },
  { key: "history-international-studies", name: "History and International Studies", faculty: "Arts and Humanities", commonSubjects: ["History or Government", "Two other Arts or Social Science subjects"] },
  { key: "theatre-arts", name: "Theatre Arts", faculty: "Arts and Humanities", commonSubjects: ["Literature in English", "Two other Arts or Social Science subjects"] },
  { key: "fine-applied-arts", name: "Fine and Applied Arts", faculty: "Arts and Humanities", commonSubjects: ["Fine Arts or Visual Arts", "Two other Arts or Social Science subjects"] },
  { key: "french", name: "French", faculty: "Arts and Humanities", commonSubjects: ["Three Arts or Social Science subjects"] },
  { key: "agriculture", name: "Agriculture", faculty: "Agriculture", commonSubjects: ["Biology or Agricultural Science", "Chemistry", "Physics or Mathematics"] },
  { key: "fisheries-aquaculture", name: "Fisheries and Aquaculture", faculty: "Agriculture", commonSubjects: ["Biology or Agricultural Science", "Chemistry", "Physics or Mathematics"] },
  { key: "forestry-wildlife", name: "Forestry and Wildlife Management", faculty: "Agriculture", commonSubjects: ["Biology or Agricultural Science", "Chemistry", "Physics or Mathematics"] },
  { key: "food-science-technology", name: "Food Science and Technology", faculty: "Agriculture", commonSubjects: ["Chemistry", "Mathematics or Physics", "Biology or Agricultural Science"] },
  { key: "education-biology", name: "Education and Biology", faculty: "Education", commonSubjects: ["Biology", "Two approved science subjects"] },
  { key: "education-chemistry", name: "Education and Chemistry", faculty: "Education", commonSubjects: ["Chemistry", "Two of Physics, Biology, Agricultural Science, or Integrated Science"] },
  { key: "education-physics", name: "Education and Physics", faculty: "Education", commonSubjects: ["Physics", "Mathematics or Chemistry", "Biology or Agricultural Science"] },
  { key: "education-mathematics", name: "Education and Mathematics", faculty: "Education", commonSubjects: ["Mathematics", "Physics", "Chemistry, Biology, Computer Studies, or Data Processing"] },
  { key: "education-english", name: "Education and English Language", faculty: "Education", commonSubjects: ["Three Arts or Social Science subjects"] },
];

export const COURSE_VERIFICATION_COPY = "Common combination — confirm for your university.";
export const COURSE_VERIFICATION_DETAIL = "Requirements can vary by university and programme option. Confirm the current combination for your target institution in JAMB’s IBASS Eligibility Checker before registering.";
export const JAMB_IBASS_ELIGIBILITY_URL = "https://ibass.jamb.gov.ng/eligibility-checker";

export const internalCourseCatalogue: InternalCourse[] = courseRows.map(course => ({
  ...course,
  confidence: highConfidenceCourseKeys.has(course.key) ? "high" : unvalidatedCourseKeys.has(course.key) ? "unvalidated" : "medium",
}));

export function getInternalCourse(courseKey: string) {
  return internalCourseCatalogue.find(course => course.key === courseKey);
}

export function canPromoteInstitutionSpecificSubjects(input: {
  courseKey: string | null | undefined;
  targetInstitutionName: string | null | undefined;
  institutionPlanningStatus: "not_sure" | "provided";
  institutionValidationStatus: "not_checked" | "verified";
  validatedSubjects: string[] | null | undefined;
}) {
  return Boolean(
    input.courseKey &&
      input.targetInstitutionName?.trim() &&
      input.institutionPlanningStatus === "provided" &&
      input.institutionValidationStatus === "verified" &&
      input.validatedSubjects?.length,
  );
}
