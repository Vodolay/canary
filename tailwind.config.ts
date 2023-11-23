/** @type {import('tailwindcss').Config} */

import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        gradient: {
          to: { 'background-position': '200% center' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 8s linear infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animate'),

    nextui({
      themes: {
        light: {
          layout: {},
          colors: {
            background: '#fafafa',
            foreground: '#111827',
            primary: '#38bdf8',
            secondary: '#a78bfa',
          },
        },
        dark: {
          layout: {},
          colors: {
            background: '#262626', // this is the default dark mode background color (slate-900)
            foreground: '#e2e8f0', // this is the text color on dark mode (slate-200)
            primary: '#38bdf8', // this is the primary color on dark mode (blue-400)
            secondary: '#a78bfa',
          },
        },
      },
    }),
  ],
};
