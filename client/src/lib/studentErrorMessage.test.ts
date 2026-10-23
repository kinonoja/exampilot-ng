import { describe, expect, it } from "vitest";
import { TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE } from "@shared/const";
import { getAssistantAvailabilityMessage, getStudentFacingError, isRetryableTransportError } from "./studentErrorMessage";

describe("student error messages", () => {
  it("identifies retryable transport failures without treating server validation as transport loss", () => {
    expect(isRetryableTransportError(new Error("Failed to fetch"))).toBe(true);
    expect(isRetryableTransportError({ data: { httpStatus: 502 } })).toBe(true);
    expect(isRetryableTransportError(new Error("Too big: expected array to have <=3 items"))).toBe(false);
  });

  it("translates exhausted LLM capacity into a safe student message", () => {
    expect(getAssistantAvailabilityMessage(new Error("LLM invoke failed: 412 Precondition Failed – usage exhausted"), "Tutor")).toBe(TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE);
    expect(getAssistantAvailabilityMessage(new Error("usage exhausted"), "Question generation")).toBe(TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE);
  });

  it("preserves the server availability message even when tRPC attaches HTTP 503 metadata", () => {
    const error = Object.assign(new Error(TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE), { data: { httpStatus: 503 } });
    expect(getAssistantAvailabilityMessage(error, "Tutor")).toBe(TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE);
  });

  it("keeps a direct server message only when it is not a transport failure", () => {
    expect(getStudentFacingError(new Error("A valid topic is required."), "Fallback")).toBe("A valid topic is required.");
  });
});
