import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          black: "var(--bg-black)",
          card: "var(--bg-card)",
        },
        green: {
          primary: "var(--green-primary)",
          bright: "var(--green-bright)",
          dark: "var(--green-dark)",
        },
        amber: { DEFAULT: "var(--amber)" },
        orange: { DEFAULT: "var(--orange)" },
        critical: "var(--red-critical)",
        info: "var(--blue-info)",
        labor: "var(--purple-labor)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
      borderColor: {
        card: "var(--bg-card-border)",
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
        glow: "0 6px 20px rgba(34,197,94,0.35)",
      },
      maxWidth: {
        phone: "480px",
        site: "1180px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        screen: ["30px", { lineHeight: "34px", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
export default config;
