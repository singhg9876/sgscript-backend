// src/controllers/userController.js

const User = require('../models/user');

// Fetch user details by ID
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update user information
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await User.update(userId, updatedData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};