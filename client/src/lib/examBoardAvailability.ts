export type ExamBoard = "JAMB" | "WAEC" | "NECO" | "NABTEB";

export type ExamBoardAvailability = {
  board: ExamBoard;
  status: "live" | "coming_soon" | "authorised_source_required";
  title: string;
  description: string;
};

export const EXAM_BOARD_AVAILABILITY: ExamBoardAvailability[] = [
  { board: "JAMB", status: "live", title: "JAMB practice is live", description: "Choose a current JAMB subject, topic, and difficulty." },
  { board: "WAEC", status: "coming_soon", title: "WAEC practice is coming soon", description: "Original reviewed WAEC-style samples are held for explicit human approval before any content is imported." },
  // Do not add NECO content until an authorised syllabus or written permission is available.
  { board: "NECO", status: "authorised_source_required", title: "NECO preparation is pending authorised source material", description: "ExamPilot will not create or import NECO practice until official subject evidence is authorised." },
  // Do not add NABTEB content until an authorised syllabus or written permission is available.
  { board: "NABTEB", status: "authorised_source_required", title: "NABTEB preparation is pending authorised source material", description: "ExamPilot will not create or import NABTEB practice until official subject evidence is authorised." },
];

export function getExamBoardAvailability(board: ExamBoard) {
  return EXAM_BOARD_AVAILABILITY.find(item => item.board === board) ?? EXAM_BOARD_AVAILABILITY[0];
}
