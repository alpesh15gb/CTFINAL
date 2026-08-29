import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			raised: 'var(--raised)',
  			surface: 'var(--surface)',
  			elevated: 'var(--elevated)',
  			'surface-hover': 'var(--surface-hover)',
  			muted: 'var(--muted)',
  			'muted-foreground': 'var(--muted-foreground)',
  			border: 'var(--border)',
  			'border-muted': 'var(--border-muted)',
  			cyan: {
  				DEFAULT: 'var(--cyan)',
  				light: 'var(--cyan-light)',
  				glow: 'var(--cyan-glow)'
  			},
  			red: {
  				DEFAULT: 'var(--red)',
  				light: 'var(--red-light)',
  				glow: 'var(--red-glow)'
  			},
  			silver: {
  				DEFAULT: 'var(--silver)',
  				muted: 'var(--silver-muted)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			ring: 'var(--ring)'
  		},
        fontFamily: {
          display: [
            'var(--font-display)',
            'sans-serif'
          ],
          sans: [
            'var(--font-sans)',
            'system-ui',
            'sans-serif'
          ],
          mono: [
            'var(--font-mono)',
            'monospace'
          ]
        },
  		borderRadius: {
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)'
  		},
  		spacing: {
  			'space-xs': 'var(--space-xs)',
  			'space-sm': 'var(--space-sm)',
  			'space-md': 'var(--space-md)',
  			'space-lg': 'var(--space-lg)',
  			'space-xl': 'var(--space-xl)',
  			'space-2xl': 'var(--space-2xl)',
  			'space-3xl': 'var(--space-3xl)'
  		},
  		transitionTimingFunction: {
  			'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  			'ease-in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)'
  		},
  		keyframes: {
  			'pulse-glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 rgba(2, 187, 252, 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px 4px rgba(2, 187, 252, 0.15)'
  				}
  			},
  			'line-reveal': {
  				from: {
  					transform: 'scaleX(0)'
  				},
  				to: {
  					transform: 'scaleX(1)'
  				}
  			},
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
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'line-reveal': 'line-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
