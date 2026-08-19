CREATE TABLE `attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` int NOT NULL,
	`selectedAnswer` varchar(8) NOT NULL,
	`isCorrect` boolean NOT NULL,
	`timeSpentSeconds` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exams_id` PRIMARY KEY(`id`),
	CONSTRAINT `exams_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `mock_exam_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mockExamId` int NOT NULL,
	`questionId` int NOT NULL,
	`selectedAnswer` varchar(8),
	`isCorrect` boolean,
	`flagged` boolean NOT NULL DEFAULT false,
	CONSTRAINT `mock_exam_questions_id` PRIMARY KEY(`id`),
	CONSTRAINT `mock_exam_question_unique` UNIQUE(`mockExamId`,`questionId`)
);
--> statement-breakpoint
CREATE TABLE `mock_exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`examId` int NOT NULL,
	`subjectIds` json NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`submittedAt` timestamp,
	`durationSeconds` int NOT NULL,
	`score` int,
	`status` enum('in_progress','submitted','expired') NOT NULL DEFAULT 'in_progress',
	CONSTRAINT `mock_exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`subjectId` int NOT NULL,
	`topicId` int NOT NULL,
	`year` int,
	`difficulty` enum('easy','medium','hard') NOT NULL,
	`questionText` text NOT NULL,
	`options` json NOT NULL,
	`correctAnswer` varchar(8) NOT NULL,
	`explanation` text NOT NULL,
	`source` varchar(255) NOT NULL,
	`tags` json NOT NULL,
	`isAIGenerated` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`weakTopics` json NOT NULL,
	`recommendedActions` json NOT NULL,
	`targetExamDate` timestamp,
	CONSTRAINT `study_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjects_exam_name_unique` UNIQUE(`examId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','pro','exam_intensive') NOT NULL,
	`paystackReference` varchar(128),
	`paystackSubscriptionCode` varchar(128),
	`amountKobo` int NOT NULL,
	`status` enum('pending','active','failed','cancelled','expired') NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`autoRenew` boolean NOT NULL DEFAULT false,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_paystackReference_unique` UNIQUE(`paystackReference`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `topics_subject_name_unique` UNIQUE(`subjectId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `tutor_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`messages` json NOT NULL,
	`topic` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tutor_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','teacher','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `examTarget` enum('JAMB','WAEC','NECO','NABTEB');--> statement-breakpoint
ALTER TABLE `users` ADD `examYear` int;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('free','pro','past_due','cancelled') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `paystackCustomerCode` varchar(128);--> statement-breakpoint
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mock_exam_questions` ADD CONSTRAINT `mock_exam_questions_mockExamId_mock_exams_id_fk` FOREIGN KEY (`mockExamId`) REFERENCES `mock_exams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mock_exam_questions` ADD CONSTRAINT `mock_exam_questions_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mock_exams` ADD CONSTRAINT `mock_exams_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mock_exams` ADD CONSTRAINT `mock_exams_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_subjectId_subjects_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_plans` ADD CONSTRAINT `study_plans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topics` ADD CONSTRAINT `topics_subjectId_subjects_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutor_conversations` ADD CONSTRAINT `tutor_conversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `attempts_user_created_idx` ON `attempts` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `attempts_question_idx` ON `attempts` (`questionId`);--> statement-breakpoint
CREATE INDEX `mock_exam_questions_mock_idx` ON `mock_exam_questions` (`mockExamId`);--> statement-breakpoint
CREATE INDEX `mock_exams_user_idx` ON `mock_exams` (`userId`,`startedAt`);--> statement-breakpoint
CREATE INDEX `questions_filter_idx` ON `questions` (`examId`,`subjectId`,`topicId`,`difficulty`);--> statement-breakpoint
CREATE INDEX `questions_subject_idx` ON `questions` (`subjectId`);--> statement-breakpoint
CREATE INDEX `study_plans_user_idx` ON `study_plans` (`userId`,`generatedAt`);--> statement-breakpoint
CREATE INDEX `subjects_exam_idx` ON `subjects` (`examId`);--> statement-breakpoint
CREATE INDEX `subscriptions_user_idx` ON `subscriptions` (`userId`,`startedAt`);--> statement-breakpoint
CREATE INDEX `topics_subject_idx` ON `topics` (`subjectId`);--> statement-breakpoint
CREATE INDEX `tutor_conversations_user_idx` ON `tutor_conversations` (`userId`,`createdAt`);