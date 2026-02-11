export type Mode = "red" | "green" | "blue";

export const modeConfig = {
  red: {
    bg: "#5C1A1A",
    accent: "#943C3C",
    label: "Food & Travel",
  },
  green: {
    bg: "#1B3328",
    accent: "#3A6B4F",
    label: "Sports",
  },
  blue: {
    bg: "#1B2541",
    accent: "#3A4F6B",
    label: "Work & Intellect",
  },
} as const;
