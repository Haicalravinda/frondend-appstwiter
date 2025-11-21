/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#1DA1F2',
        'twitter-dark': '#14171A',
        'twitter-light': '#657786',
        'twitter-extra-light': '#AAB8C2',
        'twitter-bg': '#E1E8ED',
      },
    },
  },
  plugins: [],
}