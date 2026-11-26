import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        looop: {
          primary: "#123D32",       // Deep Forest
          secondary: "#2F805C",     // Eco Green
          accent: "#B8E4C5",        // Fresh Green
          bg: "#F5F7F2",            // Soft Neutral
          surface: "#FFFFFF",       // White
          text: "#17231D",          // Dark Text
          muted: "#68756D",         // Muted Green Gray
          border: "#E4EAE4",        // Soft Border
          success: "#23865B",       // Green
          warning: "#E7A23B",       // Amber
          danger: "#D9534F",        // Red
          info: "#4385C5",          // Blue
        },
      },
      borderRadius: {
        button: "10px",
        input: "10px",
        card: "14px",
        modal: "16px",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
