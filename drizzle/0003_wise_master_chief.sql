ALTER TABLE `tutor_conversations` ADD `mode` enum('direct','guided');--> statement-breakpoint
ALTER TABLE `tutor_conversations` ADD `inputTokens` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tutor_conversations` ADD `outputTokens` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tutor_conversations` ADD `estimatedCostMicrousd` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tutor_conversations` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `tutor_conversations` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;
