import { describe, expect, it } from "vitest";
import { FUTURE_PRACTICE_BOARDS, LIVE_COVERAGE_COPY, LIVE_PRACTICE_BOARD, PRACTICE_MOCK_SCOPE_COPY, TUTOR_AVAILABILITY_COPY } from "./liveProductStatus";

describe("live product status copy", () => {
  it("states JAMB as the only currently live practice board", () => {
    expect(LIVE_PRACTICE_BOARD).toBe("JAMB");
    expect(FUTURE_PRACTICE_BOARDS).toEqual(["WAEC", "NECO", "NABTEB"]);
    expect(LIVE_COVERAGE_COPY).toContain("JAMB practice is currently live");
  });

  it("keeps mock scope and temporary Tutor availability honest", () => {
    expect(PRACTICE_MOCK_SCOPE_COPY).toContain("not the full JAMB format");
    expect(TUTOR_AVAILABILITY_COPY).toContain("when the learning service is online");
    expect(TUTOR_AVAILABILITY_COPY).toContain("Linked Practice questions");
  });
});
