// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    darkMode: 'class',  // Enabling dark mode based on class, you can also use 'media'
    content: [
        './src/**/*.{js,ts,jsx,tsx}',     // ✅ ADD THIS
        './app/**/*.{js,ts,jsx,tsx}',     // ✅ Keep this
        './pages/**/*.{js,ts,jsx,tsx}',   // ✅ If using pages
        './components/**/*.{js,ts,jsx,tsx}', // ✅ If you have components
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: 'hsl(var(--background))',
                    paper: 'hsl(var(--paper))',
                },
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                text: {
                    primary: 'hsl(var(--text-primary))',
                    secondary: 'hsl(var(--text-secondary))',
                    disabled: 'hsl(var(--text-disabled))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                divider: 'hsl(var(--divider))',
                action: {
                    hover: 'hsl(var(--action-hover))',
                    selected: 'hsl(var(--action-selected))',
                },
            },
            fontFamily: {
                sans: ['Roboto', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config