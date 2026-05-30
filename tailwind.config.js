/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3b9eff', 600: '#2b8aee' },
        accent: { DEFAULT: '#34c759', 600: '#28a745' },
        surface: '#ffffff',
        canvas: '#f5f8fb',
        line: '#e3eaf2',
        ink: { DEFAULT: '#1f2d3d', soft: '#6b7a8d' }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace']
      }
    }
  },
  plugins: []
}
