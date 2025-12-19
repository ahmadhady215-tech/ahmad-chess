import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dark/Neon theme
                background: {
                    DEFAULT: '#0a0a0f',
                    light: '#141420',
                    lighter: '#1a1a2e',
                },
                primary: {
                    DEFAULT: '#00ffff',
                    dark: '#00cccc',
                    light: '#66ffff',
                },
                secondary: {
                    DEFAULT: '#ff00ff',
                    dark: '#cc00cc',
                    light: '#ff66ff',
                },
                accent: {
                    DEFAULT: '#ffff00',
                    dark: '#cccc00',
                    light: '#ffff66',
                },
                success: '#00ff88',
                error: '#ff3366',
                warning: '#ffaa00',
                board: {
                    light: '#f0d9b5',
                    dark: '#b58863',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
                    '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'neon-grid': 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
            },
        },
    },
    plugins: [],
}

export default config
