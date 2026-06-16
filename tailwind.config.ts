import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 20px 80px -30px rgb(15 23 42 / 0.32)",
        glow: "0 24px 90px -42px rgb(14 165 233 / 0.65)",
      },
      colors: {
        ink: "#111827",
        mist: "#f7f5f1",
        citrus: "#d6ff62",
        ocean: "#3b82f6",
        clay: "#cc7351",
        ember: "#ff7a45",
      },
      backgroundImage: {
        "fine-grid":
          "linear-gradient(rgb(148 163 184 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(148 163 184 / 0.12) 1px, transparent 1px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
