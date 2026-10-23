import { ENV } from "./_core/env";

// Direct Anthropic Messages API client for Tutor and practice generation.
// Replaces the Forge-backed OpenAI-compatible transport; the learner-facing
// prompts, policy boundaries, and validation in tutor.ts and
// practiceGeneration.ts are unchanged.

export type AnthropicMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AnthropicInvocation = {
  system: string;
  messages: AnthropicMessage[];
  maxTokens: number;
  model?: string;
  outputSchema?: Record<string, unknown>;
};

export type AnthropicTextResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export class AnthropicError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AnthropicError";
    this.status = status;
  }
}

export function isTemporaryAnthropicAvailabilityError(error: unknown): boolean {
  if (error instanceof AnthropicError) {
    // 401/403/404 are credential/config errors the user must fix, not
    // temporary provider conditions. 408/429/5xx and overloaded errors are
    // retryable unavailability.
    return (
      error.status === undefined ||
      error.status === 408 ||
      error.status === 429 ||
      error.status >= 500
    );
  }
  // Network-level failures (fetch rejects) map to temporary unavailability.
  return error instanceof TypeError;
}

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const RETRY_MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 500;
const RETRY_MAX_DELAY_MS = 30_000;

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const parseRetryAfter = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
};

// Equal-jitter exponential backoff, mirroring the retry policy the previous
// Forge client used so provider behaviour stays consistent for learners.
const computeBackoffDelay = (
  attempt: number,
  retryAfterMs?: number
): number => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};

type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

// Retries retryable non-2xx responses and network errors with exponential
// backoff, then returns the final Response so callers keep their own error
// handling for terminal statuses.
const fetchWithBackoff = async (
  url: string,
  init: FetchInit
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, init);
      const retryable =
        response.status === 408 || response.status === 429 || response.status >= 500;
      if (response.ok || !retryable || attempt === RETRY_MAX_RETRIES) {
        return response;
      }

      const retryAfterMs = parseRetryAfter(
        response.headers.get("retry-after")
      );
      try {
        await response.body?.cancel();
      } catch {
        // Body already settled; nothing to clean up.
      }
      console.warn(
        `Anthropic request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after status ${response.status}`
      );
      await sleep(computeBackoffDelay(attempt, retryAfterMs));
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      console.warn(
        `Anthropic request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after network error`
      );
      await sleep(computeBackoffDelay(attempt));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Anthropic request failed after exhausting retries");
};

const extractText = (content: unknown): string => {
  if (!Array.isArray(content)) return "";
  return content
    .filter((part): part is { type: "text"; text: string } =>
      typeof part === "object" &&
      part !== null &&
      (part as { type?: unknown }).type === "text" &&
      typeof (part as { text?: unknown }).text === "string"
    )
    .map(part => part.text)
    .join("\n")
    .trim();
};

export async function invokeAnthropic(
  params: AnthropicInvocation
): Promise<AnthropicTextResult> {
  if (!ENV.anthropicApiKey) {
    throw new AnthropicError("ANTHROPIC_API_KEY is not configured");
  }

  const payload: Record<string, unknown> = {
    model: params.model ?? ENV.anthropicTutorModel,
    max_tokens: params.maxTokens,
    system: params.system,
    messages: params.messages,
  };

  if (params.outputSchema) {
    payload.output_config = { format: params.outputSchema };
  }

  const response = await fetchWithBackoff(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ENV.anthropicApiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AnthropicError(
      `Anthropic invoke failed: ${response.status} ${response.statusText} – ${errorText}`,
      response.status
    );
  }

  const body = (await response.json()) as {
    content?: unknown;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  return {
    text: extractText(body.content),
    inputTokens: body.usage?.input_tokens ?? 0,
    outputTokens: body.usage?.output_tokens ?? 0,
  };
}
