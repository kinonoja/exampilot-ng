export const examPilotDesignTokens = {
  color: {
    canvas: "#F4F7F8",
    surface: "#FFFFFF",
    ink: "#162235",
    muted: "#607082",
    primary: "#245EA8",
    secondary: "#163A5F",
    success: "#16775A",
    status: "#B5473A",
    border: "#DDE5EA",
  },
  type: {
    display: "Outfit",
    body: "Manrope",
    scale: [12, 14, 16, 18, 24, 32, 40, 48],
  },
  layout: { space: [4, 8, 12, 16, 24, 32, 48, 64], cardRadius: 12, featureRadius: 16 },
  icon: { inline: 16, control: 20, marker: 24, strokeWidth: 1.8 },
  signatureElement: "Mastery Rail — a composed sequence of study checkpoints that visualises Focus, Practice, and Ready.",
} as const;
