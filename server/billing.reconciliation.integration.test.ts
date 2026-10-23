import crypto from "crypto";
import mysql from "mysql2/promise";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { recordVerifiedProPayment } from "./billing";
import { closeDb } from "./db";

const createdUserIds: number[] = [];

// Shared connection opened once so the TiDB Serverless TLS handshake and any
// resume-from-idle delay land in beforeAll (under hookTimeout) instead of
// inside the timed test.
let connection: mysql.Connection;

beforeAll(async () => {
  connection = await mysql.createConnection(process.env.DATABASE_URL!);
  await connection.execute("SELECT 1");
}, 30_000);

afterEach(async () => {
  for (const userId of createdUserIds.splice(0)) {
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
  }
});

afterAll(async () => {
  await connection.end();
  // recordVerifiedProPayment lazily opens a drizzle pool via getDb(); close it
  // so the worker does not exit with a leaked socket.
  await closeDb();
});

describe("Paystack recurring subscription reconciliation", () => {
  it(
    "attaches a verified charge to the just-created recurring subscription row instead of creating a duplicate",
    async () => {
      const suffix = crypto.randomUUID().replaceAll("-", "");
      const reference = `ep.reconcile.${suffix}`;
      const [userResult] = await connection.execute<mysql.ResultSetHeader>(
        "INSERT INTO users (openId, email, subscriptionStatus) VALUES (?, ?, 'free')",
        [`billing-reconcile-${suffix}`, `billing-reconcile-${suffix}@example.com`],
      );
      const userId = Number(userResult.insertId);
      createdUserIds.push(userId);
      await connection.execute(
        "INSERT INTO subscriptions (userId, plan, amountKobo, status, autoRenew) VALUES (?, 'pro', 150000, 'active', 1)",
        [userId],
      );

      await recordVerifiedProPayment({
        userId,
        reference,
        amountKobo: 150_000,
        paidAt: new Date().toISOString(),
      });

      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) AS rowCount, SUM(paystackReference = ?) AS referenceCount FROM subscriptions WHERE userId = ?",
        [reference, userId],
      );
      expect(Number(rows[0].rowCount)).toBe(1);
      expect(Number(rows[0].referenceCount)).toBe(1);
    },
    // The remaining round trips still cross the ocean to TiDB Serverless, so
    // give the test room beyond vitest's 5s default.
    30_000,
  );
});
