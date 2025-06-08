/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  './src/**/*.{js,jsx,ts,tsx}',  
	],
	theme: {
	  fontFamily: {
		display: ["Poppins", "sans-serif"],  
	  },
	  extend: {
		colors: {
		  primary: '#0180CB',  // Define the primary color here
		  secondary: '#FF5733',  // Define the secondary color here (you can change this value as needed)
		},
		backgroundImage: {
		  'login-bg-img': "url('./src/assets/images/bg-image.jpg')",//ONE CAN PLACE ANOTHER PROPER IMAGE HERE
		  'signup-bg-img': "url('./src/assets/images/bg-image.jpg')", //ONE CAN PLACE ANOTHER PROPER IMAGE HERE
		},
	  },
	},
	plugins: [],
  };
  