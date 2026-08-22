export function topicIdFromSearch(search: string): number | undefined {
  const rawTopicId = new URLSearchParams(search).get("topicId");
  if (!rawTopicId) return undefined;

  const topicId = Number(rawTopicId);
  return Number.isInteger(topicId) && topicId > 0 ? topicId : undefined;
}

export function subjectIdFromSearch(search: string): number | undefined {
  const rawSubjectId = new URLSearchParams(search).get("subjectId");
  if (!rawSubjectId) return undefined;

  const subjectId = Number(rawSubjectId);
  return Number.isInteger(subjectId) && subjectId > 0 ? subjectId : undefined;
}
