import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        opala: {
          bg: "#FAF8F5",
          bgAlt: "#F3EFEA",
          card: "#FFFFFF",
          placeholder: "#EAE6DF",
          charcoal: "#1F1F1F",
          muted: "#6B6864",
          subtle: "#8E8B86",
          border: "#E5E1D8",
          borderSubtle: "#EFECE6",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "4px",
      },
      spacing: {
        "18": "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
