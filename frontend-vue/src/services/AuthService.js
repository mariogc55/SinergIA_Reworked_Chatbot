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
  /**
   * @param {string} token
   */
  setAuthHeader(token) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Limpia el header 
   */
  clearAuthHeader() {
    delete axiosInstance.defaults.headers.common['Authorization'];
  },

  /**
   * Login de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);

      throw (
        error.response?.data || {
          error: 'Error de conexión. Por favor, verifica tus credenciales.',
        }
      );
    }
  },

  /**
   * @param {object} userData
   * @returns {Promise<object>}
   */
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
