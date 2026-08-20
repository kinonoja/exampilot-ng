import { describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";

const mockServices = vi.hoisted(() => ({
  getMockEntitlement: vi.fn(),
  startPracticeMock: vi.fn(),
}));

vi.mock("./catalog", () => ({ ensurePracticeCatalogue: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./mockExam", () => ({
  PRACTICE_MOCK_DURATION_MINUTES: [5, 10, 15],
  PRACTICE_MOCK_QUESTION_COUNTS: [5, 10, 15],
  expirePracticeMock: vi.fn(),
  getActivePracticeMock: vi.fn(),
  getMockEntitlement: mockServices.getMockEntitlement,
  getMockHistory: vi.fn(),
  getPracticeMockResults: vi.fn(),
  getPracticeMockSession: vi.fn(),
  getPracticeMockSetup: vi.fn(),
  savePracticeMockAnswer: vi.fn(),
  setPracticeMockFlag: vi.fn(),
  setPracticeMockPosition: vi.fn(),
  startPracticeMock: mockServices.startPracticeMock,
  submitPracticeMock: vi.fn(),
}));

import { assertCanStartPracticeMock, mockExamRouter } from "./mockExamRouter";

describe("Practice Mock server access guard", () => {
  it("rejects a Free learner before a mock can be created", () => {
    try {
      assertCanStartPracticeMock({
        isPro: false,
        canStartMock: false,
        reason: "Practice Mocks are included with Pro.",
      });
      throw new Error("Expected the guard to reject a Free learner.");
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("FORBIDDEN");
    }
  });

  it("allows a Pro learner to reach the protected start procedure", () => {
    expect(() => assertCanStartPracticeMock({ isPro: true, canStartMock: true, reason: undefined })).not.toThrow();
  });

  it("rejects a Free learner through the protected mock.start procedure before a session is inserted", async () => {
    mockServices.getMockEntitlement.mockResolvedValueOnce({
      isPro: false,
      canStartMock: false,
      reason: "Practice Mocks are included with Pro.",
    });
    const ctx = {
      user: { id: 7, openId: "free-student", role: "user" },
      req: {},
      res: {},
    } as TrpcContext;
    const caller = mockExamRouter.createCaller(ctx);
    await expect(caller.start({ examId: 1, subjectIds: [1], questionCount: 5, durationMinutes: 5, includeAIGenerated: false }))
      .rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mockServices.startPracticeMock).not.toHaveBeenCalled();
  });
});
