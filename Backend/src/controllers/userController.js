const User = require('../models/User');
const Milestone = require('../models/Milestone');
const Plan = require('../models/Plan');
const Niche = require('../models/Niche');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Función de apoyo para armar los datos del usuario para el Dashboard
const buildUserDashboardData = (user) => {
  let protocol = [];
  let aiGreeting = "Welcome back to your center.";

  if (user.Plans && user.Plans.length > 0) {
    const activePlan = user.Plans[0];
    aiGreeting = activePlan.ai_diagnosis || aiGreeting;
    
    if (activePlan.milestones) {
      // Ordenamos las tareas por su campo "order" y mapeamos al formato del Frontend
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

  return {
    email: user.email,
    niche: user.Niche ? user.Niche.name : 'Unknown',
    aiGreeting: aiGreeting,
    protocol: protocol,
    homeostasis_score: user.homeostasis_score
  };
};

// 1. Secure account
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

// 2. Login function (ACTUALIZADA para devolver todo el perfil)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscamos al usuario incluyendo sus Relaciones (Nicho, Planes, Milestones)
    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Niche },
        { 
          model: Plan, 
          where: { status: 'ACTIVE' }, 
          required: false,
          include: [{ model: Milestone, as: 'milestones' }] 
        }
      ]
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      status: "success",
      token,
      user: buildUserDashboardData(user)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Me function (NUEVO: Para persistencia de sesión al recargar la app)
const getMe = async (req, res) => {
  try {
    // req.user.id viene del authMiddleware
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Niche },
        { 
          model: Plan, 
          where: { status: 'ACTIVE' }, 
          required: false,
          include: [{ model: Milestone, as: 'milestones' }] 
        }
      ]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      status: "success",
      user: buildUserDashboardData(user)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Complete Milestone
const completeMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const milestone = await Milestone.findByPk(id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.status = 'COMPLETED';
    await milestone.save();

    const user = await User.findOne({ where: { email } });
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

module.exports = { secureAccount, login, getMe, completeMilestone };