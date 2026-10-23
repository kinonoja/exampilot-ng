import { describe, expect, it } from "vitest";
import { EXAM_BOARD_AVAILABILITY, getExamBoardAvailability } from "./examBoardAvailability";

describe("exam board availability", () => {
  it("keeps JAMB as the only live practice board", () => {
    expect(EXAM_BOARD_AVAILABILITY.filter(item => item.status === "live").map(item => item.board)).toEqual(["JAMB"]);
  });

  it("keeps WAEC approval-gated and NECO/NABTEB source-gated", () => {
    expect(getExamBoardAvailability("WAEC").status).toBe("coming_soon");
    expect(getExamBoardAvailability("NECO").status).toBe("authorised_source_required");
    expect(getExamBoardAvailability("NABTEB").status).toBe("authorised_source_required");
  });
});
