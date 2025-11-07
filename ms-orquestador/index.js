import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(
  '/api/v1/metrics',
  (req, res, next) => {
    console.log(`[ORQUESTADOR-1] Solicitud recibida: ${req.baseUrl}${req.url} Metodo: ${req.method}.`);
    console.log(`[ORQUESTADOR-1] Cuerpo (req.body):`, req.body);
    next();
  },
  createProxyMiddleware({
    target: 'http://localhost:3002', 
    changeOrigin: true,
    proxyTimeout: 10000, 
    pathRewrite: {
      '^/api/v1/metrics': '', 
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
        proxyReq.setHeader('Host', 'localhost:3002');
    },
    onError: (err, req, res) => {
        console.error(`[ORQUESTADOR-3] Error de Proxy a 3002: ${err.code}. MS-Métricas no respondió.`);
        res.status(503).json({ error: 'Servicio de métricas no disponible (MS-Métricas caído).' });
    },
  })
);

app.use(
  '/api/v1/orchestrator/automation',
  createProxyMiddleware({
    target: 'http://localhost:3001', 
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/orchestrator': '/api/v1/integracion', 
    },
    onError: (err, req, res) => {
        res.status(503).json({ error: 'Servicio de automatización no disponible (MS-Integración caído).' });
    },
  })
);

app.listen(PORT, () => {
  console.log(`MS-Orquestador corriendo en http://localhost:${PORT}`);
});