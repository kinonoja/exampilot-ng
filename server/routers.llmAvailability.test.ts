import { describe, expect, it } from "vitest";
import { isExhaustedLLMError } from "./routers";

describe("LLM availability boundary", () => {
  it("recognises the observed 412 usage-exhausted transport failure", () => {
    expect(isExhaustedLLMError(new Error("LLM invoke failed: 412 Precondition Failed – {\"code\":9,\"message\":\"your account has hit a usage exhausted\"}"))).toBe(true);
  });

  it("does not conceal unrelated validation failures", () => {
    expect(isExhaustedLLMError(new Error("Choose an available topic before generating practice."))).toBe(false);
  });
});
