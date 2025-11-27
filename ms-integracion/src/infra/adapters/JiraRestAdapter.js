import axios from 'axios';
import { Secrets } from '../config/secrets.js';

export class JiraRestAdapter {

    constructor() {
        this.initialize();
    }

    initialize() {
        try {
            this.JIRA_USER_EMAIL = Secrets.getJiraEmail();
            this.JIRA_API_TOKEN = Secrets.getJiraToken();
            this.JIRA_BASE_URL = Secrets.getJiraCloudUrl();
            this.AUTH_HEADER = Buffer.from(
                `${this.JIRA_USER_EMAIL}:${this.JIRA_API_TOKEN}`
            ).toString('base64');

            console.log("[INT:J] Credenciales de Jira cargadas con éxito.");
        } catch (error) {
            console.error("CRÍTICO: Fallo al cargar credenciales de Jira:", error.message);
            throw new Error("Credenciales de Jira no válidas.");
        }
    }

    async createIssue(taskDetails) {

        const issueData = {
            fields: {
                project: { key: taskDetails.projectKey || 'KAN' },
                summary: taskDetails.summary,
                description: taskDetails.description,
                issuetype: { name: taskDetails.issueType },
                priority: { name: taskDetails.priority }
            }
        };

        try {
            const response = await axios.post(
                `${this.JIRA_BASE_URL}/rest/api/3/issue`,
                issueData,
                {
                    headers: {
                        'Authorization': `Basic ${this.AUTH_HEADER}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                key: response.data.key,
                url: `${this.JIRA_BASE_URL}/browse/${response.data.key}`
            };

        } catch (error) {
            console.error("ERROR AL LLAMAR A LA API DE JIRA:",
                error.response ? error.response.data : error.message);

            throw new Error(error.message);
        }
    }

    async createIssueWithRisk(taskDetails) {
        const enriched = {
            ...taskDetails,
            risk: "Low",
            riskAnalysis: "Generado automáticamente"
        };

        return await this.createIssue(enriched);
    }
}
