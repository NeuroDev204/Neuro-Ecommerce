const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  // Send an email using async/await
  (async () => {
    const info = await transporter.sendMail({
      from: '"Reset Password" <phamvansy204@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text, // Plain-text version of the message
      html: data.htm, // HTML version of the message
    });

    console.log("Message sent:", info.messageId);
  })();
});

module.exports = { sendEmail };
