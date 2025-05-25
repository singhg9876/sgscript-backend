const validateSignup = (req, res, next) => {
    const { firstName, lastName, phoneNumber, password, email } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !phoneNumber || !password || !email) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    // Validate firstName and lastName (only letters allowed)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({
            status: 'error',
            message: 'First name and last name should only contain letters'
        });
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
            status: 'error',
            message: 'Phone number should be 10 digits'
        });
    }

    // Validate password (minimum 8 characters, at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 8 characters long and contain at least one letter and one number'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }
    // If all validations pass, proceed to the next middleware

    next();
};

const validateLogin = (req, res, next) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Phone number and password are required'
        });
    }

    next();
};

const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Email is required'
        });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid phone number format'
        });
    }

    next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateForgotPassword
};