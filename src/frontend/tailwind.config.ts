import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0e14",
          50: "#111820",
          100: "#171e28",
          200: "#1d2530",
          300: "#2a3240",
          400: "#3d4756",
          500: "#5a6577",
          600: "#8b95a5",
        },
        accent: {
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
          light: "#60a5fa",
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
        contextifier: {
          DEFAULT: "#10b981",
          dark: "#059669",
          light: "#34d399",
        },
        playleft: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [],
};

export default config;
