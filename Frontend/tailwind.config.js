/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        physis: {
          avena: "#F9F6F0",    // Tu fondo de mosaico armónico
          terracota: "#C36B4D", // Para el nicho Prosper
          salvia: "#8A9A5B",    // Para el nicho Serenity
          avellana: "#7E5E47",  // Para el nicho Scholar y contrastes
          blancuzco: "#F1EDE4", // Color secundario para capas de tarjetas
        },
      },
      backgroundImage: {
        'mosaico-avena': "url('/assets/textures/avena-pattern.png')", // Lo usaremos pronto
      }
    },
  },
  plugins: [],
}