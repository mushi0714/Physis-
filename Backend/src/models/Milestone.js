const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  
  // Ej: "Comprar Vuelos", "Ahorrar $1000"
  title: { type: DataTypes.STRING, allowNull: false },
  
  // La estrategia específica sugerida por la IA para este paso
  description: { type: DataTypes.TEXT },
  
  // Estado de este bloque específico
  status: { 
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'), 
    defaultValue: 'PENDING' 
  },
  
  // El orden lógico: 1, 2, 3... (La IA definirá cuál se hace primero)
  order: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Milestone;