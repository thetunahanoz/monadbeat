/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2b9dee",
        "upvote": "#2b9dee",
        "downvote": "#ff4500",
        "background-light": "#f6f7f8",
        "background-dark": "#101a22",
        "card-dark": "#1a2630",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"]
      },
      backgroundImage: {
        'monad-gradient': 'radial-gradient(circle at 50% 0%, rgba(43, 157, 238, 0.15) 0%, rgba(16, 26, 34, 1) 70%)',
      }
    },
  },
  plugins: [],
}
