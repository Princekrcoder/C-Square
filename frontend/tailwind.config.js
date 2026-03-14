/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: 'var(--bg-dark)',
        bgTech: 'var(--bg-tech)',
        panelBg: 'var(--panel-bg)',
        primary: 'var(--primary)',
        primaryGlow: 'var(--primary-glow)',
        accent: 'var(--accent)',
        accentCyan: 'var(--accent-cyan)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        textDim: 'var(--text-dim)',
        glassBg: 'var(--glass-bg)',
        glassBorder: 'var(--glass-border)',
        cardBg: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        subtleBg: 'var(--subtle-bg)',
        subtleBorder: 'var(--subtle-border)',
        codeKeyword: 'var(--code-keyword)',
        codeFunc: 'var(--code-func)',
        codeString: 'var(--code-string)',
        codePlain: 'var(--code-plain)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
