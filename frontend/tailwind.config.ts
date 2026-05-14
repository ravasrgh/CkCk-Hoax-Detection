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
        sora: ["var(--font-sora)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ckck: {
          bg: "#1e1a13",
          card: "#1A1712",
          border: "#2C2820",
          accent: "#c7bcaa",
          "text-primary": "#EDE1D4",
          "text-muted": "#9A9080",
          "text-code": "#9A9080",
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
        canvas: "#111008",
        main: "#1e1a13",
        card: "#1A1712",
        "card-alt": "#27231d",
        "card-deep": "#120D07",
        input: "#0A0704",
        border: "#2C2820",
        gold: "#c7bcaa",
        amber: "#c7bcaa",
        "text-primary": "#EDE1D4",
        "text-secondary": "#D5C4AF",
        "text-muted": "#9A9080",
      },
    },
  },
  plugins: [],
};

export default config;
