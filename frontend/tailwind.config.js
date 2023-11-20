/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'criminal': "url('/images/criminal.png')",
        'fire-fighter': "url('/images/fire-fighter.png')",
        'inmate-female': "url('/images/inmate-female.png')",
        'inmate': "url('/images/inmate.png')",
        'insurgent': "url('/images/insurgent.png')",
        'lawyer-female': "url('/images/lawyer-female.png')",
        'lawyer': "url('/images/lawyer.png')",
        'medic': "url('/images/medic.png')",
        'person': "url('/images/person.png')",
        'police-officer-female': "url('/images/police-officer-female.png')",
        'police-officer': "url('/images/police-officer.png')",
        'prison-guard': "url('/images/prison-guard.png')",
        'spy': "url('/images/spy.png')",
      },
      colors: {
        "dark": {
          900: "#0a0a0a",
          800: "#0f0f0f",
          700: "#1c1d1f",
          600: "#252932"
        },
        "light-gray": "#f6f7f9",
        "burple": {
          900: "#805cfd"
        },
      }
    },
  },
  plugins: [],
}
