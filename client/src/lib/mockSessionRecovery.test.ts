import { describe, expect, it } from "vitest";
import { getRecoveredMockSnapshot, getRestoredQuestionIndex, resolvePracticeMockRoute } from "./mockSessionRecovery";

describe("Practice Mock recovery position", () => {
  it("restores the saved one-based question position as a zero-based screen index", () => {
    expect(getRestoredQuestionIndex(4, 10)).toBe(3);
  });

  it("clamps invalid saved positions without leaving the question list", () => {
    expect(getRestoredQuestionIndex(0, 10)).toBe(0);
    expect(getRestoredQuestionIndex(20, 10)).toBe(9);
  });

  it("routes a normal Practice Mock visit to the discovered active session", () => {
    expect(resolvePracticeMockRoute(undefined, 90001)).toEqual({ kind: "session", sessionId: 90001, recoveredFromActiveSession: true });
    expect(resolvePracticeMockRoute(42, 90001)).toEqual({ kind: "session", sessionId: 42, recoveredFromActiveSession: false });
    expect(resolvePracticeMockRoute(undefined, undefined)).toEqual({ kind: "setup" });
  });

  it("restores saved progress, active question, flag state, and a continuing timer snapshot", () => {
    expect(getRecoveredMockSnapshot({
      currentQuestionPosition: 4,
      questionCount: 10,
      questions: [
        { selectedAnswer: "B", flagged: false },
        { selectedAnswer: "B", flagged: true },
        { selectedAnswer: "B", flagged: false },
        { selectedAnswer: null, flagged: false },
      ],
      startedAt: new Date("2026-08-20T00:00:00.000Z"),
      durationSeconds: 600,
      now: new Date("2026-08-20T00:03:20.000Z"),
    })).toEqual({ currentIndex: 3, answered: 3, flagged: 1, remainingSeconds: 400 });
  });
});
