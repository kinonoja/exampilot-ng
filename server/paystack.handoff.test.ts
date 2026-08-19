import { describe, expect, it } from "vitest";
import { getPaystackSuccessReference } from "../client/src/lib/paystackClient";

describe("Paystack checkout handoff", () => {
  it("passes the Popup success reference to the server verification mutation", () => {
    expect(getPaystackSuccessReference({ reference: "pstk_success_reference" }, "server_initialized_reference")).toBe("pstk_success_reference");
  });

  it("retains a server-created reference as the safe fallback", () => {
    expect(getPaystackSuccessReference({}, "server_initialized_reference")).toBe("server_initialized_reference");
  });
});
