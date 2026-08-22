import { TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE } from "@shared/const";

export function isRetryableTransportError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const status = typeof error === "object" && error !== null && "data" in error
    ? Number((error as { data?: { httpStatus?: unknown } }).data?.httpStatus)
    : undefined;
  return /failed to fetch|networkerror|network request failed|load failed/i.test(message)
    || status === 502 || status === 503 || status === 504;
}

export function getStudentFacingError(error: unknown, fallback: string) {
  if (isRetryableTransportError(error)) {
    return "We could not reach ExamPilot just now. Check your connection and try again.";
  }
  const message = error instanceof Error ? error.message.trim() : "";
  return message || fallback;
}

export function getAssistantAvailabilityMessage(error: unknown, assistantName: "Tutor" | "Question generation") {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/usage exhausted|precondition failed|llm invoke failed/i.test(message)) {
    return TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE;
  }
  return getStudentFacingError(error, `${assistantName} is temporarily unavailable. Please try again later.`);
}
