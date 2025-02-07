const Redis = require("ioredis");
// Connect to Redis server (localhost:6379 by default)
const redis = new Redis({
  host: "127.0.0.1", // Redis server IP
  port: 6379, // Redis server port
  // You can add password or any other configs if necessary
});

redis.on("connect", () => {
  console.log("Redis connected successfully!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.get("London", (err, cachedData) => {
  if (cachedData) {
    console.log("Cached data:", JSON.parse(cachedData));
  }
});

module.exports = redis;
