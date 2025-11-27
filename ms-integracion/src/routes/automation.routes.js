import express from 'express';
import { GeminiAPIAdapter } from '../infra/adapters/GeminiAPIAdapter.js';
import { JiraRestAdapter } from '../infra/adapters/JiraRestAdapter.js';
import { ServiceNowAdapter } from '../infra/adapters/ServiceNowAdapter.js';

const router = express.Router();

router.post('/automation', async (req, res) => {
    try {

        const { prompt, user_id } = req.body;

        if (!prompt || !user_id) {
            return res.status(400).json({ message: "Se requieren 'prompt' y 'user_id'." });
        }

        const authService = new ServiceNowAdapter();
        const gemini = GeminiAPIAdapter;
        const jira = new JiraRestAdapter();

        const userProfile = await authService.getUserProfile(user_id);

        const structuredTask = await gemini.analyzeTask(prompt);

        const issueData = {
            summary: structuredTask.summary,
            description: `${structuredTask.description} (Solicitado por: ${userProfile.name})`,
            priority: structuredTask.priority || 'Medium',
            projectKey: structuredTask.projectKey,
            issueType: structuredTask.issueType || 'Task',
        };

        const jiraResult = await jira.createIssueWithRisk(issueData);

        return res.status(200).json({
            message: `Tarea automatizada creada por ${userProfile.name}: ${jiraResult.key}.`,
            jiraUrl: jiraResult.url,
            jiraKey: jiraResult.key,
        });

    } catch (error) {
        console.error("Error en /automation:", error);
        return res.status(500).json({
            message: "Error en la automatización (Gemini/Jira).",
            details: error.message,
        });
    }
});

export default router;
