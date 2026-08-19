export function topicIdFromSearch(search: string): number | undefined {
  const rawTopicId = new URLSearchParams(search).get("topicId");
  if (!rawTopicId) return undefined;

  const topicId = Number(rawTopicId);
  return Number.isInteger(topicId) && topicId > 0 ? topicId : undefined;
}
