import { relations } from "drizzle-orm";
import {
  attempts,
  exams,
  mockExamQuestions,
  mockExams,
  questions,
  studyPlans,
  subjects,
  subscriptions,
  topics,
  tutorConversations,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  attempts: many(attempts),
  mockExams: many(mockExams),
  studyPlans: many(studyPlans),
  subscriptions: many(subscriptions),
  tutorConversations: many(tutorConversations),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  subjects: many(subjects),
  questions: many(questions),
  mockExams: many(mockExams),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  exam: one(exams, { fields: [subjects.examId], references: [exams.id] }),
  topics: many(topics),
  questions: many(questions),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, { fields: [topics.subjectId], references: [subjects.id] }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
  subject: one(subjects, { fields: [questions.subjectId], references: [subjects.id] }),
  topic: one(topics, { fields: [questions.topicId], references: [topics.id] }),
  attempts: many(attempts),
  mockExamQuestions: many(mockExamQuestions),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  user: one(users, { fields: [attempts.userId], references: [users.id] }),
  question: one(questions, { fields: [attempts.questionId], references: [questions.id] }),
}));

export const mockExamsRelations = relations(mockExams, ({ one, many }) => ({
  user: one(users, { fields: [mockExams.userId], references: [users.id] }),
  exam: one(exams, { fields: [mockExams.examId], references: [exams.id] }),
  questions: many(mockExamQuestions),
}));

export const mockExamQuestionsRelations = relations(mockExamQuestions, ({ one }) => ({
  mockExam: one(mockExams, { fields: [mockExamQuestions.mockExamId], references: [mockExams.id] }),
  question: one(questions, { fields: [mockExamQuestions.questionId], references: [questions.id] }),
}));

export const studyPlansRelations = relations(studyPlans, ({ one }) => ({
  user: one(users, { fields: [studyPlans.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const tutorConversationsRelations = relations(tutorConversations, ({ one }) => ({
  user: one(users, { fields: [tutorConversations.userId], references: [users.id] }),
}));

