const User = require('../models/User');
const aiService = require('../services/aiService');

const analyzeGoal = async (req, res) => {
  try {
    const { email, goal, language } = req.body;

    // 1. Find or create user
    let [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: { language: language || 'en' }
    });

    // 2. IA Analysis
    const aiResult = await aiService.analyzeUserOnboarding(user, { goal });

    // 3. Persist niche assignment
    user.niche_id = aiResult.nicheId;
    await user.save();

    // 4. Final Response
    res.status(200).json({
      status: "success",
      user: {
        email: user.email,
        niche: aiResult.nicheName,
        aiGreeting: aiResult.greeting
      }
    });

  } catch (error) {
    console.error("Onboarding Controller Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzeGoal };