const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherControllers");
const logger = require("../config/logging");
const axios = require("axios");
const redis = require("../config/redisConfig"); // Import Redis config
const City = require("../models/City"); // Import City model

router.post("/set", weatherController.setWeatherAlert);

const WEATHER_API_KEY = "3c51f1a6bb090964055c6454b52944b9"; // Replace with your actual OpenWeather API key
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather";

const fetchWeather = async (cityName) => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        q: cityName,
        appid: WEATHER_API_KEY,
        units: "metric", // Use 'metric' for Celsius
      },
      headers: {
        "Cache-Control": "no-cache", // Prevent caching
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    return null;
  }
};

router.post("/registerMultiple", async (req, res) => {
  const { cities } = req.body; // Expecting an array of city names

  if (!cities || !Array.isArray(cities) || cities.length === 0) {
    return res
      .status(400)
      .json({ message: "City names are required and should be an array" });
  }

  try {
    // Save each city to the database
    const savedCities = [];
    for (const cityName of cities) {
      const city = new City({ name: cityName });
      await city.save();
      savedCities.push(city);
    }

    return res.status(200).json({
      message: `${savedCities.length} cities registered successfully!`,
      cities: savedCities,
    });
  } catch (error) {
    console.error("Error registering cities:", error);
    return res.status(500).json({ message: "Failed to register cities" });
  }
});

router.get("/weather/all", async (req, res) => {
  try {
    // Fetch all registered cities from the database
    const cities = await City.find(); // Assuming you have a City model

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: "No cities found" });
    }

    const weatherData = [];
    for (let city of cities) {
      const cityWeather = await fetchWeather(city.name);
      if (cityWeather) {
        weatherData.push({
          city: city.name,
          weather: cityWeather.weather[0].description,
          temperature: cityWeather.main.temp,
        });
        console.log(
          `Weather data for ${city.name}:`,
          cityWeather.weather[0].description,
          "Temperature:",
          cityWeather.main.temp
        );
      }
    }

    res.status(200).json({
      message: "Weather data for all registered cities",
      weatherData: weatherData,
    });
  } catch (error) {
    console.error("Error fetching weather data for cities:", error);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});
module.exports = router;
