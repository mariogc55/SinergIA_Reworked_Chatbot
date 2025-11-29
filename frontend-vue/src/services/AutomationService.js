import axios from 'axios';

const ORCHESTRATOR_BASE_URL = 'http://localhost:3000/api/v1/orchestrator';

export const AutomationService = {
  /**
   * @param {string} prompt
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async triggerAutomation(prompt, userId) {
    try {
      const response = await axios.post(`${ORCHESTRATOR_BASE_URL}/automation`, {
        prompt: prompt,
        user_id: userId,
      });

      return response.data;
    } catch (error) {
      console.error(
        'Error en la llamada al MS-Orquestador:',
        error.response ? error.response.data : error.message
      );

      const errorMessage = error.response
        ? error.response.data.error || 'Error desconocido en el orquestador.'
        : 'Error de red: No se pudo conectar con el servidor.';

      throw new Error(errorMessage);
    }
  },
};
