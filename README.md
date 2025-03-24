# Medieval Weather Map Dashboard

A beautiful weather dashboard with medieval-themed styling and Google Maps integration.

## Features

- Search for weather by location
- Visual display of current weather conditions
- Medieval-styled Google Maps view of the location
- Responsive design for all device sizes
- Beautiful UI with medieval theme

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_WEATHERMAP_API_KEY=your_openweathermap_api_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Keys

This application requires two API keys:

1. **Google Maps API Key** - For the interactive map display
   - Get a key from [Google Cloud Platform](https://console.cloud.google.com/)
   - Enable the Maps JavaScript API

2. **OpenWeatherMap API Key** - For weather data
   - Get a free key from [OpenWeatherMap](https://openweathermap.org/api)

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- React
- Framer Motion for animations
- Google Maps API
- OpenWeatherMap API

## License

MIT 