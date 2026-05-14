const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: "A token is required for authentication" });
  }

  try {
    // El formato suele ser "Bearer <token>", así que lo separamos
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el ID del usuario en la request
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;