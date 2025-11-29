import express from 'express';
import cors from 'cors';
import { initializeDatabase, pool } from './src/infra/db/connection.js';
import { apiRouter } from './src/routes/api.routes.js';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.use('/api/v1/metrics', apiRouter);

app.get('/health', async (req, res) => {
  const startedAt = Date.now();

  try {
    await pool.query('SELECT 1');
    const responseTimeMs = Date.now() - startedAt;

    return res.json({
      service: 'ms-metricas',
      status: 'UP',
      message: 'Base de datos PSP accesible y servidor operativo.',
      responseTimeMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[MS-Métricas] Healthcheck falló:', error.message);
    const responseTimeMs = Date.now() - startedAt;

    return res.status(500).json({
      service: 'ms-metricas',
      status: 'DOWN',
      message: 'Error al conectar con la base de datos PSP.',
      error: error.message,
      responseTimeMs,
      timestamp: new Date().toISOString(),
    });
  }
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`MS-Métricas (PSP) corriendo en http://localhost:${PORT}`);
      console.log('Rutas disponibles en /api/v1/metrics');
      console.log('Healthcheck disponible en /health');
    });
  } catch (error) {
    console.error('Fallo al iniciar el servidor MS-Métricas:', error);
    process.exit(1);
  }
}

startServer();
