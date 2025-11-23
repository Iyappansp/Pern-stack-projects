/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green": "#00ff88",
        "neon-green-hover": "#00dd77",
        "dark-bg": "#0a0a0a",
        "dark-card": "#1a1a1a",
        "dark-hover": "#252525",
        "dark-border": "#2a2a2a",
        "text-primary": "#ffffff",
        "text-secondary": "#a0a0a0",
        "text-muted": "#666666",
        "red-delete": "#ff4444",
        "red-hover": "#dd3333",
        "blue-edit": "#4488ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.2)",
        "neon-green-lg": "0 0 30px rgba(0, 255, 136, 0.3)",
      },
    },
  },
  plugins: [],
};
