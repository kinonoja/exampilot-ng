import { describe, expect, it } from "vitest";
import { parseTutorQuestionId, shouldAutoStartTutorQuestion } from "./tutorQuestionHandoff";

describe("Tutor question handoff", () => {
  it("extracts only a valid positive practice question identifier", () => {
    expect(parseTutorQuestionId("/tutor?questionId=2370001")).toBe(2370001);
    expect(parseTutorQuestionId("https://preview.example/tutor?questionId=42")).toBe(42);
    expect(parseTutorQuestionId("/tutor?questionId=0")).toBeUndefined();
    expect(parseTutorQuestionId("/tutor?questionId=not-a-number")).toBeUndefined();
  });

  it("starts a linked Tutor session only once per question and never replaces an active conversation", () => {
    expect(shouldAutoStartTutorQuestion({ linkedQuestionId: 42, hasConversation: false, isPending: false })).toBe(true);
    expect(shouldAutoStartTutorQuestion({ linkedQuestionId: 42, hasConversation: false, isPending: false, alreadyStartedQuestionId: 42 })).toBe(false);
    expect(shouldAutoStartTutorQuestion({ linkedQuestionId: 42, hasConversation: true, isPending: false })).toBe(false);
  });
});
