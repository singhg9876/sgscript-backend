const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');

const router = express.Router();

// Signup route
router.post('/signup', authValidator.validateSignup, authController.signup);

// Login route
router.post('/login', authValidator.validateLogin, authController.login);

// Password reset route
router.post('/forgot-password', authValidator.validateForgotPassword, authController.forgotPassword);

router.post('/verify-otp', authController.verifyOTP);

router.post('/reset-password', authController.resetPassword);

module.exports = router;