import crypto from "crypto";
import mysql from "mysql2/promise";
import { afterEach, describe, expect, it } from "vitest";
import { recordVerifiedProPayment } from "./billing";

const createdUserIds: number[] = [];

afterEach(async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    for (const userId of createdUserIds.splice(0)) {
      await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
    }
  } finally {
    await connection.end();
  }
});

describe("Paystack recurring subscription reconciliation", () => {
  it("attaches a verified charge to the just-created recurring subscription row instead of creating a duplicate", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const suffix = crypto.randomUUID().replaceAll("-", "");
    const reference = `ep.reconcile.${suffix}`;
    try {
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
    } finally {
      await connection.end();
    }
  });
});
