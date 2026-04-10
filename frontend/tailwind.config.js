/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0d0d0d",
          accent: "#ed1c24",
          muted: "#a1a1aa",
        },
      },
      boxShadow: {
        "red-glow": "0 22px 55px rgba(237, 28, 36, 0.38)",
        "panel-soft": "0 36px 100px rgba(0, 0, 0, 0.48)",
      },
    },
  },
  plugins: [],
}
