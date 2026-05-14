const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CORRECCIÓN APLICADA AQUÍ: Buscando en la carpeta 'middlewares' (con 's')
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/secure-account', userController.secureAccount);
router.post('/login', userController.login);

// Ruta para recuperar sesión
router.get('/me', authMiddleware, userController.getMe);

// Ruta para completar hitos
router.patch('/milestones/:id/complete', userController.completeMilestone);

module.exports = router;