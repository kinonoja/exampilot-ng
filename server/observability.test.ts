import { describe, expect, it } from "vitest";
import { createCriticalFlowLog, getCriticalProcedurePaths } from "./observability";

describe("critical flow observability", () => {
  it("selects only the intended learner-flow procedure paths", () => {
    expect(getCriticalProcedurePaths("/practice.next,tutor.send,auth.me,courseDirection.get")).toEqual(["practice.next", "tutor.send", "courseDirection.get"]);
  });

  it("creates a structured correlation-safe event without request payload fields", () => {
    expect(createCriticalFlowLog({ requestId: "req_test", pathname: "/billing.overview", statusCode: 200, durationMs: 12.7 })).toEqual({
      event: "exampilot.critical_flow",
      requestId: "req_test",
      procedures: ["billing.overview"],
      statusCode: 200,
      durationMs: 13,
    });
    expect(createCriticalFlowLog({ requestId: "req_test", pathname: "/auth.me", statusCode: 200, durationMs: 1 })).toBeNull();
  });
});
