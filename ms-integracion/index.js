import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import { Secrets } from './src/infra/config/secrets.js';

import geminiRoutes from './src/routes/gemini.routes.js';
import jiraRoutes from './src/routes/jira.routes.js';
import automationRoutes from './src/routes/automation.routes.js';

const app = express();
const PORT = Secrets.getIntegrationPort();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/v1/integracion', geminiRoutes);
app.use('/api/v1/integracion', jiraRoutes);
app.use('/api/v1/integracion', automationRoutes);

function buildHealth() {
  const problems = [];

  if (!Secrets.getGeminiApiKey()) {
    problems.push('GEMINI_API_KEY no configurada.');
  }

  try {
    if (!Secrets.getJiraEmail || !Secrets.getJiraToken || !Secrets.getJiraCloudUrl) {
      problems.push(
        'Faltan getters de Jira en Secrets (getJiraEmail/getJiraToken/getJiraCloudUrl).'
      );
    } else {
      if (!Secrets.getJiraEmail()) problems.push('Correo de Jira no configurado.');
      if (!Secrets.getJiraToken()) problems.push('Token de Jira no configurado.');
      if (!Secrets.getJiraCloudUrl()) problems.push('URL de Jira Cloud no configurada.');
    }

    if (Secrets.getServiceNowToken && !Secrets.getServiceNowToken()) {
      problems.push('Token de ServiceNow no configurado.');
    }
  } catch (err) {
    problems.push(`Error al leer configuración: ${err.message}`);
  }

  const base = {
    service: 'ms-integracion',
    timestamp: new Date().toISOString(),
  };

  if (problems.length > 0) {
    return {
      httpStatus: 500,
      body: {
        ...base,
        status: 'DEGRADED',
        message: 'MS-Integración está corriendo pero la configuración está incompleta.',
        problems,
      },
    };
  }

  return {
    httpStatus: 200,
    body: {
      ...base,
      status: 'UP',
      message: 'MS-Integración operativo y configuración básica correcta.',
    },
  };
}

app.get('/status', (req, res) => {
  const result = buildHealth();
  res.status(result.httpStatus).json(result.body);
});

app.get('/health', (req, res) => {
  const result = buildHealth();
  res.status(result.httpStatus).json(result.body);
});

try {
  const key = Secrets.getGeminiApiKey();
  if (!key) {
    console.warn(
      'Advertencia: GEMINI_API_KEY no está definida. Algunas funciones de IA no estarán disponibles.'
    );
  }

  app.listen(PORT, () => {
    console.log(`MS-Integración corriendo en http://localhost:${PORT}`);
    console.log('Adaptadores listos: Gemini, Jira, ServiceNow.');
    console.log('Healthcheck disponible en /health');
  });
} catch (error) {
  console.error(
    'CRÍTICO: El MS-Integración no pudo inicializarse por error de configuración.'
  );
  console.error(error.message);
  process.exit(1);
}
