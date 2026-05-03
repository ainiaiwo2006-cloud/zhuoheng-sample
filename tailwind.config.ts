import type { Config } from "tailwindcss";

// ZHUOHENG palette — sourced from 饰品网站/jewelry-website.html prototype
// warm beige + warm dark brown + accent terracotta + tag wash
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CTF-style palette: pure white + black ink + red accent + deep-red footer
        bg: "#FFFFFF",           // page bg, pure white
        paper: "#FAFAFA",        // card hover surface
        sand: "#F5F5F3",         // ultra-soft alt fill
        wash: "#FBF7F2",         // hint of warmth where needed
        line: {
          DEFAULT: "#EDEDED",    // hairline border
          strong: "#D6D6D6",
        },
        ink: {
          DEFAULT: "#1A1A1A",    // primary text — near black
          soft: "#333333",
          mute: "#888888",       // secondary text
          faint: "#BFBFBF",
        },
        // Brand red — CTF uses ~#B30B1B for footer, ~#C8102E for accents
        red: {
          DEFAULT: "#C8102E",    // primary accent / price / featured nav
          deep: "#A30A22",       // hover
          dark: "#8B0716",       // footer bg
        },
        // Gold kept as light secondary accent for product imagery
        gold: {
          DEFAULT: "#C9A86A",
          deep: "#9A7D45",
          pale: "#E5D2A8",
        },
        success: "#5A8B5C",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        cn: ["var(--font-cn)", "var(--font-sans)", "sans-serif"],
        cnSerif: ["var(--font-cn-serif)", "var(--font-serif)", "serif"],
      },
      letterSpacing: {
        wide2: "0.08em",
        wide3: "0.16em",
        wide4: "0.3em",
        wide5: "0.5em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(44,36,32,0.04), 0 12px 40px rgba(44,36,32,0.06)",
        card: "0 1px 2px rgba(44,36,32,0.04), 0 8px 24px rgba(44,36,32,0.05)",
        ring: "0 0 0 1px rgba(44,36,32,0.1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "fade-in": "fade-in 0.9s ease-out both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)",
        "ticker": "ticker 50s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
