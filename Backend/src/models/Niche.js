const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Niche = sequelize.define('Niche', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  ai_context: { type: DataTypes.TEXT }
});

module.exports = Niche;