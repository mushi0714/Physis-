require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

// Models
const User = require('./src/models/User');
const Niche = require('./src/models/Niche');
const Plan = require('./src/models/Plan');
const Milestone = require('./src/models/Milestone');

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Database Relations
User.belongsTo(Niche, { foreignKey: 'niche_id' });
Niche.hasMany(User, { foreignKey: 'niche_id' });
User.hasMany(Plan, { foreignKey: 'user_id' });
Plan.belongsTo(User, { foreignKey: 'user_id' });
Niche.hasMany(Plan, { foreignKey: 'niche_id' });
Plan.belongsTo(Niche, { foreignKey: 'niche_id' });
Plan.hasMany(Milestone, { foreignKey: 'plan_id', as: 'milestones' });
Milestone.belongsTo(Plan, { foreignKey: 'plan_id' });

// Routes
const onboardingRoutes = require('./src/routes/onboardingRoutes');
app.use('/api/onboarding', onboardingRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('⏳ Starting Physis boot sequence...');
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database synchronized.');

    // SEED NICHES: Ensures AI can assign valid IDs
    const initialNiches = [
      { id: 1, name: 'Prosper', description: 'Growth and productivity' },
      { id: 2, name: 'Serenity', description: 'Peace and balance' },
      { id: 3, name: 'Scholar', description: 'Knowledge and focus' }
    ];

    for (const n of initialNiches) {
      await Niche.findOrCreate({ where: { id: n.id }, defaults: n });
    }
    console.log('✅ Niches verified.');

    app.listen(PORT, () => {
      console.log('-------------------------------------------------------');
      console.log(`🚀 PHYSIS BACKEND ONLINE: http://localhost:${PORT}`);
      console.log('-------------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ CRITICAL SERVER ERROR:', error.message);
    process.exit(1); 
  }
}

startServer();