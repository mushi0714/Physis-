require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

// Importar Modelos
const User = require('./src/models/User');
const Plan = require('./src/models/Plan');
const Milestone = require('./src/models/Milestone');
const Niche = require('./src/models/Niche');
const DailyLog = require('./src/models/DailyLog');

// Importar Rutas
const onboardingRoutes = require('./src/routes/onboardingRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { startCronJobs } = require('./src/services/cronService');

const app = express();
app.use(cors());
app.use(express.json());

// Definir Relaciones
User.belongsTo(Niche, { foreignKey: 'niche_id' });
Niche.hasMany(User, { foreignKey: 'niche_id' });

User.hasMany(Plan, { foreignKey: 'user_id' });
Plan.belongsTo(User, { foreignKey: 'user_id' });

Plan.belongsTo(Niche, { foreignKey: 'niche_id' });
Niche.hasMany(Plan, { foreignKey: 'niche_id' });

Plan.hasMany(Milestone, { foreignKey: 'plan_id', as: 'milestones' });
Milestone.belongsTo(Plan, { foreignKey: 'plan_id' });

User.hasMany(DailyLog, { foreignKey: 'user_id', as: 'logs' });
DailyLog.belongsTo(User, { foreignKey: 'user_id' });

// Configurar Rutas
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log("⏳ Starting Physis boot sequence...");
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database synchronized.");

    const niches = ['Prosper', 'Serenity', 'Scholar'];
    for (const name of niches) {
      await Niche.findOrCreate({ where: { name } });
    }
    console.log("✅ Niches verified.");

    startCronJobs();
    console.log("⏰ Cron jobs activated.");

    app.listen(PORT, () => {
      console.log("-------------------------------------------------------");
      console.log(`🚀 PHYSIS BACKEND ONLINE: http://localhost:${PORT}`);
      console.log("-------------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();