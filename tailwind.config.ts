import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkSage: "#546A63",
        mediumSage: "#7E8E84",
        creamWhite: "#F9F9F7",
        charcoal: "#3C4140",
        secondaryCharcoal: "#4F4F4F",
        lightSage: "#E8ECE9",
        brokenWhite: "#D3D5CC",
        sageGreen: "#ADB2A8",
        white: "#FFFFFF",
        success: "#7BA07E",
        warning: "#D4A373",
        error: "#BC5353",
      },
      fontFamily: {
        abeezee: ["var(--font-abeezee)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
