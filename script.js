const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityNameEl = document.getElementById("cityName");
const currentDateEl = document.getElementById("currentDate");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const weatherIconEl = document.getElementById("weatherIcon");
const forecastEl = document.getElementById("forecast");

const defaultCity = "New York";

const weatherCodes = {
  0: { label: "Clear sky", day: "☀️", night: "🌙" },
  1: { label: "Mainly clear", day: "🌤️", night: "🌙" },
  2: { label: "Partly cloudy", day: "⛅", night: "☁️" },
  3: { label: "Overcast", day: "☁️", night: "☁️" },
  45: { label: "Fog", day: "🌫️", night: "🌫️" },
  48: { label: "Depositing rime fog", day: "🌫️", night: "🌫️" },
  51: { label: "Light drizzle", day: "🌦️", night: "🌧️" },
  53: { label: "Drizzle", day: "🌦️", night: "🌧️" },
  55: { label: "Heavy drizzle", day: "🌧️", night: "🌧️" },
  56: { label: "Freezing drizzle", day: "🌧️", night: "🌧️" },
  57: { label: "Heavy freezing drizzle", day: "🌧️", night: "🌧️" },
  61: { label: "Slight rain", day: "🌦️", night: "🌧️" },
  63: { label: "Rain", day: "🌧️", night: "🌧️" },
  65: { label: "Heavy rain", day: "🌧️", night: "🌧️" },
  66: { label: "Freezing rain", day: "🌧️", night: "🌧️" },
  67: { label: "Heavy freezing rain", day: "🌧️", night: "🌧️" },
  71: { label: "Slight snow", day: "🌨️", night: "🌨️" },
  73: { label: "Snow", day: "❄️", night: "❄️" },
  75: { label: "Heavy snow", day: "❄️", night: "❄️" },
  77: { label: "Snow grains", day: "❄️", night: "❄️" },
  80: { label: "Rain showers", day: "🌦️", night: "🌧️" },
  81: { label: "Heavy rain showers", day: "🌧️", night: "🌧️" },
  82: { label: "Violent rain showers", day: "⛈️", night: "⛈️" },
  85: { label: "Snow showers", day: "🌨️", night: "🌨️" },
  86: { label: "Heavy snow showers", day: "🌨️", night: "🌨️" },
  95: { label: "Thunderstorm", day: "⛈️", night: "⛈️" },
  96: { label: "Thunderstorm with hail", day: "⛈️", night: "⛈️" },
  99: { label: "Severe thunderstorm", day: "⛈️", night: "⛈️" },
};

function getWeatherLabel(code, isDay) {
  const entry = weatherCodes[code] || { label: "Unknown", day: "🌡️", night: "🌡️" };
  return isDay ? entry.day : entry.night;
}

function formatTime(value) {
  if (!value) return "--:--";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function renderCurrentWeather(data, locationName) {
  const current = data.current;
  const daily = data.daily;
  const code = current.weather_code;
  const isDay = current.is_day === 1;
  const icon = getWeatherLabel(code, isDay);

  weatherIconEl.textContent = icon;
  cityNameEl.textContent = locationName;
  currentDateEl.textContent = formatDate(new Date());
  temperatureEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionEl.textContent =
    weatherCodes[code]?.label || "Weather unavailable";
  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidityEl.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  sunriseEl.textContent = formatTime(daily.sunrise[0]);
  sunsetEl.textContent = formatTime(daily.sunset[0]);
}

function renderForecast(data) {
  const daily = data.daily;
  const forecastDays = daily.time.slice(0, 7);

  forecastEl.innerHTML = forecastDays
    .map((date, index) => {
      const code = daily.weather_code[index];
      const maxTemp = Math.round(daily.temperature_2m_max[index]);
      const minTemp = Math.round(daily.temperature_2m_min[index]);
      const isDay = true;

      return `
        <div class="forecast-card">
          <div class="day">${new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          })}</div>
          <div class="forecast-icon">${getWeatherLabel(code, isDay)}</div>
          <div class="temp-range">${maxTemp}° / ${minTemp}°</div>
        </div>
      `;
    })
    .join("");
}

async function fetchWeather(lat, lon, name) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Weather data could not be fetched.");
  }

  const data = await response.json();
  renderCurrentWeather(data, name);
  renderForecast(data);
}

async function searchCity(city) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error("City lookup failed.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Try another search.");
  }

  const place = data.results[0];
  const name = `${place.name}, ${place.country || ""}`.trim();

  await fetchWeather(place.latitude, place.longitude, name);
}

async function searchByUserLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&limit=1&language=en&format=json`;
        const response = await fetch(reverseUrl);

        if (!response.ok) {
          throw new Error("Could not resolve your location.");
        }

        const data = await response.json();
        const place = data.results?.[0];

        const locationName = place
          ? `${place.name}, ${place.country || ""}`.trim()
          : "Current Location";

        await fetchWeather(lat, lon, locationName);
      } catch (error) {
        console.error(error);
        alert("Unable to determine your location.");
      }
    },
    (error) => {
      console.error(error);
      alert("Location access denied. Please use a city search instead.");
    }
  );
}

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city.");
    return;
  }

  try {
    await searchCity(city);
  } catch (error) {
    alert(error.message);
  }
});

cityInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
      await searchCity(city);
    } catch (error) {
      alert(error.message);
    }
  }
});

locationBtn.addEventListener("click", searchByUserLocation);

// Initial default load
(async function init() {
  try {
    await searchCity(defaultCity);
  } catch (error) {
    console.error(error);
  }
})();