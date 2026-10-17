/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/index.html",
    "./admin/src/**/*.{js,ts,jsx,tsx}",
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
          mapBg: "#3A5615",
          mapRoad: "#4D6E1E",
          mapRoadAlt: "#597E25",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 69, 7, 0.08)',
        'float': '0 8px 30px rgba(36, 69, 7, 0.12)',
        'pill': '0 2px 10px rgba(36, 69, 7, 0.06)',
      }
    },
  },
  plugins: [],
}
