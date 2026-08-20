import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { ensurePracticeCatalogue } from "./catalog";
import {
  PRACTICE_MOCK_DURATION_MINUTES,
  PRACTICE_MOCK_QUESTION_COUNTS,
  expirePracticeMock,
  getActivePracticeMock,
  getMockEntitlement,
  getMockHistory,
  getPracticeMockResults,
  getPracticeMockSession,
  getPracticeMockSetup,
  savePracticeMockAnswer,
  setPracticeMockFlag,
  setPracticeMockPosition,
  startPracticeMock,
  submitPracticeMock,
} from "./mockExam";

const mockIdInput = z.object({ mockExamId: z.number().int().positive() });
const startInput = z.object({
  examId: z.number().int().positive(),
  subjectIds: z.array(z.number().int().positive()).min(1).max(3),
  questionCount: z.union(PRACTICE_MOCK_QUESTION_COUNTS.map(value => z.literal(value)) as [z.ZodLiteral<5>, z.ZodLiteral<10>, z.ZodLiteral<15>]),
  durationMinutes: z.union(PRACTICE_MOCK_DURATION_MINUTES.map(value => z.literal(value)) as [z.ZodLiteral<5>, z.ZodLiteral<10>, z.ZodLiteral<15>]),
  includeAIGenerated: z.boolean().default(false),
});

export function assertCanStartPracticeMock(access: Awaited<ReturnType<typeof getMockEntitlement>>) {
  if (!access.canStartMock) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: access.reason ?? "Practice Mocks are included with Pro.",
    });
  }
}

export const mockExamRouter = router({
  setup: protectedProcedure.query(async () => {
    await ensurePracticeCatalogue();
    return getPracticeMockSetup();
  }),
  start: protectedProcedure.input(startInput).mutation(async ({ ctx, input }) => {
    await ensurePracticeCatalogue();
    assertCanStartPracticeMock(await getMockEntitlement(ctx.user.id));
    return startPracticeMock(ctx.user.id, input);
  }),
  session: protectedProcedure.input(mockIdInput).query(({ ctx, input }) => getPracticeMockSession(ctx.user.id, input.mockExamId)),
  results: protectedProcedure.input(mockIdInput).query(({ ctx, input }) => getPracticeMockResults(ctx.user.id, input.mockExamId)),
  active: protectedProcedure.query(({ ctx }) => getActivePracticeMock(ctx.user.id)),
  entitlement: protectedProcedure.query(({ ctx }) => getMockEntitlement(ctx.user.id)),
  history: protectedProcedure.query(({ ctx }) => getMockHistory(ctx.user.id)),
  saveAnswer: protectedProcedure
    .input(mockIdInput.extend({ questionId: z.number().int().positive(), selectedAnswer: z.string().min(1).max(8) }))
    .mutation(({ ctx, input }) => savePracticeMockAnswer(ctx.user.id, input)),
  setFlag: protectedProcedure
    .input(mockIdInput.extend({ questionId: z.number().int().positive(), flagged: z.boolean() }))
    .mutation(({ ctx, input }) => setPracticeMockFlag(ctx.user.id, input)),
  setPosition: protectedProcedure
    .input(mockIdInput.extend({ position: z.number().int().positive().max(15) }))
    .mutation(({ ctx, input }) => setPracticeMockPosition(ctx.user.id, input)),
  submit: protectedProcedure.input(mockIdInput).mutation(({ ctx, input }) => submitPracticeMock(ctx.user.id, input.mockExamId)),
  expire: protectedProcedure.input(mockIdInput).mutation(({ ctx, input }) => expirePracticeMock(ctx.user.id, input.mockExamId)),
});
