const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Your SendGrid API key

// Function to send email notifications
const sendNotification = async (userId, message) => {
  // You can fetch the user's email from the database using their userId
  const user = await User.findById(userId);

  const msg = {
    to: user.email,
    from: "your-email@example.com", // Your verified SendGrid email
    subject: "Weather Alert",
    text: message,
  };

  try {
    await sgMail.send(msg);
    console.log(`Alert email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

module.exports = sendNotification;
