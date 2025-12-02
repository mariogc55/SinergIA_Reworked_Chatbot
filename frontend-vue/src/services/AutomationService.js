import axios from 'axios';

const ORCHESTRATOR_BASE_URL =
  import.meta.env.VITE_ORCHESTRATOR_URL ||
  'http://localhost:3000/api/v1/orchestrator';

export const AutomationService = {
  async triggerAutomation(prompt, userId, jiraConfig) {
    try {
      const response = await axios.post(`${ORCHESTRATOR_BASE_URL}/automation`, {
        prompt,
        user_id: userId,
        jiraConfig, 
      });

      return response.data;
    } catch (error) {
      console.error(
        'Error en AutomationService:',
        error.response?.data || error.message
      );

      if (error.response) {
        throw new Error(
          error.response.data?.error ||
            error.response.data?.message ||
            'Error del servidor al ejecutar la automatización.'
        );
      }

      throw new Error('No se pudo conectar con el orquestador.');
    }
  },
};
