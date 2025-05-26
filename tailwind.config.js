/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Enables dark mode with 'class' strategy
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,ts,jsx,tsx}', // adjust as needed
    ],
    theme: {
      extend: {
        colors: {
          disoriti: {
            primary: '#00FFA9',      // Bright Aqua
            secondary: '#1c1c1c',    // Charcoal Black
            accent: '#00FFF5',       // Electric Aqua
            neutral: '#FFFFFF',      // White
            sidebar: '#000000',
          },
          background: {
            light: '#FFFFFF',
            dark: '#1c1c1c',
          },
        },
        fontFamily: {
          heading: ['"Bauhaus 93"', 'sans-serif'], // You'll need to self-host this font
          body: ['var(--font-body)', 'sans-serif'],
          cursive: ['"Brush Script MT"', 'cursive'],
        },
      },
    },
    // plugins: [require('tailwindcss-animate')], // Recommended by Shadcn UI
  };
  