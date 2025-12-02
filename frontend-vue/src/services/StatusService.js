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

      if (error.response) {
        throw new Error(
          error.response.data?.error ||
            error.response.data?.message ||
            'Error del servidor al obtener el estado de los servicios.'
        );
      }

      throw new Error('No se pudo conectar con el servicio de estado.');
    }
  },
};
