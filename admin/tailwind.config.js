/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grillix: {
          olive: "#315B0B",
          forest: "#244507",
          forestDark: "#1A3304",
          lime: "#A8E83C",
          limeLight: "#C4F174",
          bg: "#EEF4E3",
          card: "#E3EBD3",
          cardLight: "#F5F8EF",
          cardDark: "#264808",
          textPrimary: "#243019",
          textSecondary: "#747B68",
          border: "#D0D8C2",
          borderLight: "#E1E8D5",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
