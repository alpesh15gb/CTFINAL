import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        raised: "var(--raised)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        "surface-hover": "var(--surface-hover)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        "border-muted": "var(--border-muted)",
        obsidian: {
          DEFAULT: "#08080A",
          deep: "#040507",
          surface: "#0E0F12",
          elevated: "#14161B",
          border: "rgba(255, 255, 255, 0.08)",
        },
        titanium: {
          DEFAULT: "#E2E8F0",
          light: "#F8FAFC",
          muted: "#94A3B8",
          dark: "#64748B",
        },
        amber: {
          DEFAULT: "#FF9F0A",
          light: "#FFB340",
          glow: "rgba(255, 159, 10, 0.25)",
        },
        hyperRed: {
          DEFAULT: "#FF3B30",
          light: "#FF453A",
          glow: "rgba(255, 59, 48, 0.25)",
        },
        cyan: {
          DEFAULT: "var(--cyan)",
          light: "var(--cyan-light)",
          glow: "var(--cyan-glow)",
        },
        red: {
          DEFAULT: "var(--red)",
          light: "var(--red-light)",
          glow: "var(--red-glow)",
        },
        silver: {
          DEFAULT: "var(--silver)",
          muted: "var(--silver-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        ring: "var(--ring)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        "space-xs": "var(--space-xs)",
        "space-sm": "var(--space-sm)",
        "space-md": "var(--space-md)",
        "space-lg": "var(--space-lg)",
        "space-xl": "var(--space-xl)",
        "space-2xl": "var(--space-2xl)",
        "space-3xl": "var(--space-3xl)",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(2, 187, 252, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 20px 4px rgba(2, 187, 252, 0.15)",
          },
        },
        "line-reveal": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "line-reveal": "line-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scan-line": "scan-line 3s linear infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
