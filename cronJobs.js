const cron = require("node-cron");
const redis = require("./config/redisConfig"); // Redis config for caching
const axios = require("axios");
const sendAlertEmail = require("./config/emailConfig");
const City = require("./models/City"); // ✅ Import the City model
require("dotenv").config();

// OpenWeather API endpoint and API key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Use environment variables
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather";
const TEMP_THRESHOLD = 10; // Temperature threshold (e.g., 10°C)

// Email alert function
const sendEmailAlert = (cityName, temperature) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variables
    to: "recipient_email@example.com", // Replace with the recipient email
    subject: `Weather Alert: Temperature for ${cityName} Exceeded Threshold`,
    text: `The temperature in ${cityName} has exceeded the threshold. Current temperature: ${temperature}°C.`,
  };

  sendAlertEmail(mailOptions) // ✅ Use the correct email function
    .then((info) => console.log("Email sent:", info.response))
    .catch((error) => console.error("Error sending email:", error));
};

// Fetch weather data from OpenWeather API
const fetchWeather = async (cityName) => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        q: cityName,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error.message);
    return null;
  }
};

// Check weather for registered cities
const checkWeatherForCities = async () => {
  try {
    const cities = await City.find(); // ✅ Ensure City model is imported

    if (!cities || cities.length === 0) {
      console.log("No cities found in the database.");
      return;
    }

    for (const city of cities) {
      const cityWeather = await fetchWeather(city.name);
      if (cityWeather) {
        const temperature = cityWeather.main.temp;
        console.log(`Weather in ${city.name}: ${temperature}°C`);

        // Send alert if temperature exceeds the threshold
        if (temperature > TEMP_THRESHOLD) {
          sendEmailAlert(city.name, temperature);
        }
      }
    }
  } catch (error) {
    console.error("Error checking weather for cities:", error.message);
  }
};

// Schedule the cron job (runs every hour)
cron.schedule("* * * * *", checkWeatherForCities); // ✅ Corrected cron expression for every hour
console.log("⏳ Weather monitoring job scheduled...");
