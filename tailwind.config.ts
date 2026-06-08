import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Phantom Stack Collective gold/amber accent
        psc: {
          DEFAULT: "#C8920E",
          light: "#E6B422",
          dark: "#9A6F08",
        },
        // ICTAM secondary accents
        ictam: {
          red: "#C8102E",
          blue: "#1B4F9C",
        },
        // Institutional charcoal / slate
        ink: {
          DEFAULT: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        verified: {
          DEFAULT: "#16A34A",
          light: "#22C55E",
          bg: "#ECFDF5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
