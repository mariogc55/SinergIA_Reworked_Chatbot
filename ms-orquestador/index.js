
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const cors = require('cors');

import { IntegrationService } from './src/infra/integrations/IntegrationService.js'; 

const app = express();
const PORT = process.env.ORCHESTRATOR_PORT || 3000; 

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'MS-Orquestador', 
        message: 'API Gateway activo. Listo para conectar el Frontend con los Microservicios.'
    });
});

app.post('/api/v1/automate', async (req, res) => {
    const { prompt, userId } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ message: "Faltan 'prompt' o 'userId' en la solicitud." });
    }

    console.log(`[ORQUESTADOR] Recibida solicitud de ${userId}: "${prompt}"`);

    try {
        const structuredTask = await IntegrationService.analyzePrompt(prompt);
        console.log('[ORQ] Tarea estructurada por IA:', structuredTask);
        
        const jiraResult = await IntegrationService.createJiraIssue(structuredTask);
        console.log('[ORQ] Tarea creada en Jira:', jiraResult.jiraKey);

        res.status(200).json({ 
            message: `Tarea creada y registrada en Jira. La IA identificó la solicitud como: ${structuredTask.summary}.`, 
            jiraKey: jiraResult.jiraKey,
            jiraUrl: jiraResult.jiraUrl 
        });

    } catch (error) {
        console.error("[ORQ ERROR] Fallo en la orquestación. Asegure que el MS-Integración esté 100% activo.", error.message);
        res.status(500).json({ 
            message: "Error en el flujo de automatización. Verifique la consola del MS-Orquestador y el MS-Integración." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`MS-Orquestador corriendo en http://localhost:${PORT}`);
    console.log("Servicios de soporte (3001, 3002) deben estar activos.");
});