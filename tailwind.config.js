module.exports = {
  purge: [
    "./**/*.tmpl",
    "./**/*.tmpl.partial",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.green.500'),
              '&:hover': {
                color: theme('colors.green.500'),
              },
            },
            h1: {
              color: theme('colors.gray.200'),
            },
            h2: {
              color: theme('colors.gray.200'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
            h4: {
              color: theme('colors.gray.200'),
            },
            h5: {
              color: theme('colors.gray.200'),
            },
            h6: {
              color: theme('colors.gray.200'),
            },
            strong: {
              color: theme('colors.gray.200'),
            },
            code: {
              color: theme('colors.gray.200'),
            },
            figcaption: {
              color: theme('colors.gray.500'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
