// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables

const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // Gmail App Password
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });

    console.log('✅ Email sent:', info.response);
    return true;

  } catch (err) {
    console.error('❌ Error sending email:', err);
    return false;
  }
};

module.exports = sendEmail;
