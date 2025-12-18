// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',

  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        /* Base */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        /* Primary (Main Brand Color) */
        primary: {
          DEFAULT: 'hsl(var(--primary-purple))',
          foreground: 'hsl(var(--cta-foreground))',
        },

        /* Secondary (Teal) */
        secondary: {
          DEFAULT: 'hsl(var(--teal))',
          foreground: 'hsl(var(--cta-foreground))',
        },

        /* Accent (lighter brand usage) */
        accent: {
          DEFAULT: 'hsl(var(--primary-purple-light))',
          foreground: 'hsl(var(--primary-purple-dark))',
        },

        /* Text */
        text: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          disabled: 'hsl(var(--text-disabled))',
        },

        /* UI */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        divider: 'hsl(var(--divider))',

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--surface-1))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--surface-2))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        action: {
          hover: 'hsl(var(--action-hover))',
          selected: 'hsl(var(--action-selected))',
        },

        /* Charts */
        chart: {
          1: 'hsl(var(--primary-purple))',
          2: 'hsl(var(--primary-purple-light))',
          3: 'hsl(var(--teal))',
          4: 'hsl(var(--teal-light))',
          5: 'hsl(var(--brand-secondary))',
        },
      },

      fontFamily: {
        sans: ['cursive', 'Arial', 'sans-serif'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
