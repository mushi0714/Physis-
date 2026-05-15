const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/secure-account', userController.secureAccount);
router.post('/login', userController.login);

// Ruta para recuperar sesión
router.get('/me', authMiddleware, userController.getMe);

// Ruta para completar hitos
router.patch('/milestones/:id/complete', userController.completeMilestone);

// NUEVO: Ruta para actualizar la meta y regenerar protocolo/ritmo
router.post('/update-goal', authMiddleware, userController.updateGoal);

module.exports = router;