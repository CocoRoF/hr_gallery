import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* ── Match hr_blog2.0 design tokens ── */
        "bg-primary": "#06060e",
        "bg-secondary": "#0d0d1a",
        "bg-card": "#111128",
        "bg-card-hover": "#16163a",
        border: "#1e1e3a",
        "border-hover": "#2d2d5e",
        "text-primary": "#e8e8f0",
        "text-secondary": "#8888aa",
        "text-muted": "#555577",
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          cyan: "#22d3ee",
          violet: "#a855f7",
        },
        glow: "rgba(99, 102, 241, 0.15)",
        /* ── Library brand colors ── */
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
        anweb: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
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
