import axios from 'axios';

const ORCHESTRATOR_URL = 'http://localhost:3000/api/v1/automate';

export const AutomationService = {
    /**
     * @param {string} prompt
     * @param {string} userId
     * @returns {Promise<Object>}
     */
    async triggerAutomation(prompt, userId) {
        try {
            const response = await axios.post(ORCHESTRATOR_URL, {
                prompt,
                userId
            });

            return response.data; 
            
        } catch (error) {
            let errorMessage = "Error de comunicación con el servidor.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            throw new Error(errorMessage);
        }
    }
};