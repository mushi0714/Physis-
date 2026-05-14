const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  // CHANGED: password must be optional for initial onboarding synchronization
  password: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  
  // Language configuration
  language: { 
    type: DataTypes.STRING, 
    defaultValue: 'en' 
  },
  
  // Stores IDs of active plans in an array (max 3)
  active_plan_ids: { 
    type: DataTypes.ARRAY(DataTypes.INTEGER), 
    defaultValue: [] 
  },
  
  // Custom display name from onboarding
  display_name: { 
    type: DataTypes.STRING 
  },

  // Foreign key for niche assignment
  niche_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = User;