import type { Config } from "tailwindcss";

const config: Config = {
  // 클래스 기반 다크 모드 — <html className="dark"> 일 때 .dark 변형 활성
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* ── 디자인 토큰 — CSS 변수 (RGB triplet) 로 추상화.
              실제 값은 globals.css 의 :root (light) / .dark (dark) 에 정의됨.
              hr_blog2.0 과 동일 토큰 이름을 유지해 시각적 일치성 보장.

              <alpha-value> 패턴: bg-bg-primary/50 같은 alpha 변형이
              Tailwind v3 에서 자동 동작하도록 함. ── */
        "bg-primary": "rgb(var(--color-bg-primary) / <alpha-value>)",
        "bg-secondary": "rgb(var(--color-bg-secondary) / <alpha-value>)",
        "bg-card": "rgb(var(--color-bg-card) / <alpha-value>)",
        "bg-card-hover": "rgb(var(--color-bg-card-hover) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-hover": "rgb(var(--color-border-hover) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          light: "rgb(var(--color-accent-light) / <alpha-value>)",
          cyan: "rgb(var(--color-accent-cyan) / <alpha-value>)",
          violet: "rgb(var(--color-accent-violet) / <alpha-value>)",
        },
        glow: "var(--color-glow)",
        /* ── Library brand colors — 테마와 무관, 고정 hex ── */
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
