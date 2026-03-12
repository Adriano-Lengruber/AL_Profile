/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#d4a853',
					foreground: '#0a0d14',
				},
				secondary: {
					DEFAULT: '#94a3b8',
					foreground: '#0a0d14',
				},
				accent: {
					DEFAULT: '#059669',
					foreground: '#0a0d14',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#f8fafc',
				},
				muted: {
					DEFAULT: '#1a2133',
					foreground: '#94a3b8',
				},
				popover: {
					DEFAULT: '#0e1623',
					foreground: '#f8fafc',
				},
				card: {
					DEFAULT: '#0e1623',
					foreground: '#f8fafc',
				},
				// Refined elegant dark palette
				cyber: {
					black: '#0a0d14',
					slate: '#0e1623',
					gold: '#d4a853',
					amber: '#b8843a',
					blue: '#60a5fa',
					indigo: '#818cf8',
					emerald: '#059669',
					steel: '#94a3b8',
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'glow': {
					'0%, 100%': { opacity: 0.4 },
					'50%': { opacity: 0.8 },
				},
				'gradient': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'gradient': 'gradient 8s ease infinite',
				'shimmer': 'shimmer 3s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
