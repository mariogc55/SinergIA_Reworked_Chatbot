import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_METRICS_API || 'http://localhost:3002/api/v1/metrics';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthService = {
  setAuthHeader(token) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  clearAuthHeader() {
    delete axiosInstance.defaults.headers.common['Authorization'];
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
      console.error('Error en login:', error.response?.data || error.message);
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
      console.error('Error en registro:', error.response?.data || error.message);
      throw (
        error.response?.data || {
          error: 'Error de conexión o el usuario ya existe.',
        }
      );
    }
  },
};
