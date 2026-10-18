import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vanta: {
          black: "#000000",
          deep: "#050508",
          dark: "#0a0a0c",
          surface: "#121217",
        },
        neon: {
          red: "#ff073a",
          "red-bright": "#ff0033",
          blood: "#800010",
          indigo: "#6366f1",
          purple: "#a855f7",
          cyan: "#00f0ff",
        },
        glass: {
          surface: "rgba(12, 12, 16, 0.65)",
          frame: "rgba(14, 14, 22, 0.75)",
          border: "rgba(255, 255, 255, 0.12)",
          specular: "rgba(255, 255, 255, 0.28)",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
      backdropBlur: {
        xs: "2px",
        ultra: "36px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-fade": "glowFade 3s ease-in-out infinite alternate",
      },
      screens: {
        xs: "380px",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)",
      },
      keyframes: {
        glowFade: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.8", filter: "blur(30px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
