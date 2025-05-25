const nodemailer = require('nodemailer');
const smtpConfig = require('../config/smtp');

const transporter = nodemailer.createTransport(smtpConfig);

const sendVerificationEmail = (to, verificationLink) => {
    const mailOptions = {
        from: smtpConfig.auth.user,
        to,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    return transporter.sendMail(mailOptions);
};

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const sendPasswordResetEmail = (to, resetLink) => {
    const mailOptions = {
        from: smtpConfig.auth.user,
        to,
        subject: 'Password Reset',
        text: `You can reset your password by clicking on the following link: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    generateOTP,
    sendEmail
};