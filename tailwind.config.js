/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C7299",
        primaryHover: "#6C729999",
        whiteHover: "#ffffff44",
      }
    },
  },
  plugins: [],
}

