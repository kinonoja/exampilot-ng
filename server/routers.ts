import { z } from "zod";
import { ensurePracticeCatalogue } from "./catalog";
import { getBillingOverview } from "./billing";
import {
  getDailyAttemptCount,
  getPracticeFilters,
  getRandomPracticeQuestion,
  getStudentProfile,
  submitPracticeAttempt,
  updateStudentProfile,
} from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { cancelProSubscription, initializeProCheckout, verifyAndGrantProAccess } from "./paystack";
import { getPracticeEntitlement } from "./entitlements";

const profileInput = z.object({
  examTarget: z.enum(["JAMB", "WAEC", "NECO", "NABTEB"]),
  examYear: z.number().int().min(2026).max(2035),
});

async function getPracticeAccess(userId: number) {
  const [profile, dailyAttemptCount] = await Promise.all([
    getStudentProfile(userId),
    getDailyAttemptCount(userId),
  ]);
  if (!profile) throw new Error("Your student profile could not be found.");
  return getPracticeEntitlement({
    subscriptionStatus: profile.subscriptionStatus,
    subscriptionExpiresAt: profile.subscriptionExpiresAt,
    dailyAttemptCount,
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  profile: router({
    get: protectedProcedure.query(({ ctx }) => getStudentProfile(ctx.user.id)),
    save: protectedProcedure.input(profileInput).mutation(({ ctx, input }) => updateStudentProfile(ctx.user.id, input)),
  }),
  practice: router({
    catalogue: protectedProcedure.query(async () => {
      await ensurePracticeCatalogue();
      return getPracticeFilters();
    }),
    access: protectedProcedure.query(({ ctx }) => getPracticeAccess(ctx.user.id)),
    next: protectedProcedure
      .input(
        z.object({
          examId: z.number().int().positive(),
          subjectId: z.number().int().positive().optional(),
          topicId: z.number().int().positive().optional(),
          difficulty: z.enum(["easy", "medium", "hard"]).optional(),
          previousQuestionIds: z.array(z.number().int().positive()).max(50).optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        await ensurePracticeCatalogue();
        const access = await getPracticeAccess(ctx.user.id);
        if (!access.canPractice) return { ...access, question: null, limitReached: true };
        const question = await getRandomPracticeQuestion({
          ...input,
          excludeQuestionIds: input.previousQuestionIds,
        });
        return { ...access, question, limitReached: false };
      }),
    submit: protectedProcedure
      .input(
        z.object({
          questionId: z.number().int().positive(),
          selectedAnswer: z.string().min(1).max(8),
          timeSpentSeconds: z.number().int().min(0).max(7200),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const access = await getPracticeAccess(ctx.user.id);
        if (!access.canPractice) return { ...access, feedback: null, limitReached: true };
        const feedback = await submitPracticeAttempt(
          ctx.user.id,
          input.questionId,
          input.selectedAnswer,
          input.timeSpentSeconds,
        );
        const nextAccess = await getPracticeAccess(ctx.user.id);
        return { ...nextAccess, feedback, limitReached: false };
      }),
  }),
  billing: router({
    overview: protectedProcedure.query(({ ctx }) => getBillingOverview(ctx.user.id)),
    initializeProCheckout: protectedProcedure.mutation(({ ctx }) => initializeProCheckout(ctx.user.id)),
    verifyProCheckout: protectedProcedure
      .input(z.object({ reference: z.string().min(8).max(128) }))
      .mutation(({ ctx, input }) => verifyAndGrantProAccess(ctx.user.id, input.reference)),
    cancelSubscription: protectedProcedure.mutation(({ ctx }) => cancelProSubscription(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
