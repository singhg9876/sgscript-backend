const express = require('express');
const { signup, login, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidator');

const router = express.Router();

// Signup route
router.post('/signup', validateSignup, signup);

// Login route
router.post('/login', validateLogin, login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

router.post('/verify-otp', verifyOTP);

router.post('/reset-password', resetPassword);

module.exports = router;