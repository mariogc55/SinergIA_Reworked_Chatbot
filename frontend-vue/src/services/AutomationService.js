import axios from 'axios';

const ORCHESTRATOR_BASE_URL =
  import.meta.env.VITE_ORCHESTRATOR_URL ||
  'http://localhost:3000/api/v1/orchestrator';

export const AutomationService = {
  async triggerAutomation(prompt, userId) {
    try {
      const response = await axios.post(`${ORCHESTRATOR_BASE_URL}/automation`, {
        prompt,
        user_id: userId,
      });

      return response.data;
    } catch (error) {
      console.error(
        'Error en la llamada al MS-Orquestador:',
        error.response?.data || error.message
      );

      const data = error.response?.data;

      const errorMessage =
        (data && (data.error || data.message || data.detail)) ||
        (!error.response
          ? 'Error de red: No se pudo conectar con el servidor.'
          : 'Error desconocido en el orquestador.');

      throw new Error(errorMessage);
    }
  },
};
