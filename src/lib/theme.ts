// Design tokens for the travel log / technical drawing aesthetic
export const travelLogTheme = {
  colors: {
    paper: {
      bg: "#F4F0E6",
      grain: "#E8E2D2",
    },
    ink: {
      primary: "#2A211C",
      secondary: "#5C4F45",
      faint: "#A89F91",
    },
    pencil: {
      line: "#D6CEC0",
    },
    wash: {
      yellow: "rgba(249, 224, 118, 0.5)",
      red: "rgba(207, 168, 152, 0.6)",
    },
    highlight: {
      red: "#B56B5D",
    },
  },
  fonts: {
    serif: "'Cormorant Garamond', serif",
    mono: "'Space Mono', monospace",
  },
} as const;

export type TravelLogTheme = typeof travelLogTheme;
