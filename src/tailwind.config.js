/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        animation: {
          borderMove: "borderMove 4s linear infinite",
        },
        keyframes: {
          borderMove: {
            "0%": { backgroundPosition: "0% 50%" },
            "100%": { backgroundPosition: "100% 50%" },
          },
        },
        backgroundSize: {
          "200%": "200% 200%",
        },
      },
    },
    plugins: [],
  };
  