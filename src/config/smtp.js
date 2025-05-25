const nodemailer = require('nodemailer');

const smtpConfig = {
    service: 'Gmail', // Example: 'Gmail', 'Yahoo', etc.
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS  // Your email password or app password
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;