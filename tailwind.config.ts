import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ICTAM RED — authority / trust / official. Co-primary.
        ictam: {
          DEFAULT: "#E11D2A",
          light: "#F43F4B",
          dark: "#B0151F",
          glow: "rgba(225,29,42,0.35)",
        },
        // PSC GOLD/AMBER — platform / premium. Co-primary.
        psc: {
          DEFAULT: "#F5A623",
          light: "#FBBF4D",
          dark: "#C77F0E",
          glow: "rgba(245,166,35,0.30)",
        },
        // Verified green — tuned for dark surfaces.
        verified: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
          dark: "#15803D",
          glow: "rgba(34,197,94,0.30)",
        },
        // Dark canvas — midnight navy → near-black charcoal with a blue tint.
        base: {
          DEFAULT: "#0B1120", // deepest canvas
          900: "#0D1424",
          800: "#111827", // panels
          700: "#1A2335", // raised panels / cards
          600: "#243049", // borders / hairlines
          500: "#334155",
        },
        ink: {
          DEFAULT: "#F8FAFC", // primary text
          muted: "#94A3B8", // secondary text
          faint: "#64748B", // tertiary
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "glow-red": "0 0 0 1px rgba(225,29,42,0.4), 0 8px 30px -8px rgba(225,29,42,0.45)",
        "glow-gold": "0 0 0 1px rgba(245,166,35,0.4), 0 8px 30px -8px rgba(245,166,35,0.40)",
        "glow-green": "0 0 0 1px rgba(34,197,94,0.4), 0 8px 30px -8px rgba(34,197,94,0.40)",
        "card-dark": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -16px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "mesh": "radial-gradient(60% 50% at 80% 0%, rgba(225,29,42,0.10), transparent 60%), radial-gradient(50% 40% at 10% 10%, rgba(27,79,156,0.16), transparent 55%), radial-gradient(50% 50% at 50% 100%, rgba(245,166,35,0.06), transparent 60%)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
