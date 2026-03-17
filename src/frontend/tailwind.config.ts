import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0d1117",
          50: "#161b22",
          100: "#1c2128",
          200: "#21262d",
          300: "#30363d",
          400: "#484f58",
          500: "#6e7681",
        },
        accent: {
          DEFAULT: "#58a6ff",
          dark: "#1f6feb",
          light: "#79c0ff",
        },
        googer: {
          DEFAULT: "#f97316",
          dark: "#ea580c",
          light: "#fb923c",
        },
        f2a: {
          DEFAULT: "#a855f7",
          dark: "#9333ea",
          light: "#c084fc",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
