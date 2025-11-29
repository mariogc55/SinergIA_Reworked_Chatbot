import axios from 'axios';

// El MS-Orquestador está en 3000 y expone /api/v1/status
const BASE_URL = 'http://localhost:3000/api/v1';

export const StatusService = {
  async getStatus() {
    const response = await axios.get(`${BASE_URL}/status`);
    return response.data;
  },
};
