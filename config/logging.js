const winston = require("winston");

// Create a custom log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the Winston logger
const logger = winston.createLogger({
  level: "info", // Default log level, change to 'debug' or 'warn' as needed
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    // Log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Color the log levels in the console
        winston.format.simple()
      ),
    }),

    // Log to a file
    new winston.transports.File({
      filename: "logs/app.log", // Path where logs will be saved
      level: "info", // Log level for the file transport
      format: winston.format.combine(winston.format.timestamp(), logFormat),
    }),
  ],
});

module.exports = logger;
