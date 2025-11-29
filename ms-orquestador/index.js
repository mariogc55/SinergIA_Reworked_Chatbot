import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.ORCHESTRATOR_PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔹 Definición de servicios monitoreados por el orquestador
const SERVICES = [
  {
    key: 'orchestrator',
    name: 'MS-Orquestador',
    type: 'internal',
  },
  {
    key: 'integracion',
    name: 'MS-Integración',
    type: 'http',
    url: 'http://localhost:3001/health',
  },
  {
    key: 'metricas',
    name: 'MS-Métricas (PSP)',
    type: 'http',
    url: 'http://localhost:3002/health',
  },
];

// 🔹 Endpoint de estado global consumido por la vista /status del frontend
app.get('/api/v1/status', async (req, res) => {
  const checkedAt = new Date().toISOString();

  const results = await Promise.all(
    SERVICES.map(async (service) => {
      // El propio orquestador se considera "UP" mientras este endpoint responda
      if (service.type === 'internal') {
        return {
          ...service,
          status: 'UP',
          message: 'MS-Orquestador activo y respondiendo.',
          checkedAt,
        };
      }

      const startedAt = Date.now();

      try {
        const response = await axios.get(service.url, { timeout: 3000 });
        const responseTimeMs = Date.now() - startedAt;

        return {
          ...service,
          status: response.data.status || 'UP',
          httpStatus: response.status,
          responseTimeMs,
          checkedAt,
          message: response.data.message || 'OK',
          details: response.data,
        };
      } catch (error) {
        const responseTimeMs = Date.now() - startedAt;

        console.error(
          `[ORQUESTADOR] Healthcheck falló para ${service.name}:`,
          error.message
        );

        return {
          ...service,
          status: 'DOWN',
          httpStatus: error.response?.status || 503,
          responseTimeMs,
          checkedAt,
          message: 'No se pudo contactar el servicio.',
          error: error.message,
        };
      }
    })
  );

  return res.json({
    checkedAt,
    services: results,
  });
});

// 🔹 Middleware simple de log
const createLogMiddleware = (tag) => (req, res, next) => {
  console.log(
    `[${tag}] Solicitud recibida: ${req.baseUrl}${req.url} Metodo: ${req.method}.`
  );
  console.log(`[${tag}] Cuerpo (req.body):`, req.body || {});
  next();
};

// 🔹 Proxy hacia MS-Métricas (mantengo etiqueta ORQUESTADOR-1 como ya la veías)
app.use(
  '/api/v1/metrics',
  createLogMiddleware('ORQUESTADOR-1'),
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('[ORQUESTADOR-1] Error en proxy métricas:', err.message);
      res
        .status(503)
        .json({ error: 'Servicio de métricas no disponible (MS-Métricas caído).' });
    },
  })
);

// 🔹 Proxy hacia MS-Integración
app.use(
  '/api/v1/orchestrator',
  createLogMiddleware('ORQUESTADOR-2'),
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/orchestrator': '/api/v1/integracion',
    },
    onError: (err, req, res) => {
      console.error('[ORQUESTADOR-2] Error en proxy automatización:', err.message);
      res.status(503).json({
        error: 'Servicio de automatización no disponible (MS-Integración caído).',
      });
    },
  })
);

app.listen(PORT, () => {
  console.log(`MS-Orquestador corriendo en http://localhost:${PORT}`);
  console.log('Proxy /api/v1/orchestrator -> MS-Integración');
  console.log('Proxy /api/v1/metrics -> MS-Métricas');
  console.log('Estado global de servicios en /api/v1/status');
});
