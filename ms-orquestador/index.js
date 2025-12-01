import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.ORCHESTRATOR_PORT || 3000;

const INTEGRACION_BASE_URL =
  process.env.INTEGRATION_BASE_URL || 'http://localhost:3001';
const METRICAS_BASE_URL =
  process.env.METRICS_BASE_URL || 'http://localhost:3002';

app.disable('x-powered-by');

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
app.use(express.json());

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
    url: `${INTEGRACION_BASE_URL}/health`,
  },
  {
    key: 'metricas',
    name: 'MS-Métricas (PSP)',
    type: 'http',
    url: `${METRICAS_BASE_URL}/health`,
  },
];

app.get('/api/v1/status', async (req, res) => {
  const checkedAt = new Date().toISOString();

  const results = await Promise.all(
    SERVICES.map(async (service) => {
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

const createLogMiddleware = (tag) => (req, res, next) => {
  console.log(
    `[${tag}] Solicitud recibida: ${req.baseUrl}${req.url} Metodo: ${req.method}.`
  );
  console.log(`[${tag}] Cuerpo (req.body):`, req.body || {});
  next();
};

app.post(
  '/api/v1/orchestrator/automation',
  createLogMiddleware('ORQUESTADOR-AUTO'),
  async (req, res) => {
    console.log('[ORQUESTADOR-AUTO] Redirigiendo petición de automatización...');

    const targetUrl = `${INTEGRACION_BASE_URL}/api/v1/integracion/automation`;

    try {
      const respuesta = await axios.post(targetUrl, req.body, {
        timeout: 60000, // Evita que se quede colgado eternamente
      });

      console.log(
        '[ORQUESTADOR-AUTO] Respuesta de ms-integracion:',
        respuesta.status
      );

      return res.status(respuesta.status).json(respuesta.data);
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const detail = error.response?.data || error.message;

      console.error(
        '[ORQUESTADOR-AUTO] Error llamando a ms-integracion:',
        detail
      );

      return res.status(statusCode).json({
        error: 'Error al procesar la automatización en el orquestador.',
        detail,
      });
    }
  }
);

app.use(
  '/api/v1/metrics',
  createLogMiddleware('ORQUESTADOR-1'),
  createProxyMiddleware({
    target: METRICAS_BASE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('[ORQUESTADOR-1] Error en proxy métricas:', err.message);
      res
        .status(503)
        .json({ error: 'Servicio de métricas no disponible (MS-Métricas caído).' });
    },
  })
);

app.use(
  '/api/v1/orchestrator',
  createLogMiddleware('ORQUESTADOR-2'),
  createProxyMiddleware({
    target: INTEGRACION_BASE_URL,
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

app.use((err, req, res, next) => {
  console.error('[MS-Orquestador] Error no controlado:', err);
  res.status(500).json({
    service: 'ms-orquestador',
    status: 'ERROR',
    message: 'Error interno del servidor en MS-Orquestador.',
  });
});

app.listen(PORT, () => {
  console.log(`MS-Orquestador corriendo en http://localhost:${PORT}`);
  console.log(`Proxy /api/v1/orchestrator -> ${INTEGRACION_BASE_URL}`);
  console.log(`Proxy /api/v1/metrics -> ${METRICAS_BASE_URL}`);
  console.log('Estado global de servicios en /api/v1/status');
});
