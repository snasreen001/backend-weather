const cron = require("node-cron");
const Alert = require("../models/Alert");
const { getWeatherData } = require("./weatherService");
const logger = require("../utils/logger");
const sendNotification = require("../utils/sendNotification"); // Assuming you have an email or SMS notification service

// Function to check and trigger weather alerts
const checkWeatherAlerts = async () => {
  try {
    // Get all active alerts from the database
    const alerts = await Alert.find({});

    // Loop through each alert and check the weather condition
    for (const alert of alerts) {
      const weatherData = await getWeatherData(alert.city); // Get weather data for the city

      if (weatherData) {
        const { temperature, rain, humidity } = weatherData.main;

        let conditionMet = false;
        if (alert.condition === "temperature") {
          if (alert.alertType === "above" && temperature > alert.threshold) {
            conditionMet = true;
          } else if (
            alert.alertType === "below" &&
            temperature < alert.threshold
          ) {
            conditionMet = true;
          }
        } else if (alert.condition === "rain" && rain > alert.threshold) {
          conditionMet = true;
        } else if (
          alert.condition === "humidity" &&
          humidity > alert.threshold
        ) {
          conditionMet = true;
        }

        if (conditionMet) {
          logger.info(
            `Alert triggered for ${alert.city}: ${alert.condition} ${alert.alertType} ${alert.threshold}`
          );
          sendNotification(
            alert.userId,
            `Weather alert triggered for ${alert.city}`
          ); // Send notification
        }
      }
    }
  } catch (error) {
    logger.error("Error checking weather alerts", error);
  }
};

// Schedule the check every 30 minutes (you can change the frequency)
cron.schedule("*/30 * * * *", checkWeatherAlerts);

module.exports = { checkWeatherAlerts };
