// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    darkMode: ['class', 'class'],  // Enabling dark mode based on class, you can also use 'media'
    content: [
        './src/**/*.{js,ts,jsx,tsx}',     // ✅ ADD THIS
        './app/**/*.{js,ts,jsx,tsx}',     // ✅ Keep this
        './pages/**/*.{js,ts,jsx,tsx}',   // ✅ If using pages
        './components/**/*.{js,ts,jsx,tsx}', // ✅ If you have components
    ],
    theme: {
    	extend: {
    		colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary-purple))',
    foreground: 'hsl(var(--cta-foreground))'
  },
  text: {
    primary: 'hsl(var(--text-primary))',
    secondary: 'hsl(var(--text-secondary))',
    disabled: 'hsl(var(--text-disabled))'
  },
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  divider: 'hsl(var(--divider))',
  action: {
    hover: 'hsl(var(--action-hover))',
    selected: 'hsl(var(--action-selected))'
  },
  card: {
    DEFAULT: 'hsl(var(--surface-1))',
    foreground: 'hsl(var(--card-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--surface-2))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--teal))',
    foreground: 'hsl(var(--brand-secondary))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--primary-purple-light))',
    foreground: 'hsl(var(--primary-purple-dark))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  chart: {
    '1': 'hsl(var(--primary-purple))',
    '2': 'hsl(var(--primary-purple-light))',
    '3': 'hsl(var(--teal))',
    '4': 'hsl(var(--teal-light))',
    '5': 'hsl(var(--brand-secondary))'
  }
}
,
    		fontFamily: {
    			sans: [
    				'Roboto',
    				'Arial',
    				'sans-serif'
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config