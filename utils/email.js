const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Andrew McMechan <${process.env.EMAIL_FROM}>`;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      // TODO: sendGrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // 1. render html from pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.firstName,
        url: this.url,
        subject
      }
    );

    // 2. define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3. create a transport and send email
    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Password Reset Request (valid for only 10 minutes)'
    );
  }
};
