const User = require('../models/User');
const Plan = require('../models/Plan');
const Milestone = require('../models/Milestone');
const aiService = require('../services/aiService');

const analyzeGoal = async (req, res) => {
  try {
    const { email, goal, language } = req.body;

    // 1. Encontrar o crear usuario
    let [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: { language: language || 'en' }
    });

    // 2. IA genera el nicho y el protocolo (arreglo de 3 tareas)
    const aiResult = await aiService.analyzeUserOnboarding(user, { goal });

    // 3. Asignar nicho al usuario
    user.niche_id = aiResult.nicheId;
    await user.save();

    // 4. Crear el Plan inicial sincronizado con Plan.js (ENUM en Mayúsculas)
    const planTitle = language === 'es' ? 'Protocolo de Inicio' : 'Initial Protocol';
    
    const newPlan = await Plan.create({
      user_id: user.id,
      niche_id: aiResult.nicheId,
      title: planTitle,
      status: 'ACTIVE',         // Sincronizado con ENUM en Plan.js
      ai_diagnosis: aiResult.greeting,
      progress: 0
    });

    // 5. Guardar los Milestones (Sincronizado con Milestone.js)
    // Usamos el índice del map para llenar el campo "order"
    const milestonesToInsert = aiResult.protocol.map((task, index) => ({
      plan_id: newPlan.id,
      title: task.title,
      description: task.duration, // Guardamos la duración aquí
      status: 'PENDING',          // Sincronizado con ENUM en Milestone.js
      order: index + 1            // Campo obligatorio en Milestone.js
    }));
    
    await Milestone.bulkCreate(milestonesToInsert);

    // 6. Respuesta para el Frontend
    res.status(200).json({
      status: "success",
      user: {
        email: user.email,
        niche: aiResult.nicheName,
        aiGreeting: aiResult.greeting,
        protocol: aiResult.protocol 
      }
    });

  } catch (error) {
    console.error("Onboarding Controller Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzeGoal };