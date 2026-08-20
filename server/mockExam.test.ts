import { describe, expect, it } from "vitest";
import { getMockLifecycle, getMockProgress, getRestoredQuestionPosition, shouldResumePracticeMock } from "./mockExam";

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
});
