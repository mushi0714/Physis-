const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Crear el usuario en la DB real que acabas de configurar
    const newUser = await User.create({ email, password });
    
    res.status(201).json({
      message: 'Usuario creado en Physis con éxito',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar: ' + error.message });
  }
};