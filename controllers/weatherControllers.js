// controllers/weatherController.js
const City = require("../models/City");
const Alert = require("../models/Alert");
const { getWeatherData } = require("../services/weatherService");
// const logger = require("../utils/logger");

exports.registerCity = async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ message: "City name is required" });

  try {
    const existingCity = await City.findOne({ name: city });
    if (existingCity)
      return res.status(400).json({ message: "City already registered" });

    const newCity = new City({ name: city });
    await newCity.save();

    res.status(201).json({ message: `City ${city} registered successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error registering city" });
  }
};
// controllers/weatherController.js
const axios = require("axios");
// const cache = require("../utils/cache");
// const City = require("../models/cityModel");

exports.getWeather = async (req, res) => {
  try {
    const cities = await City.find({});
    if (!cities.length)
      return res.status(400).json({ message: "No cities registered" });

    let weatherData = {};
    await Promise.all(
      cities.map(async (city) => {
        let cachedWeather = cache.get(city.name);
        if (cachedWeather) {
          weatherData[city.name] = cachedWeather;
        } else {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${process.env.WEATHER_API_KEY}`
            );
            cache.set(city.name, response.data);
            weatherData[city.name] = response.data;
          } catch (error) {
            weatherData[city.name] = { error: "Weather data unavailable" };
          }
        }
      })
    );

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

exports.setWeatherAlert = async (req, res) => {
  const { city, condition, threshold, alertType } = req.body;

  console.log("Received request to set weather alert:", req.body);

  // Validate the request body
  if (!city || !condition || !threshold || !alertType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new weather alert
    const newAlert = new Alert({
      city,
      condition,
      threshold,
      alertType,
    });

    const savedAlert = await newAlert.save();
    if (!savedAlert || !savedAlert._id) {
      return res
        .status(500)
        .json({ message: "Failed to save the alert to the database." });
    }
    res
      .status(201)
      .json({ message: "Weather alert set successfully", alert: newAlert });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error setting weather alert", error: error.message });
  }
};
