require('dotenv').config();
const nodemailer = require('nodemailer');
const net = require('net');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logging
    logger: true // Enable built-in logger
});


transporter.verify()
    .then(() => {
        console.log('Server is ready to take messages');
    })
    .catch(err => {
        console.log('Full error object:', JSON.stringify(err, null, 2));
        console.log('Connection settings used:', {
            host: err.address,
            port: err.port,
            error: err.code
        });
    });
// Function to send the reset email
const sendResetEmail = async (to, token) => {
    console.log(to)
  const resetLink = `https://vmlab/pages/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };
  console.log(mailOptions)

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendResetEmail;
