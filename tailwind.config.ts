import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PSC GOLD/AMBER — primary brand + platform actions / highlights.
        psc: {
          DEFAULT: "#F5A623",
          light: "#FBBF4D",
          dark: "#C77F0E",
          tint: "#FEF6E7",
        },
        // ICTAM RED — authority / official / admin surfaces.
        ictam: {
          DEFAULT: "#E11D2A",
          light: "#F2535E",
          dark: "#B0151F",
          tint: "#FEECEC",
        },
        // Supporting blue — links / secondary, used sparingly.
        brandblue: {
          DEFAULT: "#1D4ED8",
          light: "#3B82F6",
          tint: "#EAF0FE",
        },
        // Verified green — tuned for light backgrounds.
        verified: {
          DEFAULT: "#16A34A",
          light: "#22C55E",
          dark: "#15803D",
          tint: "#ECFDF3",
        },
        // Dark navy — sidebar, public hero panels, badge header.
        navy: {
          DEFAULT: "#0F1B33",
          900: "#0B1426",
          800: "#13213D",
          700: "#1C2E52",
          600: "#283B68",
          500: "#3A4F7E",
        },
        // Safety-net neutral aliases (light). New markup prefers slate-*.
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          faint: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)",
        lift: "0 10px 30px -12px rgba(15,23,42,0.22)",
        "glow-gold": "0 10px 30px -12px rgba(245,166,35,0.5)",
        "glow-red": "0 10px 30px -12px rgba(225,29,42,0.45)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
