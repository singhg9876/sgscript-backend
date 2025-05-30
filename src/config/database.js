const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize connection
const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

module.exports = connection;