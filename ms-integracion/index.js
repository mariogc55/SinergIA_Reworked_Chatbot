import express from "express";
import cors from "cors";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as dotenv from "dotenv";
dotenv.config();

import { Secrets } from "./src/infra/config/secrets.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const PORT = parseInt(Secrets.getIntegrationPort(), 10) || 3001;

import jiraRoutes from "./src/routes/jira.routes.js";
import geminiRoutes from "./src/routes/gemini.routes.js";
import automationRoutes from "./src/routes/automation.routes.js";

app.use("/api/v1/jira", jiraRoutes);
app.use("/api/v1/gemini", geminiRoutes);

app.use("/api/v1/integracion", automationRoutes);
app.use("/api/v1/orchestrator", automationRoutes);

app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    service: "MS-Integracion",
    message: "Adaptadores listos para el Orquestador.",
    configReady: !!Secrets.getGeminiApiKey(),
  });
});

try {
  Secrets.getGeminiApiKey();

  app.listen(PORT, () => {
    console.log(`MS-Integración corriendo en http://localhost:${PORT}`);
    console.log("Adaptadores listos: Gemini, Jira, ServiceNow.");
  });
} catch (error) {
  console.error("CRÍTICO: El MS-Integración no pudo inicializarse por error de configuración.");
  console.error(error.message);
  process.exit(1);
}
