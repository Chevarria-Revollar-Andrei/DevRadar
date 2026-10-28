// Carga variables de entorno (puerto y origen permitido para CORS).
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./rutas/api.routes');

// Crea la aplicación Express y configura el acceso desde la interfaz React.
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
// Agrupa todas las rutas bajo el prefijo /api.
app.use('/api', apiRoutes);
app.get('/', (_req, res) => res.json({ name: 'DevRadar API', status: 'online', docs: '/api/health' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

app.listen(PORT, () => console.log(`DevRadar backend disponible en http://localhost:${PORT}`));
