const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1. create transporter service
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Gmail, Yahoo, Outlook
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });

  // 2. define email options
  const mailOptions = {
    from: 'Andrew McMechan <coderwurst@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // TODO: html:
  };

  // 3. send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
