import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ensurePracticeCatalogue } from "./catalog";
import { getBillingOverview } from "./billing";
import {
  getDailyAttemptCount,
  getPracticeFilters,
  getRandomPracticeQuestion,
  getStudentProfile,
  submitPracticeAttempt,
  updateStudentCoursePreference,
  updateStudentProfile,
} from "./db";
import { COOKIE_NAME, TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { cancelProSubscription, initializeProCheckout, verifyAndGrantProAccess } from "./paystack";
import { getPracticeEntitlement } from "./entitlements";
import { sendTutorMessage, startTutorConversation } from "./tutor";
import { generateTopicPracticeQuestions } from "./practiceGeneration";
import { mockExamRouter } from "./mockExamRouter";
import { COURSE_VERIFICATION_COPY, COURSE_VERIFICATION_DETAIL, JAMB_IBASS_ELIGIBILITY_URL, getInternalCourse, internalCourseCatalogue } from "./courseCatalogue";

const profileInput = z.object({
  examTarget: z.enum(["JAMB", "WAEC", "NECO", "NABTEB"]),
  examYear: z.number().int().min(2026).max(2035),
});

const coursePreferenceInput = z.discriminatedUnion("institutionPlanningStatus", [
  z.object({
    courseKey: z.string().min(1).max(128),
    institutionPlanningStatus: z.literal("not_sure"),
  }),
  z.object({
    courseKey: z.string().min(1).max(128),
    institutionPlanningStatus: z.literal("provided"),
    targetInstitutionName: z.string().trim().min(2).max(255),
  }),
]);

export function isExhaustedLLMError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /usage exhausted|precondition failed|llm invoke failed/i.test(message);
}

async function withLLMAvailabilityBoundary<T>(work: () => Promise<T>, feature: "Tutor" | "Question generation") {
  try {
    return await work();
  } catch (error) {
    if (isExhaustedLLMError(error)) {
      throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE });
    }
    throw error;
  }
}

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
  courseDirection: router({
    catalogue: protectedProcedure.query(() => ({
      courses: internalCourseCatalogue,
      verificationCopy: COURSE_VERIFICATION_COPY,
      verificationDetail: COURSE_VERIFICATION_DETAIL,
      ibassEligibilityUrl: JAMB_IBASS_ELIGIBILITY_URL,
    })),
    get: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getStudentProfile(ctx.user.id);
      const course = profile?.courseKey ? getInternalCourse(profile.courseKey) : undefined;
      return {
        profile,
        course: course ?? null,
        subjectDefault: null as null,
        validationMessage: "No practice subjects have been selected from this course yet.",
      };
    }),
    save: protectedProcedure.input(coursePreferenceInput).mutation(async ({ ctx, input }) => {
      const course = getInternalCourse(input.courseKey);
      if (!course) throw new Error("Choose a course from the ExamPilot course catalogue.");
      const profile = await updateStudentCoursePreference(ctx.user.id, {
        courseKey: course.key,
        institutionPlanningStatus: input.institutionPlanningStatus,
        targetInstitutionName: input.institutionPlanningStatus === "provided" ? input.targetInstitutionName : null,
      });
      return {
        profile,
        course,
        subjectDefault: null as null,
        validationMessage: "No practice subjects have been selected from this course yet.",
      };
    }),
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
    generate: protectedProcedure
      .input(z.object({ topicId: z.number().int().positive(), count: z.number().int().min(3).max(5).default(3) }))
      .mutation((opts) => withLLMAvailabilityBoundary(() => generateTopicPracticeQuestions(opts.input), "Question generation")),
  }),
  mock: mockExamRouter,
  billing: router({
    overview: protectedProcedure.query(({ ctx }) => getBillingOverview(ctx.user.id)),
    initializeProCheckout: protectedProcedure.mutation(({ ctx }) => initializeProCheckout(ctx.user.id)),
    verifyProCheckout: protectedProcedure
      .input(z.object({ reference: z.string().min(8).max(128) }))
      .mutation(({ ctx, input }) => verifyAndGrantProAccess(ctx.user.id, input.reference)),
    cancelSubscription: protectedProcedure.mutation(({ ctx }) => cancelProSubscription(ctx.user.id)),
  }),
  tutor: router({
    start: protectedProcedure
      .input(z.object({ topic: z.string().trim().min(2).max(255).optional(), questionId: z.number().int().positive().optional() }))
      .mutation(({ ctx, input }) => withLLMAvailabilityBoundary(() => startTutorConversation(ctx.user.id, input), "Tutor")),
    send: protectedProcedure
      .input(z.object({ conversationId: z.number().int().positive(), message: z.string().trim().min(1).max(2000), questionId: z.number().int().positive().optional() }))
      .mutation(({ ctx, input }) => withLLMAvailabilityBoundary(() => sendTutorMessage(ctx.user.id, input), "Tutor")),
  }),
});

export type AppRouter = typeof appRouter;
