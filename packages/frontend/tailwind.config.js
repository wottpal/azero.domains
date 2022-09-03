/* eslint-disable */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  // darkMode: 'class',
  // theme: {
  //   extend: {
  //     colors: {
  //       gray: colors.zinc,
  //       social: {
  //         twitter: '#1DA1F2',
  //         discord: '#EB459E',
  //       },
  //     },
  //     fontFamily: {
  //       display: ['Block Marys', 'Arial', 'serif'],
  //       'display-outline': ['Block Marys Outline', 'Block Marys', 'Arial', 'serif'],
  //       mono: ['Inconsolata', 'Menlo', 'monospace'],
  //     },
  //     animation: {
  //       'spin-custom': '800ms ease-in-out infinite spin',
  //     },
  //   },
  // },
  plugins: [
    require('daisyui'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: ['luxury'],
  },
}
