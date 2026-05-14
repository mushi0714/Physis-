const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

// Route matches Frontend call: POST /api/onboarding/analyze
router.post('/analyze', onboardingController.analyzeGoal);

module.exports = router;