/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // IMPORTANT
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          secondary: "#7C3AED",
          accent: "#EC4899",
        },

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",

        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          muted: "#F1F5F9",

          // DARK
          dark: "#020617",       // slate-950
          darkSoft: "#020617",   // base bg
          darkMuted: "#0F172A",  // cards
        },

        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",

          // DARK
          darkPrimary: "#F8FAFC",
          darkSecondary: "#CBD5E1",
          darkMuted: "#94A3B8",
        },

        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",

          // DARK
          dark: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};