import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_ORCHESTRATOR_API || 'http://localhost:3000/api/v1';

export const StatusService = {
  async getStatus() {
    try {
      const response = await axios.get(`${BASE_URL}/status`);
      return response.data;
    } catch (error) {
      console.error(
        'Error obteniendo status de servicios:',
        error.response?.data || error.message
      );

      throw new Error('No se pudo obtener el estado de los servicios.');
    }
  },
};
