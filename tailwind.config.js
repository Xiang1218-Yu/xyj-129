/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        excel: {
          green: "#217346",
          greenDark: "#1A5C38",
          greenLight: "#E3F0E8",
          border: "#D4D4D4",
          header: "#F3F2F1",
          selected: "#1E6EB8",
          hover: "#E8F0FE",
          tab: "#F3F2F1",
          status: "#217346",
        },
      },
      fontFamily: {
        excel: [
          "Calibri",
          "-apple-system",
          "BlinkMacSystemFont",
          "Microsoft YaHei",
          "PingFang SC",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        excel: ["14px", "20px"],
        "excel-sm": ["12px", "16px"],
        "excel-lg": ["16px", "24px"],
      },
    },
  },
  plugins: [],
};
