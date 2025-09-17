/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef7ff",
          100: "#d9edff",
          200: "#b3dbff",
          300: "#85c3ff",
          400: "#58a6ff",
          500: "#2f8aff",
          600: "#1e6fe6",
          700: "#1757b4",
          800: "#13488f",
          900: "#113d76",
        },
      },
    },
  },
  plugins: [],
}
