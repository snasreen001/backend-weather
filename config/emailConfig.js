const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: "gmail", // Or any other email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

const sendAlertEmail = async (to, city, temperature, threshold) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL,
    subject: `Weather Alert for ${city}`,
    text: `The temperature in ${city} has crossed the threshold of ${threshold}°C. Current temperature: ${temperature}°C.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Alert email sent to ${to} for ${city}`);
  } catch (error) {
    console.error(" Error sending email:", error);
  }
};

module.exports = sendAlertEmail;
