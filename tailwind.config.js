/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from style guide
        primary: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          dark: '#6366f1',
          text: '#ffffff',
        },
        // Secondary colors
        secondary: {
          DEFAULT: '#f3f4f6',
          hover: '#e5e7eb',
          dark: '#374151',
          'dark-hover': '#4b5563',
          text: '#1f2937',
          'dark-text': '#f9fafb',
        },
        // Accent colors
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          dark: '#34d399',
        },
        // UI colors
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Status colors
        success: '#22c55e',
        'success-dark': '#34d399',
        warning: '#f59e0b',
        'warning-dark': '#fbbf24',
        error: '#ef4444',
      },
      // Box shadow
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // Transition durations
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 