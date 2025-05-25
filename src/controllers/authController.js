const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendEmail, generateOTP } = require('../utils/emailService');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();


// Signup function
exports.signup = async (req, res) => {
    const { firstName, lastName, phoneNumber, password, email,referredBy } = req.body;

    try {
        // Check if user already exists with phone number or email
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(409).json({ 
                message: 'User already exists with this Email' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword
        });

        // Send verification email (optional)
        //await sendEmail(newUser.email, 'Welcome!', 'Thank you for signing up!');

        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
};

// Login function
exports.login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Forgot Password Step 1: Request OTP
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found with this email' 
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP with user email and timestamp
        otpStore.set(email, {
            otp,
            timestamp: Date.now(),
            attempts: 0
        });

        console.log(otp);
        
        // Send OTP via email
        // await sendEmail(
        //     email,
        //     'Password Reset OTP',
        //     `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`
        // );

        res.status(200).json({
            status: 'success',
            message: 'OTP has been sent to your email'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error processing password reset request'
        });
    }
};

// Step 2: Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpData = otpStore.get(email);

        if (!otpData) {
            return res.status(400).json({
                status: 'error',
                message: 'No OTP request found. Please request a new OTP'
            });
        }

        // Check OTP expiration (10 minutes)
        if (Date.now() - otpData.timestamp > 600000) {
            otpStore.delete(email);
            return res.status(400).json({
                status: 'error',
                message: 'OTP has expired. Please request a new one'
            });
        }

        // Verify OTP
        if (otpData.otp !== otp) {
            otpData.attempts += 1;
            
            // Lock after 3 failed attempts
            if (otpData.attempts >= 3) {
                otpStore.delete(email);
                return res.status(400).json({
                    status: 'error',
                    message: 'Too many failed attempts. Please request a new OTP'
                });
            }

            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP'
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        // Clear OTP
        otpStore.delete(email);

        res.status(200).json({
            status: 'success',
            message: 'OTP verified successfully',
            resetToken
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error verifying OTP'
        });
    }
};

// Step 3: Reset Password
// exports.resetPassword = async (req, res) => {
//     const { newPassword } = req.body;    
//     const resetToken = req.headers.authorization;
//     console.log(resetToken);

//     if (!resetToken) {
//         return res.status(401).json({
//             status: 'error',
//             message: 'Reset token is required'
//         });
//     }

//     try {
//         const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//         const user = await User.findOne({ where: { email: decoded.email } });

//         if (!user) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'User not found'
//             });
//         }

//         // Hash and update password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         await user.update({ password: hashedPassword });
//         user.save();
//         res.status(200).json({
//             status: 'success',
//             message: 'Password has been reset successfully'
//         });

//     } catch (error) {
//         console.error('Password reset error:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Error resetting password'
//         });
//     }
// };
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const resetToken = req.headers.authorization;

    if (!resetToken) {
        return res.status(401).json({
            status: 'error',
            message: 'Reset token is required'
        });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        
        // Find user and force update password
        const [updateCount] = await User.update(
            { 
                password: await bcrypt.hash(newPassword, 10)
            },
            { 
                where: { 
                    email: decoded.email 
                }
            }
        );
        console.log(updateCount);
    //    await User.save();    

        if (updateCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found or password update failed'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error resetting password',
            error: error.message
        });
    }
};