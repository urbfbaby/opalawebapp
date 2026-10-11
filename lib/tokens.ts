/**
 * Opala Property Design Tokens
 * 
 * Approximate values derived from the Opala catalogue.
 * Centralised here so they can be easily refined when final brand assets arrive.
 */

export const colors = {
  navy: {
    DEFAULT: "#0A0B3D",
    deep: "#070828",
    muted: "#181A54",
    surface: "#101248",
    border: "rgba(255, 255, 255, 0.12)",
  },
  amber: {
    DEFAULT: "#FDB92F",
    hover: "#E8A725",
    muted: "#FFF5E0",
    border: "#F5B025",
  },
  bg: {
    DEFAULT: "#FAF8F5", // Warm off-white
    alt: "#F3EFEA",     // Slightly deeper warm neutral
    card: "#FFFFFF",
    placeholder: "#EAE6DF", // Warm grey for neutral image placeholder blocks
  },
  text: {
    DEFAULT: "#1F1F1F", // Charcoal body text
    muted: "#6B6864",   // Soft charcoal / warm secondary
    subtle: "#8E8B86",  // Subtle tertiary
    inverse: "#FAF8F5", // Text on navy
    inverseMuted: "rgba(250, 248, 245, 0.72)",
  },
  border: {
    DEFAULT: "#E5E1D8", // Thin divider lines
    subtle: "#EFECE6",
    navy: "rgba(255, 255, 255, 0.15)",
  },
} as const;

export const typography = {
  fonts: {
    heading: "var(--font-fraunces), Georgia, serif",
    body: "var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
  },
} as const;

export const radii = {
  sm: "2px",
  base: "4px",
  md: "4px",
} as const;
