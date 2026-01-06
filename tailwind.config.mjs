/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#38BDF8",
          dark: "#7DD3FC",
          light: "#0EA5E9",
        },
        background: "#0F172A",
        surface: {
          DEFAULT: "#1E293B",
          elevated: "#334155",
        },
        text: {
          DEFAULT: "#E2E8F0",
          muted: "#94A3B8",
        },
        border: "#334155",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      maxWidth: {
        container: "1200px",
      },
      width: {
        sidebar: "240px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans JP"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
