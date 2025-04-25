
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				display: ['Poppins', 'Inter', 'Roboto', 'sans-serif'],
				sans: ['Poppins', 'Inter', 'Roboto', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
			},
			colors: {
				border: '#F5F7FA',
				input: '#F5F7FA',
				ring: '#004080',
				background: '#FFFFFF', // Pure White
				foreground: '#004080', // Deep Trust Blue for strong foreground/headings

				primary: {
					DEFAULT: '#004080', // Deep Trust Blue
					foreground: '#FFFFFF', // White text on buttons
				},
				secondary: {
					DEFAULT: '#4CAF50', // Fresh Green
					foreground: '#FFFFFF',
				},
				accent: {
					DEFAULT: '#FF7A00', // Energetic Orange
					foreground: '#FFFFFF',
				},
				surface: {
					DEFAULT: '#F5F7FA',
				},
				card: {
					DEFAULT: '#F5F7FA', // Soft modern light gray for cards
					foreground: '#004080',
				},
				destructive: {
					DEFAULT: '#FF5A5A',
					foreground: '#fff',
				},
				meow: {
					primary: '#004080',
					secondary: '#FF7A00',
					tertiary: '#4CAF50',
					light: '#FFFFFF',
					dark: '#1A2B40',
					accent: '#FF7A00',
				},
				muted: {
					DEFAULT: '#E9ECEF',
					foreground: '#7B7B7B'
				},
				sidebar: {
					DEFAULT: '#F5F7FA',
					foreground: '#004080', // blue text in sidebar
					primary: '#004080',
					'primary-foreground': '#FFFFFF',
					accent: '#FF7A00',
					'accent-foreground': '#FFFFFF',
					border: '#E9ECEF',
					ring: '#004080'
				}
			},
			borderRadius: {
				lg: '1rem',
				md: '0.75rem',
				sm: '0.5rem'
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
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'hero-pattern': "url('/pattern.svg')",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
