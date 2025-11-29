import axios from 'axios';

// Servicio de autenticación (login / register)
// Apunta al backend de métricas en el puerto 3002
const API_BASE_URL = 'http://localhost:3002/api/v1/metrics';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthService = {
  setAuthHeader(token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthHeader() {
    delete axiosInstance.defaults.headers.common['Authorization'];
  },

  async login(email, password) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: 'Error de conexión o credenciales inválidas.',
        }
      );
    }
  },

  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: 'Error de conexión o el usuario ya existe.',
        }
      );
    }
  },
};
