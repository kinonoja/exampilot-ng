// Vitest loads this before every test file. The dev server gets its
// environment from `import "dotenv/config"` in server/_core/index.ts, but
// tests never pass through that entrypoint, so integration tests that read
// process.env directly (DATABASE_URL, PAYSTACK_SECRET_KEY) saw undefined.
// Loading the same .env here gives tests the same credentials as the dev
// server. Tests that don't need credentials are unaffected — mock-based
// tests mock the modules that consume env values.
import "dotenv/config";
