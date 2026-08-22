export function parseTutorQuestionId(location: string) {
  const value = new URLSearchParams(location.split("?")[1] ?? "").get("questionId");
  const questionId = value ? Number(value) : NaN;
  return Number.isInteger(questionId) && questionId > 0 ? questionId : undefined;
}

export function shouldAutoStartTutorQuestion(input: {
  linkedQuestionId?: number;
  hasConversation: boolean;
  isPending: boolean;
  alreadyStartedQuestionId?: number;
}) {
  return Boolean(
    input.linkedQuestionId
    && !input.hasConversation
    && !input.isPending
    && input.alreadyStartedQuestionId !== input.linkedQuestionId,
  );
}
