const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ZenSession = sequelize.define('ZenSession', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  duration_minutes: { type: DataTypes.INTEGER, defaultValue: 25 },
  ambient_audio: { type: DataTypes.STRING },
  is_completed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = ZenSession;