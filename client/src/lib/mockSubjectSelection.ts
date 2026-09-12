import { PRACTICE_MOCK_MAX_SUBJECTS } from "@shared/const";

export function togglePracticeMockSubject(subjectIds: number[], subjectId: number) {
  if (subjectIds.includes(subjectId)) {
    return { subjectIds: subjectIds.filter(id => id !== subjectId), notice: undefined };
  }
  if (subjectIds.length >= PRACTICE_MOCK_MAX_SUBJECTS) {
    return { subjectIds, notice: `Choose up to ${PRACTICE_MOCK_MAX_SUBJECTS} subjects for this short Practice Mock.` };
  }
  return { subjectIds: [...subjectIds, subjectId], notice: undefined };
}
