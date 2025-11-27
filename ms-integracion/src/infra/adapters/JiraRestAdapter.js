import axios from 'axios';
import { Secrets } from '../config/secrets.js';

let JIRA_BASE_URL = null;
let AUTH_HEADER = null;

function initializeJiraCredentials() {
    if (AUTH_HEADER !== null && JIRA_BASE_URL !== null) {
        return;
    }

    try {
        const JIRA_USER_EMAIL = Secrets.getJiraEmail();
        const JIRA_API_TOKEN = Secrets.getJiraToken();

        JIRA_BASE_URL = Secrets.getJiraCloudUrl();
        AUTH_HEADER = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

        console.log("[INT:J] Credenciales de Jira cargadas con éxito.");

    } catch (error) {
        console.error("CRÍTICO: Fallo al cargar credenciales de Jira:", error.message);
        AUTH_HEADER = "INVALID_CREDENTIALS";
        JIRA_BASE_URL = "INVALID_URL";
    }
}

export const JiraRestAdapter = {

    async createIssue(taskDetails) {
        initializeJiraCredentials();

        if (AUTH_HEADER === "INVALID_CREDENTIALS") {
            throw new Error(
                "No se pudo iniciar el Adaptador Jira. " +
                "Verifique JIRA_USER_EMAIL, JIRA_API_TOKEN y JIRA_CLOUD_URL."
            );
        }

        const issueData = {
            fields: {
                project: { key: taskDetails.projectKey || 'KAN' },
                summary: taskDetails.summary,
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        { type: "paragraph", content: [{ type: "text", text: taskDetails.description }] }
                    ]
                },
                issuetype: { name: taskDetails.issueType },
                priority: { name: taskDetails.priority }
            }
        };

        try {
            const response = await axios.post(
                JIRA_BASE_URL + '/rest/api/3/issue',
                issueData,
                {
                    headers: {
                        'Authorization': `Basic ${AUTH_HEADER}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const jiraKey = response.data.key;
            const cloudUrl = Secrets.getJiraCloudUrl().split('/rest/api/3/issue')[0];

            return {
                key: jiraKey,
                url: `${cloudUrl}/browse/${jiraKey}`
            };

        } catch (error) {
            console.error("ERROR AL LLAMAR A LA API DE JIRA:",
                error.response ? error.response.data : error.message);

            let errorMessage = `Fallo en la creación de la tarea en Jira. Código: ${error.response?.status ?? 'N/A'}. `;

            if (error.response?.status === 401) {
                errorMessage += "Verifique JIRA_API_TOKEN y JIRA_USER_EMAIL.";
            } else if (error.response?.data?.errors) {
                errorMessage += `Errores de campo: ${JSON.stringify(error.response.data.errors)}`;
            } else {
                errorMessage += `Detalle: ${error.message}`;
            }

            throw new Error(errorMessage);
        }
    },

    async createIssueWithRisk(taskDetails) {
        console.log("[INT:J] Ejecutando createIssueWithRisk...");

        const enrichedDetails = {
            ...taskDetails,
            risk: "Low",
            riskAnalysis: "Generado automáticamente"
        };

        return await this.createIssue(enrichedDetails);
    }
};
