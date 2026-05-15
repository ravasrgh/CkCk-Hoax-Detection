import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ckck: {
          bg: "#1a1510",
          card: "#1f1a14",
          border: "#3a332a",
          accent: "#d4a574",
          "text-primary": "#f5ede3",
          "text-muted": "#a89a8a",
          "text-code": "#a89a8a",
        },
        status: {
          "waspadai-bg": "#3D0D0A",
          "waspadai-text": "#FFDAD6",
          "terverifikasi-bg": "#003256",
          "terverifikasi-text": "#AAD4FF",
          "konteks-bg": "#432C00",
          "konteks-text": "#FFC66B",
          "netral-bg": "#3A342B",
          "netral-text": "#9D8E7C",
        },
        canvas: "#0a0806",
        main: "#1a1510",
        card: "#1f1a14",
        "card-alt": "#2a2218",
        "card-deep": "#0f0c08",
        input: "#0a0704",
        border: "#3a332a",
        gold: "#d4a574",
        amber: "#d4a574",
        "text-primary": "#f5ede3",
        "text-secondary": "#ddd1c4",
        "text-muted": "#a89a8a",
      },
    },
  },
  plugins: [],
};

export default config;
