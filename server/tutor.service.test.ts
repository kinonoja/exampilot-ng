import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  db: null as any,
  conversation: null as any,
  selectCalls: 0,
}));

vi.mock("./db", () => ({
  getDb: async () => state.db,
  getStudentProfile: async () => ({ id: 1, subscriptionStatus: "free", subscriptionExpiresAt: null }),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: async () => ({
    choices: [{ message: { content: "Let’s start with the key idea." } }],
    usage: { prompt_tokens: 120, completion_tokens: 24, total_tokens: 144 },
  }),
}));

import { sendTutorMessage } from "./tutor";

describe("Tutor Free allowance service flow", () => {
  beforeEach(() => {
    state.selectCalls = 0;
    state.conversation = {
      id: 9,
      userId: 1,
      topic: "Algebra",
      mode: null,
      messages: [{ role: "assistant", content: "Would you like the answer directly or should we work it out?", createdAt: "2026-08-19T08:00:00.000Z" }],
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostMicrousd: 0,
      chargeableRequests: 0,
    };
    state.db = {
      select: () => {
        const call = state.selectCalls++;
        if (call % 2 === 0) {
          return { from: () => ({ where: () => ({ limit: async () => [state.conversation] }) }) };
        }
        return { from: () => ({ where: async () => [{ chargeableRequests: state.conversation.chargeableRequests }] }) };
      },
      update: () => ({
        set: (values: Record<string, unknown>) => ({
          where: async () => Object.assign(state.conversation, values),
        }),
      }),
    };
  });

  it("persists a natural guided choice, avoids the repeat prompt, rejects a second academic message, and keeps caring boundaries available", async () => {
    await expect(sendTutorMessage(1, { conversationId: 9, message: "We should work together" })).resolves.toMatchObject({
      mode: "guided",
      usage: { inputTokens: 120, outputTokens: 24 },
    });
    expect(state.conversation.mode).toBe("guided");
    expect(state.conversation.messages.at(-1).content).not.toContain("Would you like the answer directly");

    await expect(sendTutorMessage(1, { conversationId: 9, message: "Can you give another example?" })).rejects.toThrow("used today’s Free Tutor question");

    await expect(sendTutorMessage(1, { conversationId: 9, message: "I feel hopeless and alone" })).resolves.toMatchObject({
      messages: expect.arrayContaining([expect.objectContaining({ role: "assistant", content: expect.stringContaining("trusted adult") })]),
    });
  });
});
