import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#1e1e2e',
        border: 'rgba(255,255,255,0.06)',
        violet: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
      },
      fontFamily: { mono: ['var(--font-mono)', 'monospace'] },
      animation: { 'spin-slow': 'spin 3s linear infinite' },
    },
  },
  plugins: [],
}
export default config
