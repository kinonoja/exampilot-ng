import { describe, expect, it } from "vitest";
import { TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE } from "@shared/const";
import { shouldLogApiError } from "./apiErrorLogging";

describe("API error logging", () => {
  it("does not log the already-rendered temporary assistant availability state", () => {
    expect(shouldLogApiError(new Error(TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE))).toBe(false);
  });

  it("continues to log unexpected API errors", () => {
    expect(shouldLogApiError(new Error("Unexpected server failure"))).toBe(true);
  });
});
