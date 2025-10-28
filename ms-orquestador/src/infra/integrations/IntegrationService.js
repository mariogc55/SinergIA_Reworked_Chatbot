
import axios from 'axios';

const INTEGRATION_BASE_URL = 'http://localhost:3001/api/v1';

export const IntegrationService = {
    /**
     * @description
     * @param {string} prompt
     * @returns {Promise<Object>}
     */
    async analyzePrompt(prompt) {
        console.log('[ORQ:I] Llamando a Gemini para análisis...');
        const response = await axios.post(`${INTEGRATION_BASE_URL}/gemini/analyze`, { prompt });
        return response.data;
    },

    /**
     * @description
     * @param {Object} taskDetails
     * @returns {Promise<Object>}
     */
    async createJiraIssue(taskDetails) {
        console.log('[ORQ:I] Llamando a Jira para crear tarea...');
        const response = await axios.post(`${INTEGRATION_BASE_URL}/jira/issue`, taskDetails);
        return response.data; 
    }
};