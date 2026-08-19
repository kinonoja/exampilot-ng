import { describe, expect, it } from "vitest";
import { getPaystackSuccessReference } from "./paystackClient";

describe("Paystack success handoff", () => {
  it("uses the reference returned from the Popup callback for server verification", () => {
    expect(getPaystackSuccessReference({ reference: "pstk_live_reference" }, "initialized_reference")).toBe("pstk_live_reference");
  });

  it("uses the server-created reference when an older callback provides trxref or no reference", () => {
    expect(getPaystackSuccessReference({ trxref: "legacy_reference" }, "initialized_reference")).toBe("legacy_reference");
    expect(getPaystackSuccessReference({}, "initialized_reference")).toBe("initialized_reference");
  });
});
