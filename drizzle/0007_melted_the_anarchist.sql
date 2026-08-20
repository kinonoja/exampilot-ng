ALTER TABLE `users` ADD `courseKey` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `targetInstitutionName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `institutionPlanningStatus` enum('not_sure','provided') DEFAULT 'not_sure' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `institutionValidationStatus` enum('not_checked','verified') DEFAULT 'not_checked' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `coursePreferenceUpdatedAt` timestamp;