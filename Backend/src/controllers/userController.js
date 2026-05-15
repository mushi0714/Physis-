const User = require('../models/User');
const Milestone = require('../models/Milestone');
const Plan = require('../models/Plan');
const Niche = require('../models/Niche');
const DailyLog = require('../models/DailyLog');
const aiService = require('../services/aiService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const buildUserDashboardData = (user) => {
  let protocol = [];
  let rhythm = [];
  let logs = [];
  let aiGreeting = "Welcome back to your center.";

  if (user.Plans && user.Plans.length > 0) {
    const activePlan = user.Plans[0];
    aiGreeting = activePlan.ai_diagnosis || aiGreeting;
    rhythm = activePlan.ai_rhythm || [];
    
    if (activePlan.milestones) {
      protocol = activePlan.milestones
        .sort((a, b) => a.order - b.order)
        .map(m => ({
          id: m.id,
          title: m.title,
          duration: m.description, 
          status: m.status
        }));
    }
  }

  if (user.logs) {
    logs = user.logs.map(log => ({
      date: log.date,
      score: log.score
    }));
  }

  return {
    email: user.email,
    niche: user.Niche ? user.Niche.name : 'Unknown',
    aiGreeting: aiGreeting,
    protocol: protocol,
    rhythm: rhythm,
    logs: logs,
    homeostasis_score: user.homeostasis_score
  };
};

const secureAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ status: "success", message: "Account secured successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Niche },
        { model: DailyLog, as: 'logs' },
        { model: Plan, where: { status: 'ACTIVE' }, required: false, include: [{ model: Milestone, as: 'milestones' }] }
      ]
    });

    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ status: "success", token, user: buildUserDashboardData(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Niche },
        { model: DailyLog, as: 'logs' },
        { model: Plan, where: { status: 'ACTIVE' }, required: false, include: [{ model: Milestone, as: 'milestones' }] }
      ]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ status: "success", user: buildUserDashboardData(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.status = 'COMPLETED';
    await milestone.save();

    const plan = await Plan.findByPk(milestone.plan_id);
    const user = await User.findByPk(plan.user_id);
    
    if (user) {
      const newScore = Math.min(user.homeostasis_score + 5, 100);
      user.homeostasis_score = newScore;
      await user.save();
      return res.status(200).json({ status: "success", newScore: user.homeostasis_score });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVA FUNCIÓN: Cambiar Meta de Vida y regenerar todo con la IA
const updateGoal = async (req, res) => {
  try {
    const { goal } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Llamar a la IA con la nueva meta
    const aiResult = await aiService.analyzeUserOnboarding(user, { goal });

    // 2. Actualizar el nicho del usuario si cambió
    user.niche_id = aiResult.nicheId;
    await user.save();

    // 3. Desactivar o pausar el plan viejo
    await Plan.update({ status: 'COMPLETED' }, { where: { user_id: user.id, status: 'ACTIVE' } });

    // 4. Crear el nuevo plan con el ritmo e hitos de la IA
    const planTitle = user.language === 'es' ? 'Protocolo Actualizado' : 'Updated Protocol';
    const newPlan = await Plan.create({
      user_id: user.id,
      niche_id: aiResult.nicheId,
      title: planTitle,
      status: 'ACTIVE',
      ai_diagnosis: aiResult.greeting,
      ai_rhythm: aiResult.rhythm,
      progress: 0
    });

    const milestonesToInsert = aiResult.protocol.map((task, index) => ({
      plan_id: newPlan.id,
      title: task.title,
      description: task.duration, 
      status: 'PENDING',
      order: index + 1
    }));
    
    await Milestone.bulkCreate(milestonesToInsert);

    // 5. Traer de vuelta al usuario con sus nuevas estructuras para compilar la respuesta
    const updatedUser = await User.findByPk(user.id, {
      include: [
        { model: Niche },
        { model: DailyLog, as: 'logs' },
        { model: Plan, where: { status: 'ACTIVE' }, required: false, include: [{ model: Milestone, as: 'milestones' }] }
      ]
    });

    res.status(200).json({
      status: "success",
      user: buildUserDashboardData(updatedUser)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { secureAccount, login, getMe, completeMilestone, updateGoal };