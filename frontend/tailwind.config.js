// const defaultTheme = require('tailwindcss/defaultTheme');

// const whitelist = [
//   'gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'
// ].reduce(
//   (result, color) => result.push(`text-${color}-600`, `bg-${color}-600`, `bg-${color}-500`) && result, [])

module.exports = {
  purge: [
    './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode : false, // or 'media' or 'class'
  theme    : {
    fontFamily: {
      'sans': ['Lato', 'system-ui', 'sans-serif']
    }
  },
  variants: {
    cursor: [
      'hover', 'focus', 'disabled'
    ],
    backgroundColor: [
      'responsive', 'hover', 'focus', 'active', 'disabled'
    ],
    textColor: [
      'responsive', 'hover', 'focus', 'active', 'disabled'
    ],  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
