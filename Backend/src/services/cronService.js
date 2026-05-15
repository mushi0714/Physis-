const cron = require('node-cron');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Milestone = require('../models/Milestone');
const DailyLog = require('../models/DailyLog');

const startCronJobs = () => {
  // Ejecutar todos los días a la medianoche (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Ejecutando reinicio diario de Homeostasis...');
    
    try {
      const today = new Date().toISOString().split('T')[0];

      const users = await User.findAll({
        include: [{ 
          model: Plan, 
          where: { status: 'ACTIVE' }, 
          required: false,
          include: [{ model: Milestone, as: 'milestones' }]
        }]
      });

      for (const user of users) {
        // Guardar el log del día
        await DailyLog.findOrCreate({
          where: { user_id: user.id, date: today },
          defaults: { score: user.homeostasis_score }
        });

        // Reiniciar los hitos a "PENDING"
        if (user.Plans && user.Plans.length > 0) {
          const activePlan = user.Plans[0];
          if (activePlan.milestones) {
            for (const milestone of activePlan.milestones) {
              milestone.status = 'PENDING';
              await milestone.save();
            }
          }
        }
      }
      console.log('✅ Reinicio diario completado.');
    } catch (error) {
      console.error('❌ Error en el cron de reinicio diario:', error);
    }
  });
};

module.exports = { startCronJobs };