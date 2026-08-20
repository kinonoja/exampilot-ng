export function getRestoredQuestionIndex(position: number, questionCount: number) {
  if (questionCount <= 0) return 0;
  return Math.max(0, Math.min(position - 1, questionCount - 1));
}

export function resolvePracticeMockRoute(urlSessionId: number | undefined, activeSessionId: number | undefined) {
  if (urlSessionId) return { kind: "session" as const, sessionId: urlSessionId, recoveredFromActiveSession: false };
  if (activeSessionId) return { kind: "session" as const, sessionId: activeSessionId, recoveredFromActiveSession: true };
  return { kind: "setup" as const };
}

export function getRecoveredMockSnapshot(input: {
  currentQuestionPosition: number;
  questionCount: number;
  questions: Array<{ selectedAnswer: string | null; flagged: boolean }>;
  startedAt: Date;
  durationSeconds: number;
  now: Date;
}) {
  const answered = input.questions.filter(question => question.selectedAnswer).length;
  const flagged = input.questions.filter(question => question.flagged).length;
  return {
    currentIndex: getRestoredQuestionIndex(input.currentQuestionPosition, input.questionCount),
    answered,
    flagged,
    remainingSeconds: Math.max(0, input.durationSeconds - Math.floor((input.now.getTime() - input.startedAt.getTime()) / 1000)),
  };
}
