import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ckck: {
          bg: "#1a1a1a",
          card: "#242020",
          border: "#3a3a3a",
          accent: "#C9A84C",
          "text-primary": "#E8E8E8",
          "text-muted": "#6B6B6B",
          "text-code": "#A8A8A8",
        },
        status: {
          "waspadai-bg": "#8B1A1A",
          "waspadai-text": "#FF6B6B",
          "terverifikasi-bg": "#1A2E4A",
          "terverifikasi-text": "#6BB5FF",
          "konteks-bg": "#4A3500",
          "konteks-text": "#FFB347",
          "netral-bg": "#2A2A2A",
          "netral-text": "#A8A8A8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
