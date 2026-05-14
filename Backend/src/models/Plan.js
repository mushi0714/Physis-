const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  
  // Ej: "Viaje a Japón 2026", "Aprobar Examen de Grado"
  title: { type: DataTypes.STRING, allowNull: false },
  
  // Estado general del plan
  status: { 
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'COMPLETED'), 
    defaultValue: 'ACTIVE' 
  },
  
  // Aquí guardaremos el texto no repetitivo que genere la IA en el onboarding
  ai_diagnosis: { type: DataTypes.TEXT },
  
  // Termómetro de Homeostasis (0 a 100%)
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Plan;