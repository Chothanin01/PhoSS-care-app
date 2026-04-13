/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "white": "#ffffff",
        "red": "#FF0505",
        "green": "#58AD4",
        "navy": "#05548D",
      },
        fontFamily: {
          light: ["IBMPlexSansThai_300Light"],
          regular: ["IBMPlexSansThai_400Regular"],
          medium: ["IBMPlexSansThai_500Medium"],
          semibold: ["IBMPlexSansThai_600SemiBold"],
          bold: ["IBMPlexSansThai_700Bold"],
      },
    },
  },
  plugins: [],
};