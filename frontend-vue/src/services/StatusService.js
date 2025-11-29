import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

export const StatusService = {
  async getStatus() {
    const response = await axios.get(`${BASE_URL}/status`);
    return response.data;
  },
};
