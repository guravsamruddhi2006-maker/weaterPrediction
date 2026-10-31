# Weather Dashboard

A responsive weather dashboard that displays current conditions and a seven-day forecast for a searched city or your current location.

## Features

- Search for a city to view its weather.
- Use your device's location to get local weather.
- View temperature, feels-like temperature, humidity, wind speed, sunrise, and sunset.
- See a seven-day forecast with weather icons and daily high and low temperatures.
- Responsive layout for desktop and mobile screens.

## Run the app

No installation or build step is required.

1. Download or clone this project.
2. Open `index.html` in a modern web browser.
3. Search for a city, or select **Use My Location** and allow location access when prompted.

For location access, browsers may require the page to be served from `localhost` or a secure HTTPS origin instead of opened directly as a file.

## Data sources

Weather and forecast data are provided by the [Open-Meteo Forecast API](https://open-meteo.com/en/docs). City search and reverse geocoding use the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api). The app does not require an API key.

An internet connection is required to retrieve weather data.

## Project files

- `index.html` — dashboard page structure.
- `style.css` — responsive visual styling.
- `script.js` — city search, location handling, API requests, and weather rendering.
