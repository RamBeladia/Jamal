import type { Config } from "tailwindcss";

/**
 * Brand tokens are defined ONCE here (and mirrored as CSS variables in globals.css).
 * No arbitrary hex in components — use bg-ink / text-paper / border-brass etc.
 * Source of truth: the original index.html design-token block.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1080px" } },
    extend: {
      colors: {
        // ── named brand tokens ──
        ink: { DEFAULT: "#121212", 2: "#181816" },
        paper: { DEFAULT: "#F1F0ED", 2: "#E9E7E0", 3: "#FBFAF7" },
        brass: { DEFAULT: "#B08D3E", soft: "#cda758", deep: "#7d6126" },
        warm: "#67655E",
        // ── shadcn semantic tokens (mapped to brand via CSS vars) ──
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "brand-sm": "0 2px 10px -6px rgba(18,18,18,.4)",
        "brand-md": "0 18px 40px -28px rgba(18,18,18,.55)",
        "brand-lg": "0 36px 70px -40px rgba(18,18,18,.6)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
