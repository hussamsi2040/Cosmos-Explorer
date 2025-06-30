/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-navy': '#1a1a2e',
        'aurora-green': '#34d399',
        'starlight-blue': '#60a5fa',
        'coral-glow': '#ff6b6b',
        'nebula-purple': '#a855f7',
        'solar-orange': '#fb923c',
      },
      fontFamily: {
        'space': ['var(--font-space-grotesk)', 'sans-serif'],
        'noto': ['var(--font-noto-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to right, #1a1a2e, #60a5fa)',
        'nebula-gradient': 'linear-gradient(45deg, #1a1a2e, #a855f7, #60a5fa)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%': { opacity: 0.3 },
          '100%': { opacity: 1 },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
} 