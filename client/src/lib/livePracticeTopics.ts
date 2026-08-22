export type PracticeCatalogueSubject = {
  id: number;
  questionCount?: number;
};

export type PracticeCatalogueTopic = {
  id: number;
  subjectId: number;
  name: string;
};

export function getLivePracticeTopics(
  subjects: PracticeCatalogueSubject[],
  topics: PracticeCatalogueTopic[],
) {
  const liveSubjectIds = new Set(
    subjects.filter(subject => (subject.questionCount ?? 0) > 0).map(subject => subject.id),
  );

  return topics.filter(topic => liveSubjectIds.has(topic.subjectId));
}
