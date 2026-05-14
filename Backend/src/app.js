const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares Globales
app.use(helmet()); // Seguridad de encabezados
app.use(cors());   // Control de acceso
app.use(express.json());
app.use(morgan('dev')); // Logger para ver peticiones en consola

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Physis Online', version: '1.0.0' });
});


app.use('/api/users', userRoutes);

module.exports = app;