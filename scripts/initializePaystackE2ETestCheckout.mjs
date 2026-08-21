import crypto from "node:crypto";
import mysql from "mysql2/promise";
import { initializeProCheckout } from "../server/paystack.ts";

const runId = crypto.randomUUID().replaceAll("-", "");
const email = `paystack-e2e-${runId.slice(0, 12)}@example.com`;
const openId = `paystack-e2e-${runId.slice(0, 40)}`;

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [result] = await connection.execute(
    "INSERT INTO users (openId, name, email, loginMethod, role, examTarget, examYear, subscriptionStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [openId, "Paystack Test Mode Learner", email, "paystack-test", "user", "JAMB", 2026, "free"],
  );
  const userId = Number(result.insertId);
  if (!Number.isInteger(userId) || userId <= 0) throw new Error("The isolated Test Mode learner could not be created.");

  const checkout = await initializeProCheckout(userId);
  console.log(JSON.stringify({
    runId,
    userId,
    email,
    subscriptionStatusBefore: "free",
    reference: checkout.reference,
    accessCode: checkout.accessCode,
    authorizationUrl: `https://checkout.paystack.com/${checkout.accessCode}`,
  }, null, 2));
} finally {
  await connection.end();
}
