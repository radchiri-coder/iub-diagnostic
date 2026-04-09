import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FAFAF7',
          dark: '#F5F4EF',
          inverse: '#1A1A18',
        },
        ink: {
          DEFAULT: '#1A1A18',
          secondary: '#6B6B66',
          muted: '#9B9B95',
          inverse: '#E8E6E0',
        },
        accent: {
          DEFAULT: '#0F6E56',
          hover: '#0D5C48',
        },
        category: {
          clarity: '#0F6E56',
          decisions: '#185FA5',
          execution: '#993C1D',
          structure: '#534AB7',
          teamwork: '#993556',
          people: '#854F0B',
        },
        level: {
          high: '#0F6E56',
          medium: '#854F0B',
          low: '#993C1D',
        },
      },
      fontFamily: {
        serif: ['"PT Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '640px',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-up': 'fadeUp 300ms ease-out',
        'scale-in': 'scaleIn 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
