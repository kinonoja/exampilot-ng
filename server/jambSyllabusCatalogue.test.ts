import { describe, expect, it } from "vitest";
import { approvedJambSyllabusCatalogue, findApprovedJambSubject, JAMB_OFFICIAL_SUBJECT_COUNT } from "./jambSyllabusCatalogue";

describe("approved JAMB syllabus catalogue", () => {
  it("contains the complete 25-subject official IBASS inventory", () => {
    expect(JAMB_OFFICIAL_SUBJECT_COUNT).toBe(25);
    expect(approvedJambSyllabusCatalogue.map(subject => subject.name)).toContain("Use of English");
    expect(new Set(approvedJambSyllabusCatalogue.map(subject => subject.name)).size).toBe(25);
  });

  it("preserves Use of English as the canonical official label while recognising the legacy English name", () => {
    expect(findApprovedJambSubject("Use of English")?.name).toBe("Use of English");
    expect(findApprovedJambSubject("English")?.name).toBe("Use of English");
  });

  it("contains at least one source-reconciled topic for every subject with no per-subject duplicates", () => {
    for (const subject of approvedJambSyllabusCatalogue) {
      expect(subject.topics.length).toBeGreaterThan(0);
      expect(new Set(subject.topics).size).toBe(subject.topics.length);
    }
  });
});
