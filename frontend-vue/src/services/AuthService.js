import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_METRICS_API || 'http://localhost:3002/api/v1/metrics';

console.log('[AuthService] API_BASE_URL =', API_BASE_URL);

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

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 401) {
          throw {
            error: data?.error || 'Credenciales incorrectas.',
          };
        }

        throw {
          error: data?.error || 'Error del servidor al iniciar sesión.',
        };
      }

      throw { error: 'No se pudo conectar con el servidor.' };
    }
  },

  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          throw {
            error: data?.error || 'El usuario ya existe.',
          };
        }

        throw {
          error:
            data?.error || 'Error del servidor al registrar el usuario.',
        };
      }

      throw { error: 'No se pudo conectar con el servidor.' };
    }
  },
};
