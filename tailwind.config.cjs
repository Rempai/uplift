/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [],
  theme: {
    fontFamily: {
      sans: "Roboto",
    },
    extend: {
      colors: {
        "night-1": "#2E3440",
        "night-2": "#3B4252",
        "night-3": "#434C5E",
        "night-4": "#4C566A",

        "storm-1": "#D8DEE9",
        "storm-2": "#E5E9F0",
        "storm-3": "#ECEFF4",

        "frost-1": "#8FBCBB",
        "frost-2": "#88C0D0",
        "frost-3": "#81A1C1",
        "frost-4": "#5E81AC",

        "aurora-red": "#BF616A",
        "aurora-orange": "#D08770",
        "aurora-yellow": "#EBCB8B",
        "aurora-green": "#A3BE8C",
        "aurora-purple": "#B48EAD",
      },
    },
    borderRadius: {
      DEFAULT: "10px",
    },
    boxShadow: {
      DEFAULT: "3px 3px 5px 0px rgba(0, 0, 0, 0.5)",
    },
    dropShadow: {
      DEFAULT: "3px 5px 2px rgb(0 0 0 / 0.4)",
    },
  },
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  variants: {
    extend: {},
  },
};
