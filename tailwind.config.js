
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0097FB',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            code: {
              backgroundColor: '#f4f4f4',
              padding: '0.1em 0.2em',
              borderRadius: '0.2em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              padding: '0.75rem 1rem',
            },
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            code: {
              backgroundColor: '#374151',
            },
            pre: {
              backgroundColor: '#1a202c',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
