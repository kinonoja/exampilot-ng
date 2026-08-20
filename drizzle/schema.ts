import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const examTargetValues = ["JAMB", "WAEC", "NECO", "NABTEB"] as const;
export const userRoleValues = ["user", "teacher", "admin"] as const;
export const subscriptionStatusValues = ["free", "pro", "past_due", "cancelled"] as const;
export const difficultyValues = ["easy", "medium", "hard"] as const;
export const mockExamStatusValues = ["in_progress", "submitted", "expired"] as const;
export const paymentStatusValues = ["pending", "active", "failed", "cancelled", "expired"] as const;
export const planValues = ["free", "pro", "exam_intensive"] as const;
export const tutorModeValues = ["direct", "guided"] as const;

/** Core identity record supplied by Manus OAuth and enriched by student onboarding. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", userRoleValues).default("user").notNull(),
  examTarget: mysqlEnum("examTarget", examTargetValues),
  examYear: int("examYear"),
  subscriptionStatus: mysqlEnum("subscriptionStatus", subscriptionStatusValues)
    .default("free")
    .notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  paystackCustomerCode: varchar("paystackCustomerCode", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 32 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const subjects = mysqlTable(
  "subjects",
  {
    id: int("id").autoincrement().primaryKey(),
    examId: int("examId")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("subjects_exam_name_unique").on(table.examId, table.name),
    index("subjects_exam_idx").on(table.examId),
  ],
);

export const topics = mysqlTable(
  "topics",
  {
    id: int("id").autoincrement().primaryKey(),
    subjectId: int("subjectId")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("topics_subject_name_unique").on(table.subjectId, table.name),
    index("topics_subject_idx").on(table.subjectId),
  ],
);

export const questions = mysqlTable(
  "questions",
  {
    id: int("id").autoincrement().primaryKey(),
    examId: int("examId")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    subjectId: int("subjectId")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    topicId: int("topicId")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    year: int("year"),
    difficulty: mysqlEnum("difficulty", difficultyValues).notNull(),
    questionText: text("questionText").notNull(),
    options: json("options").$type<{ key: string; text: string }[]>().notNull(),
    correctAnswer: varchar("correctAnswer", { length: 8 }).notNull(),
    explanation: text("explanation").notNull(),
    source: varchar("source", { length: 255 }).notNull(),
    tags: json("tags").$type<string[]>().notNull(),
    isAIGenerated: boolean("isAIGenerated").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("questions_filter_idx").on(table.examId, table.subjectId, table.topicId, table.difficulty),
    index("questions_subject_idx").on(table.subjectId),
  ],
);

export const attempts = mysqlTable(
  "attempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: int("questionId")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    selectedAnswer: varchar("selectedAnswer", { length: 8 }).notNull(),
    isCorrect: boolean("isCorrect").notNull(),
    timeSpentSeconds: int("timeSpentSeconds").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("attempts_user_created_idx").on(table.userId, table.createdAt),
    index("attempts_question_idx").on(table.questionId),
  ],
);

export const mockExams = mysqlTable(
  "mock_exams",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: int("examId")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    subjectIds: json("subjectIds").$type<number[]>().notNull(),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    submittedAt: timestamp("submittedAt"),
    durationSeconds: int("durationSeconds").notNull(),
    currentQuestionPosition: int("currentQuestionPosition").default(1).notNull(),
    score: int("score"),
    status: mysqlEnum("status", mockExamStatusValues).default("in_progress").notNull(),
  },
  table => [index("mock_exams_user_idx").on(table.userId, table.startedAt)],
);

export const mockExamQuestions = mysqlTable(
  "mock_exam_questions",
  {
    id: int("id").autoincrement().primaryKey(),
    mockExamId: int("mockExamId")
      .notNull()
      .references(() => mockExams.id, { onDelete: "cascade" }),
    questionId: int("questionId")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    position: int("position").notNull(),
    selectedAnswer: varchar("selectedAnswer", { length: 8 }),
    isCorrect: boolean("isCorrect"),
    flagged: boolean("flagged").default(false).notNull(),
  },
  table => [
    uniqueIndex("mock_exam_question_unique").on(table.mockExamId, table.questionId),
    uniqueIndex("mock_exam_question_position_unique").on(table.mockExamId, table.position),
    index("mock_exam_questions_mock_idx").on(table.mockExamId),
  ],
);

export const studyPlans = mysqlTable(
  "study_plans",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    generatedAt: timestamp("generatedAt").defaultNow().notNull(),
    weakTopics: json("weakTopics").$type<{ topicId: number; accuracy: number }[]>().notNull(),
    recommendedActions: json("recommendedActions").$type<string[]>().notNull(),
    targetExamDate: timestamp("targetExamDate"),
  },
  table => [index("study_plans_user_idx").on(table.userId, table.generatedAt)],
);

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: mysqlEnum("plan", planValues).notNull(),
    paystackReference: varchar("paystackReference", { length: 128 }).unique(),
    paystackSubscriptionCode: varchar("paystackSubscriptionCode", { length: 128 }),
    paystackEmailToken: varchar("paystackEmailToken", { length: 128 }),
    amountKobo: int("amountKobo").notNull(),
    status: mysqlEnum("status", paymentStatusValues).notNull(),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"),
    autoRenew: boolean("autoRenew").default(false).notNull(),
  },
  table => [index("subscriptions_user_idx").on(table.userId, table.startedAt)],
);

export const tutorConversations = mysqlTable(
  "tutor_conversations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messages: json("messages").$type<{ role: "user" | "assistant"; content: string; createdAt: string }[]>().notNull(),
    topic: varchar("topic", { length: 255 }),
    mode: mysqlEnum("mode", tutorModeValues),
    inputTokens: int("inputTokens").default(0).notNull(),
    outputTokens: int("outputTokens").default(0).notNull(),
    estimatedCostMicrousd: int("estimatedCostMicrousd").default(0).notNull(),
    chargeableRequests: int("chargeableRequests").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("tutor_conversations_user_idx").on(table.userId, table.createdAt)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type QuestionOption = { key: string; text: string };
