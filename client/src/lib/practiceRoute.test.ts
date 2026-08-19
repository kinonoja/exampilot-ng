import { describe, expect, it } from "vitest";
import { topicIdFromSearch } from "./practiceRoute";

describe("topicIdFromSearch", () => {
  it("reads a valid generated-topic deep link from the browser search string", () => {
    expect(topicIdFromSearch("?topicId=45")).toBe(45);
  });

  it("ignores missing, zero, and malformed topic identifiers", () => {
    expect(topicIdFromSearch("")).toBeUndefined();
    expect(topicIdFromSearch("?topicId=0")).toBeUndefined();
    expect(topicIdFromSearch("?topicId=adaptation")).toBeUndefined();
  });
});
