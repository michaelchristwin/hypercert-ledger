import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "myBg-gradient": "",
      },
      transformOrigin: {
        "spacy-s": "50% 50%",
      },
      keyframes: {
        animateContainer: {
          "0%": {
            opacity: "0",
            transform: "scale(0)",
            boxShadow:
              "0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "25%": {
            opacity: "1",
            transform: "scale(0.9)",
            boxShadow:
              "0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "43.75%": {
            transform: "scale(1.15)",
            boxShadow:
              "0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "62.5%": {
            transform: "scale(1)",
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset",
          },
          "81.25%": {
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset",
          },
          "100%": {
            opacity: "1",
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset",
          },
        },
        animateCheck: {
          from: {
            strokeDashoffset: "80",
          },
          to: {
            strokeDashoffset: "0",
          },
        },
        animateShadow: {
          "0%": {
            opacity: "0",
            width: "100%",
            height: "15%",
          },
          "25%": {
            opacity: "0.25",
          },
          "43.75%": {
            width: "40%",
            height: "7%",
            opacity: "0.35",
          },
          "100%": {
            width: "85%",
            height: "15%",
            opacity: "0.25",
          },
        },
      },
      animation: {
        animateShadow: "animateShadow 0.75s ease-out forwards 0.75s",
        animateCheck: "animateCheck 0.35s forwards 0.50s ease-out",
        animateContainer: "animateContainer 0.75s ease-out forwards 0.10s",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
