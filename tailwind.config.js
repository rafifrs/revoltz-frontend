/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'xs':   ['12px', { lineHeight: '1.3' }],
      'sm':   ['14px', { lineHeight: '1.4' }],
      'base': ['16px', { lineHeight: '1.5' }],
      'lg':   ['18px', { lineHeight: '1.5' }],
      'xl':   ['20px', { lineHeight: '1.3' }],
      '2xl':  ['24px', { lineHeight: '1.3' }],
      '3xl':  ['32px', { lineHeight: '1.2' }],
    },
    extend: {
      colors: {
        'deep-blue':   '#244F93',
        'bright-green':'#44CE7F',
        'soft-mint':   '#9BE8A8',
        'lime-green':  '#ACEA63',
        'light-gray':  '#F5F5F5',
        'dark-gray':   '#555555',
      },
      borderRadius: {
        '20': '20px',
      },
      keyframes: {
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
