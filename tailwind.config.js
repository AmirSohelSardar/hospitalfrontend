/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#0A8F6C", // deep teal-green
        yellowColor: "#F5A623", // warm amber
        purpleColor: "#6C63FF", // soft purple
        irisBlueColor: "#00BFA5", // mint
        headingColor: "#1A2332", // deep navy
        textColor: "#52606D", // muted slate
      },
      boxShadow: {
        panelShadow: "rgba(17,12,46,0.15) 0px 48px 100px 0px",
      },
    },
  },
  plugins: [],
};
