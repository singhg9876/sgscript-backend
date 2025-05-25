const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

// Method to find user by phone number
User.findByPhoneNumber = async function(phoneNumber) {
    return await this.findOne({ where: { phoneNumber } });
};

// Method to create a new user
User.createUser = async function(userData) {
    return await this.create(userData);
};

module.exports = User;