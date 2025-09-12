import type { Config } from 'tailwindcss';

interface CustomConfig extends Config {
  daisyui?: {
    themes?: string[];
  };
}

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  darkMode: 'class', // Enable class-based dark mode for Flowbite
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("daisyui")
  ],
  daisyui: {
    themes: ["light", "dark"],
  }
} satisfies CustomConfig;
