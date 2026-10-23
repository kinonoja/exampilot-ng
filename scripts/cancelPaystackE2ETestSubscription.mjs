import { cancelProSubscription } from "../server/paystack.ts";

const userId = Number(process.env.PAYSTACK_E2E_USER_ID);
if (!Number.isInteger(userId) || userId <= 0) throw new Error("PAYSTACK_E2E_USER_ID must be a positive integer.");
const outcome = await cancelProSubscription(userId);
console.log(JSON.stringify({ userId, ...outcome }, null, 2));
