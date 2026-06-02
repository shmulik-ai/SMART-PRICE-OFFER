/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // RMA brand palette - gold tones (primary highlight)
        brand: {
          50:  '#fdf8ec',
          100: '#fbeec9',
          200: '#f6dc8e',
          300: '#eec458',
          400: '#e2ae34',
          500: '#d4a847',
          600: '#b8922a',
          700: '#967622',
          800: '#7a601f',
          900: '#65501e',
        },
        // RMA navy palette
        navy: {
          50:  '#f3f6fa',
          100: '#e2eaf3',
          200: '#bfd0e3',
          300: '#90b0cd',
          400: '#5a85b0',
          500: '#3a6695',
          600: '#284f7a',
          700: '#1a3a5c',
          800: '#143055',
          900: '#0f2744',
          950: '#0a1c33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 30px -8px rgba(184, 146, 42, 0.35)',
        'navy':  '0 10px 30px -8px rgba(15, 39, 68, 0.45)',
        'soft':  '0 4px 24px -6px rgba(15, 39, 68, 0.08)',
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer':   'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
