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
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          600: "#d4af37",
          700: "#b8860b",
          800: "#926207",
          950: "#422006",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        inter: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
