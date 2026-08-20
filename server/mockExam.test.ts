import { describe, expect, it } from "vitest";
import { getMockLifecycle, getMockProgress } from "./mockExam";

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
});
