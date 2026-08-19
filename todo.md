# Project TODO

- [x] Establish the ExamPilot NG project structure and mobile-first design system
- [x] Extend the Drizzle schema with exam, subject, topic, question, attempt, mock exam, study plan, subscription, and tutor conversation entities
- [x] Add student profile fields for exam target, exam year, and subscription status
- [x] Generate and apply the database migration for the extended schema
- [x] Add approximately 50 originally authored JAMB practice questions across Mathematics, English, and Biology
- [x] Wire the catalogue seeder into the practice flow and verify the database contains the expected question bank
- [x] Implement student profile setup and authenticated navigation
- [x] Implement filterable practice mode by exam, subject, topic, and difficulty
- [x] Implement immediate answer feedback, explanations, and attempt logging
- [x] Enforce the Free tier five-question daily limit and contextual upgrade prompt
- [x] Implement Paystack transaction initialization and server-side verification
- [x] Wire the Paystack Popup success callback to automatic server-side verification and entitlement refresh
- [x] Implement the exact /api/webhooks/paystack endpoint with HMAC SHA-512 validation and subscription event handling
- [x] Implement the billing page with plan, next billing date, cancellation, and payment history
- [x] Build the mobile-first landing page and authenticated student dashboard
- [x] Add and run Vitest coverage for core business rules
- [x] Validate the interface on desktop and mobile previews
