import { describe, expect, it } from "vitest";
import { getClampedCountdown } from "./mockTimer";

describe("getClampedCountdown", () => {
  it("never displays more time than the configured mock duration when the client clock is behind", () => {
    expect(getClampedCountdown("2026-08-20T00:10:00.000Z", 600, new Date("2026-08-20T00:09:58.000Z").getTime())).toBe(600);
  });

  it("reaches zero at and after the configured deadline", () => {
    expect(getClampedCountdown("2026-08-20T00:10:00.000Z", 600, new Date("2026-08-20T00:20:00.000Z").getTime())).toBe(0);
  });
});
