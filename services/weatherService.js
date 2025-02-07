const axios = require("axios");
// const cache = require("../utils/cache"); // Optional caching utility
// const logger = require("../utils/logger"); // Logger for error tracking

// Fetch the current weather data from OpenWeatherMap
const getWeatherData = async (city) => {
  // Check if weather data is cached
  const cachedData = cache.get(city);
  if (cachedData) return cachedData;

  const apiKey = process.env.WEATHER_API_KEY; // Your OpenWeatherMap API key

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    const weatherData = response.data;
    cache.set(city, weatherData); // Cache the weather data
    return weatherData;
  } catch (error) {
    logger.error(`Error fetching weather data for ${city}`, error);
    return null;
  }
};

module.exports = { getWeatherData };
