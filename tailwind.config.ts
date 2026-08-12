import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { BREAKPOINTS } from './src/lib/breakpoints';

/** Same px as breakpoints.ts — used for frame-container + viewport escape hatches */
const SCREEN_PX = {
	sm: BREAKPOINTS.SM,
	md: BREAKPOINTS.MD,
	lg: BREAKPOINTS.LG,
	xl: BREAKPOINTS.XL,
	'2xl': BREAKPOINTS.XXL,
} as const;

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./messages/**/*.json',
	],
	darkMode: 'class',
	theme: {
		// Empty: disable default @media sm/md/lg variants.
		// Breakpoints are re-registered as @container marvin-shell queries below.
		screens: {},
		extend: {
			// Preserve max-w-screen-* utilities (normally derived from theme.screens)
			maxWidth: {
				'screen-sm': `${SCREEN_PX.sm}px`,
				'screen-md': `${SCREEN_PX.md}px`,
				'screen-lg': `${SCREEN_PX.lg}px`,
				'screen-xl': `${SCREEN_PX.xl}px`,
				'screen-2xl': `${SCREEN_PX['2xl']}px`,
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				/** Site lime accent — change --brand-rgb in globals.css to rebrand everywhere */
				brand: {
					DEFAULT: 'rgb(var(--brand-rgb) / <alpha-value>)',
					foreground: 'rgb(var(--brand-foreground-rgb) / <alpha-value>)',
					deep: 'rgb(var(--brand-deep-rgb) / <alpha-value>)',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				border: 'hsl(var(--border))',
				ring: 'hsl(var(--ring))',
				glow: {
					cyan: '#00FFFF',
					purple: '#A855F7',
					pink: '#EC4899'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				input: 'hsl(var(--input))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				bento: {
					highlight: {
						light: '#DADBF8',
						DEFAULT: '#454ADE',
					},
					accent: {
						light: '#D9EAE3',
						DEFAULT: '#439775',
					},
					primary: {
						light: '#FFCFE1',
						DEFAULT: '#FF0F67',
					},
					secondary: {
						light: '#FFFCE5',
						DEFAULT: '#FFF07C',
					},
					base: {
						100: '#f0f0f0',
						200: '#ffffff',
						300: '#F2F2F2',
						content: '#0A0A0A',
					}
				}
			},
			fontFamily: {
				// Point at next/font variables from layout.tsx — do not nest stacks in CSS vars
				sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
				display: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
				hand: ['var(--font-signature)', 'Segoe Script', 'cursive'],
			},
			fontSize: {
				'display-xl': [
					'var(--text-display-xl)',
					{ lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '900' },
				],
				display: [
					'var(--text-display)',
					{ lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' },
				],
				title: [
					'var(--text-title)',
					{ lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' },
				],
				'body-lg': [
					'var(--text-body-lg)',
					{ lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '300' },
				],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'fade-up': 'fadeUp 0.6s ease-out forwards',
				'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
				'slide-in-right': 'slideInRight 0.5s ease-out forwards',
				'scale-in': 'scaleIn 0.4s ease-out forwards',
				'glow-pulse': 'glowPulse 2s ease-in-out infinite',
				float: 'float 6s ease-in-out infinite',
				'rotate-slow': 'rotateSlow 20s linear infinite',
				'gradient-shift': 'gradientShift 8s ease infinite',
				marquee: 'marquee 30s linear infinite',
				'marquee-reverse': 'marqueeReverse 30s linear infinite',
				scan: 'scan 3s linear infinite',
				meteor: 'meteor 5s linear infinite'
			},
			keyframes: {
				meteor: {
					'0%': { transform: 'rotate(var(--angle)) translateX(0)', opacity: '1' },
					'70%': { opacity: '1' },
					'100%': {
						transform: 'rotate(var(--angle)) translateX(-500px)',
						opacity: '0'
					}
				},
				scan: {
					'0%': { top: '0%' },
					'100%': { top: '100%' }
				},
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				fadeUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideInLeft: {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				slideInRight: {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				scaleIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				glowPulse: {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				rotateSlow: {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				gradientShift: {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				marquee: {
					'0%': {
						transform: 'translateX(0%)'
					},
					'100%': {
						transform: 'translateX(-50%)'
					}
				},
				marqueeReverse: {
					'0%': {
						transform: 'translateX(-50%)'
					},
					'100%': {
						transform: 'translateX(0%)'
					}
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(280,100%,70%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)'
			},
			backdropBlur: {
				xs: '2px'
			},
			boxShadow: {
				glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glow-sm': '0 0 10px rgba(0, 255, 255, 0.3)',
				'glow-md': '0 0 20px rgba(0, 255, 255, 0.4)',
				'glow-lg': '0 0 40px rgba(0, 255, 255, 0.5)',
				'inner-glow': 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
				'brand-sm': 'var(--shadow-brand-sm)',
				'brand-md': 'var(--shadow-brand-md)',
				'brand-lg': 'var(--shadow-brand-lg)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Keep Tailwind defaults for xl/2xl/3xl — only expose token aliases as extras
				'token-xl': 'var(--radius-xl)',
				'token-2xl': 'var(--radius-2xl)',
				'token-3xl': 'var(--radius-3xl)',
			}
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		plugin(function frameAsWindowBreakpoints({ addVariant }) {
			const entries = Object.entries(SCREEN_PX) as [keyof typeof SCREEN_PX, number][];

			// In-shell layout: md:/lg:/… follow #marvin-page-shell width (frame = window)
			for (const [name, px] of entries) {
				addVariant(name, `@container marvin-shell (min-width: ${px}px)`);
				addVariant(`max-${name}`, `@container marvin-shell (max-width: ${px - 1}px)`);
			}

			// Outside-shell chrome (ChatBot): real device viewport
			for (const [name, px] of entries) {
				addVariant(`v${name}`, `@media (min-width: ${px}px)`);
				addVariant(`vmax-${name}`, `@media (max-width: ${px - 1}px)`);
			}
		}),
	],
};

export default config;
