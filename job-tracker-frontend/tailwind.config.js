/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      bg: "#f7f7f5",
      card: "#ffffff",
      border: "#e5e5e5",
      text: "#111827",
      muted: "#6b7280",
      primary: "#2563eb",
    },
    borderRadius: {
      xl: "12px",
    },
  },
},
  plugins: [],
}