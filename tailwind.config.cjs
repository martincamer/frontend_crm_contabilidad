/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#0287E0",
        secondary: "#ECF0F1",
        terciary: "#B2E5D3",
        fourty: "#008656",
        five: "#2ECC71",
        six: "#d5e9f7",
        seven: "#3b89e0",
        height: "#3B89E0",
        nine: "#7f8c8d",
        teeen: "#2C3E56",
        "sky-700": "#3b89e0",
        "sky-100": "#EBF5FB",
        "sky-500": "#0287E0",
      },
    },
  },
  plugins: [require("daisyui")],
};
