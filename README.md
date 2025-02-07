### <h1>Weather Alert Service</h1>

<h3>Overview</h3>
This backend service integrates with OpenWeather API to monitor weather conditions and send email alerts when temperature thresholds are exceeded. The service caches weather data using Redis and stores city/alert data in MongoDB.

<h3>Features</h3>
 Register a city for monitoring via Postman<br>
 <ul>
  <li>Get real-time weather details for registered cities</li>
 <li>Set up alerts based on temperature thresholds</li>
 <li>Send email alerts when the temperature exceeds the threshold</li> 
 <li>Cache weather data using Redis to reduce API calls</li>
 <li>Background jobs refresh weather data periodically</li>
 <li>Logging with Winston for error tracking</li>
 <li>Retry mechanism for failed API requests</li>
 <li>Unit tests with Jest & Supertest</li>
 </ul>
 

 <h3> Tech Stack</h3>
 <ul>
   <li>Backend: Node.js (Express.js)</li>

<li>Database: MongoDB (Mongoose ORM)</li>

<li>Cache: Redis (In-memory caching)</li>

<li>Scheduler: Node-cron (For periodic refresh)</li>

<li>Logging: Winston (For structured logging)</li>

<li>Email Notifications: Nodemailer</li>

<li>Testing: Jest & Supertest</li>

<li>API Integration: OpenWeather API</li>

<li>Dependency Management: npm</li>
 </ul>

 <h3>Setup Instructions</h3>
 <ul>
   <li>Clone the Repository</li>
 <li>Install Dependencies</li>
   `npm install`
 <li>Set Up Environment Variables</li>
 <li>Start MongoDB & Redis</li>
   `mongod  # Start MongoDB server<br>
redis-server  # Start Redis server`
 <li>Run the Backend Server</li>
 node server.js
 
 </ul>

 <h3>API Documentation</h3>
 <h4>Register a City using Postman</h4>
 POST http://localhost:5000/api/cities/registerMultiple
Content-Type: application/json

{
    "city": ["Mumbai","Delhi"]
}
<br>
<h4>Get Weather Data using Postman</h4>
GET http://localhost:5000/api/cities/weatherAll

<h4>Set Alert using postman</h4>
POST https://localhost:5000/api/alerts/set
<h4>Email Alert Trigger</h4>
When the temperature of a registered city exceeds the threshold, an email notification is sent to the configured email address.

<h4>Running Tests</h4>
<h5>Run jest tests</h5>

<h3>Future Improvements</h3>
<ul>
  <li>User authentication (secure API endpoints).</li>
  <li>SMS notifications for alerts.</li>
  <li>Frontend Dashboard for monitoring weather.
</li>

</ul>
npm test

<h5>Expected Output:</h5>
PASS  routes.test.js<br>
PASS  weather.test.js

 
