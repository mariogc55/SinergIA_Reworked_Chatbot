import axios from 'axios';
import { Secrets } from '../config/secrets.js';

export class JiraRestAdapter {

    /**
     * @param {Object} config 
     */
    constructor(config = null) {
        this.config = config;
        this.initialize();
    }

    initialize() {

        
        try {
            if (this.config && this.config.email && this.config.apiToken) {
                this.JIRA_USER_EMAIL = this.config.email;
                this.JIRA_API_TOKEN = this.config.apiToken;
                this.JIRA_BASE_URL = this.config.baseUrl 
                    ? this.config.baseUrl 
                    : `https://${this.config.site}.atlassian.net`;
                
                console.log(`[INT:J] Usando credenciales dinámicas para: ${this.JIRA_USER_EMAIL}`);
            } else {
                console.log("[INT:J] Usando credenciales predeterminadas (.env)");
                this.JIRA_USER_EMAIL = Secrets.getJiraEmail();
                this.JIRA_API_TOKEN = Secrets.getJiraToken();
                this.JIRA_BASE_URL = Secrets.getJiraCloudUrl();
            }

            if (this.JIRA_BASE_URL.endsWith('/')) {
                this.JIRA_BASE_URL = this.JIRA_BASE_URL.slice(0, -1);
            }

            this.AUTH_HEADER = Buffer.from(
                `${this.JIRA_USER_EMAIL}:${this.JIRA_API_TOKEN}`
            ).toString('base64');

        } catch (error) {
            console.error("CRÍTICO: Fallo al inicializar adaptador Jira:", error.message);
        }
    }

    convertDescriptionToADF(text) {
        return {
            type: "doc",
            version: 1,
            content: [
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: text || "Sin descripción" }
                    ]
                }
            ]
        };
    }

    async createIssue(taskDetails) {
        if (!this.JIRA_API_TOKEN || !this.JIRA_USER_EMAIL) {
            throw new Error("No hay credenciales de Jira configuradas para esta petición.");
        }

        const issueData = {
            fields: {
                project: { key: taskDetails.projectKey || 'KAN' },
                summary: taskDetails.summary,
                description: this.convertDescriptionToADF(taskDetails.description),
                issuetype: { name: taskDetails.issueType || 'Task' },
                priority: { name: taskDetails.priority || 'Medium' }
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
            console.error("ERROR API JIRA:", error.response ? error.response.data : error.message);
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