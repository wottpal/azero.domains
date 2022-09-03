/* eslint-disable */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        social: {
          twitter: '#1DA1F2',
          discord: '#EB459E',
        },
      },
      fontFamily: {
        display: ['Electrolize', 'Arial', 'serif'],
        mono: ['Inconsolata', 'Menlo', 'monospace'],
      },
      animation: {
        'spin-custom': '800ms ease-in-out infinite spin',
      },
    },
  },
  plugins: [
    require('daisyui'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#00eac7',
          'primary-content': '#14202a',
          secondary: '#00ccab',
          accent: '#e164f4',
          'base-content': '#ffffff',
          neutral: '#ffffff',
          'base-100': '#14202a',
          'base-200': '#4f585f',
          info: '#85C7DB',
          success: '#66d16f',
          warning: '#ffd23f',
          error: '#ff4f4c',
        },
      },
    ],
  },
}
