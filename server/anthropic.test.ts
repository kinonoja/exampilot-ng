import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./_core/env", () => ({
  ENV: {
    anthropicApiKey: "test-key",
    anthropicTutorModel: "claude-test-tutor",
    anthropicGenerationModel: "claude-test-generation",
  },
}));

import { AnthropicError, invokeAnthropic, isTemporaryAnthropicAvailabilityError } from "./anthropic";

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: "status",
    headers: { get: () => null },
    json: async () => body,
    text: async () => JSON.stringify(body),
    body: undefined,
  }) as unknown as Response;

describe("invokeAnthropic request shape", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends x-api-key, anthropic-version, top-level system, and message history", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        content: [{ type: "text", text: "Hello there" }],
        usage: { input_tokens: 41, output_tokens: 7 },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await invokeAnthropic({
      system: "Be a tutor.",
      messages: [
        { role: "user", content: "Explain photosynthesis" },
        { role: "assistant", content: "Sure." },
        { role: "user", content: "Go deeper" },
      ],
      maxTokens: 100,
    });

    expect(result).toEqual({ text: "Hello there", inputTokens: 41, outputTokens: 7 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.method).toBe("POST");
    expect(init.headers["x-api-key"]).toBe("test-key");
    expect(init.headers["anthropic-version"]).toBe("2023-06-01");
    expect(init.headers["content-type"]).toBe("application/json");

    const body = JSON.parse(init.body);
    expect(body.system).toBe("Be a tutor.");
    expect(body.model).toBe("claude-test-tutor");
    expect(body.max_tokens).toBe(100);
    expect(body.messages).toEqual([
      { role: "user", content: "Explain photosynthesis" },
      { role: "assistant", content: "Sure." },
      { role: "user", content: "Go deeper" },
    ]);
  });

  it("forwards an explicit model and Anthropic output_config.format for structured output", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        content: [{ type: "text", text: "{\"questions\":[]}" }],
        usage: { input_tokens: 10, output_tokens: 5 },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await invokeAnthropic({
      system: "Generate questions.",
      messages: [{ role: "user", content: "Make five" }],
      maxTokens: 3200,
      model: "claude-test-generation",
      outputSchema: { type: "object", properties: {} },
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.model).toBe("claude-test-generation");
    expect(body.output_config).toEqual({
      format: { type: "object", properties: {} },
    });
  });

  it("throws an AnthropicError with the status for non-retryable failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ error: { message: "invalid x-api-key" } }, 401)
    );
    vi.stubGlobal("fetch", fetchMock);

    const error = await invokeAnthropic({
      system: "s",
      messages: [{ role: "user", content: "hi" }],
      maxTokens: 10,
    }).catch((error: unknown) => error);

    expect(error).toBeInstanceOf(AnthropicError);
    expect((error as AnthropicError).status).toBe(401);
  });
});

describe("isTemporaryAnthropicAvailabilityError", () => {
  it("treats 429, 5xx, overload, and network errors as temporary", () => {
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("rate limited", 429))).toBe(true);
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("api overloaded", 529))).toBe(true);
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("server error", 500))).toBe(true);
    expect(isTemporaryAnthropicAvailabilityError(new TypeError("fetch failed"))).toBe(true);
  });

  it("treats credential and configuration errors as not temporary", () => {
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("invalid key", 401))).toBe(false);
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("forbidden", 403))).toBe(false);
    expect(isTemporaryAnthropicAvailabilityError(new AnthropicError("model not found", 404))).toBe(false);
    expect(isTemporaryAnthropicAvailabilityError(new Error("some other error"))).toBe(false);
  });
});
