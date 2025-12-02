import express from 'express';
import { GeminiAPIAdapter } from '../infra/adapters/GeminiAPIAdapter.js';
import { JiraRestAdapter } from '../infra/adapters/JiraRestAdapter.js';
import { ServiceNowAdapter } from '../infra/adapters/ServiceNowAdapter.js';

const router = express.Router();

router.post('/automation', async (req, res) => {
    try {
        const { prompt, user_id, jiraConfig } = req.body;

        if (!prompt || !user_id) {
            return res.status(400).json({ message: "Se requieren 'prompt' y 'user_id'." });
        }

        if (!jiraConfig || !jiraConfig.email || !jiraConfig.apiToken || !jiraConfig.site) {
             return res.status(400).json({ message: "Se requieren credenciales de Jira (site, email, token)." });
        }

        const authService = new ServiceNowAdapter();
        
        const jira = new JiraRestAdapter({
            site: jiraConfig.site,
            email: jiraConfig.email,
            apiToken: jiraConfig.apiToken
        });

        let userProfile = { name: "Usuario" };
        try {
            userProfile = await authService.getUserProfile(user_id);
        } catch (e) {
            console.warn("No se pudo obtener perfil de SN, continuando...");
        }

        const structuredTask = await GeminiAPIAdapter.analyzeTask(prompt);

        const issueData = {
            summary: structuredTask.summary,
            description: `${structuredTask.description} \n\n(Solicitado por: ${userProfile.name})`,
            priority: structuredTask.priority || 'Medium',
            projectKey: structuredTask.projectKey, // Gemini debe detectar el KEY del proyecto
            issueType: structuredTask.issueType || 'Task',
        };

        const jiraResult = await jira.createIssueWithRisk(issueData);

        return res.status(200).json({
            message: `Tarea creada exitosamente en ${jiraConfig.site}. Key: ${jiraResult.key}`,
            jiraUrl: jiraResult.url,
            jiraKey: jiraResult.key,
        });

    } catch (error) {
        console.error("Error en /automation:", error);
        return res.status(500).json({
            message: "Error en la automatización.",
            details: error.message,
        });
    }
});

export default router;