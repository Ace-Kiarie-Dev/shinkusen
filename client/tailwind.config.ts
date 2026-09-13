import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#DC143C",
          black: "#0a0a0a",
          surface: "#111111",
          border: "#1e1e1e",
          muted: "#888888",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "clay-crimson":
          "0 8px 24px -6px rgba(220, 20, 60, 0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        clay: "0 8px 24px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
