import { createExamPilotApiApp } from "../server/_core/app";

// Vercel maps every /api/* request to this serverless entry point. Exporting
// the shared Express app preserves the existing relative /api/trpc, OAuth,
// storage-proxy, and raw-body Paystack webhook routes without a second router.
export default createExamPilotApiApp();
