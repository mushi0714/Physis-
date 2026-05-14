const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para registro
router.post('/register', userController.registerUser);

module.exports = router;