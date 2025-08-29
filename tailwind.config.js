/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB", // Light gray background
        foreground: "#111827", // Dark text
        primary: {
          DEFAULT: "#16a34a", // A slightly deeper, richer green
          foreground: "#ffffff",
          hover: "#15803d",
        },
        secondary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
          hover: "#1d4ed8",
        },
        accent: {
          DEFAULT: "#f97316", // A vibrant orange
          foreground: "#ffffff",
        },
        card: "#FFFFFF",
        border: "#E5E7EB",
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lifted': '0 10px 20px rgba(0, 0, 0, 0.07), 0 3px 6px rgba(0, 0, 0, 0.05)',
        'interactive': '0 0 0 4px rgba(22, 163, 74, 0.2)',
        'glow-primary': '0 0 20px rgba(22, 163, 74, 0.25)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'enter': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards',
        'background-pan': 'background-pan 15s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'enter': 'enter 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards',
      },
      backgroundImage: {
        'login-hero': "url('https://images.unsplash.com/photo-1599499122472-358a4a5e4a83?fit=crop&w=1920&q=80')",
      }
    },
  },
  plugins: [],
};
