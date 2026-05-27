import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./content/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        chalk: {
          bg: "#EAF4E6",
          bgLight: "#F2F8EE",
          bgDark: "#DCEBD3",
          primary: "#1F6B3A",
          secondary: "#3FA15E",
          accent: "#7CC68A",
          ink: "#1A1A1A",
          highlight: "#F7E26B",
        },
        warm: {
          bg: "#FBF7F1",
          card: "#FFFFFF",
          line: "#EAE0D2",
          header: "#1F2937",
          headerSub: "#9CA3AF",
          accent: "#D97757",
          accentDark: "#B85F40",
          soft: "#F5E8DD",
          ink: "#2A2A2A",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        brush: ['"Noto Serif TC"', '"Yuji Mai"', "serif"],
        body: ['"Noto Sans TC"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "chalk-grain":
          "linear-gradient(135deg, #F2F8EE 0%, #DCEBD3 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
