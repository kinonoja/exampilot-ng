import { describe, expect, it } from "vitest";
import { buildMockHistory, getHistoryFinalizationIds, getMockLifecycle, getMockPace, getMockProgress, getMockScore, getMockTopicBreakdown, getRestoredQuestionPosition, shouldResumePracticeMock } from "./mockExam";

describe("Practice Mock lifecycle", () => {
  it("expires an in-progress session at its server-calculated deadline", () => {
    const startedAt = new Date("2026-08-20T00:00:00.000Z");
    expect(getMockLifecycle("in_progress", startedAt, 300, new Date("2026-08-20T00:04:59.000Z"))).toEqual({
      status: "in_progress",
      remainingSeconds: 1,
    });
    expect(getMockLifecycle("in_progress", startedAt, 300, new Date("2026-08-20T00:05:00.000Z"))).toEqual({
      status: "expired",
      remainingSeconds: 0,
    });
  });

  it("summarises saved answers and review flags without exposing scoring", () => {
    expect(getMockProgress([
      { selectedAnswer: "A", flagged: false },
      { selectedAnswer: null, flagged: true },
      { selectedAnswer: "C", flagged: true },
    ])).toEqual({ answered: 2, flagged: 2, unanswered: 1, total: 3 });
  });

  it("restores a valid saved question position and safely clamps stale positions", () => {
    expect(getRestoredQuestionPosition(4, 10)).toBe(4);
    expect(getRestoredQuestionPosition(0, 10)).toBe(1);
    expect(getRestoredQuestionPosition(14, 10)).toBe(10);
  });

  it("keeps a saved active session recoverable with its progress and continuing countdown", () => {
    const startedAt = new Date("2026-08-20T00:00:00.000Z");
    const progress = getMockProgress([
      { selectedAnswer: "B", flagged: false },
      { selectedAnswer: "B", flagged: true },
      { selectedAnswer: "B", flagged: false },
      { selectedAnswer: null, flagged: false },
    ]);

    expect(shouldResumePracticeMock("in_progress", startedAt, 600, new Date("2026-08-20T00:03:20.000Z"))).toBe(true);
    expect(getMockLifecycle("in_progress", startedAt, 600, new Date("2026-08-20T00:03:20.000Z")).remainingSeconds).toBe(400);
    expect(getRestoredQuestionPosition(4, 10)).toBe(4);
    expect(progress).toEqual({ answered: 3, flagged: 1, unanswered: 1, total: 4 });
  });

  it("does not resume an elapsed session", () => {
    const startedAt = new Date("2026-08-20T00:00:00.000Z");
    expect(shouldResumePracticeMock("in_progress", startedAt, 300, new Date("2026-08-20T00:05:00.000Z"))).toBe(false);
  });

  it("calculates final correctness and a percentage score without treating unanswered questions as correct", () => {
    expect(getMockScore([
      { selectedAnswer: "A", correctAnswer: "A" },
      { selectedAnswer: "B", correctAnswer: "C" },
      { selectedAnswer: null, correctAnswer: "D" },
      { selectedAnswer: "D", correctAnswer: "D" },
    ])).toEqual({ correct: 2, total: 4, score: 50 });
  });

  it("groups topic accuracy by assigned questions and returns a transparent overall pace summary", () => {
    expect(getMockTopicBreakdown([
      { topicName: "Ecology", selectedAnswer: "A", correctAnswer: "A" },
      { topicName: "Ecology", selectedAnswer: null, correctAnswer: "B" },
      { topicName: "Vocabulary", selectedAnswer: "C", correctAnswer: "C" },
    ])).toEqual([
      { topicName: "Ecology", correct: 1, total: 2, accuracy: 50 },
      { topicName: "Vocabulary", correct: 1, total: 1, accuracy: 100 },
    ]);
    expect(getMockPace({
      startedAt: new Date("2026-08-20T00:00:00.000Z"),
      submittedAt: new Date("2026-08-20T00:04:00.000Z"),
      durationSeconds: 600,
      questionCount: 10,
    })).toEqual({ elapsedSeconds: 240, plannedSecondsPerQuestion: 60, actualSecondsPerQuestion: 24, paceStatus: "within_pace" });
  });

  it("finalizes expired unscored mocks and returns only completed history in newest-first order", () => {
    const now = new Date("2026-08-20T12:00:00.000Z");
    expect(getHistoryFinalizationIds([
      { id: 1, status: "in_progress", startedAt: new Date("2026-08-20T11:40:00.000Z"), durationSeconds: 300, score: null },
      { id: 2, status: "expired", startedAt: new Date("2026-08-20T11:50:00.000Z"), durationSeconds: 300, score: null },
      { id: 3, status: "submitted", startedAt: new Date("2026-08-20T11:55:00.000Z"), durationSeconds: 300, score: 80 },
    ], now)).toEqual([1, 2]);
    const history = buildMockHistory([
      { id: 1, examId: 1, examName: "JAMB", subjectIds: [1], startedAt: new Date("2026-08-20T10:00:00.000Z"), submittedAt: new Date("2026-08-20T10:05:00.000Z"), durationSeconds: 300, score: 60, status: "expired", questionCount: "5" },
      { id: 2, examId: 1, examName: "JAMB", subjectIds: [1, 2], startedAt: new Date("2026-08-20T11:00:00.000Z"), submittedAt: new Date("2026-08-20T11:05:00.000Z"), durationSeconds: 300, score: 80, status: "submitted", questionCount: 10 },
      { id: 3, examId: 1, examName: "JAMB", subjectIds: [1], startedAt: new Date("2026-08-20T11:30:00.000Z"), submittedAt: null, durationSeconds: 300, score: null, status: "in_progress", questionCount: 5 },
      { id: 4, examId: 1, examName: "JAMB", subjectIds: [1], startedAt: new Date("2026-08-20T11:40:00.000Z"), submittedAt: new Date("2026-08-20T11:45:00.000Z"), durationSeconds: 300, score: null, status: "expired", questionCount: 5 },
    ]);
    expect(history.map(mock => mock.id)).toEqual([2, 1]);
    expect(history[0]?.questionCount).toBe(10);
  });
});
