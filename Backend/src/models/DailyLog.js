const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyLog = sequelize.define('DailyLog', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  user_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  // Guarda solo la fecha (ej: "2026-05-15")
  date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  // El puntaje final con el que cerró ese día
  score: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
});

module.exports = DailyLog;