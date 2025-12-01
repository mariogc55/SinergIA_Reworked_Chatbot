import { defineStore } from 'pinia';
import { AuthService } from '@/services/AuthService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),

  actions: {
    setAuth(userData, token) {
      this.isAuthenticated = true;
      this.user = {
        name: userData.name,
        email: userData.email,
        developerId: userData.developer_id,
      };
      this.token = token;

      localStorage.setItem('sinergia_auth', 'true');
      localStorage.setItem('sinergia_user', JSON.stringify(this.user));
      localStorage.setItem('sinergia_token', token);

      AuthService.setAuthHeader(token);
    },

    async handleLogin(email, password) {
      const result = await AuthService.login(email, password);
      this.setAuth(result.user, result.token);
    },

    async handleRegister(userData) {
      const result = await AuthService.register(userData);
      this.setAuth(result.user, result.token);
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      localStorage.removeItem('sinergia_auth');
      localStorage.removeItem('sinergia_user');
      localStorage.removeItem('sinergia_token');

      AuthService.clearAuthHeader();
    },

    initializeAuth() {
      const auth = localStorage.getItem('sinergia_auth');
      const userStr = localStorage.getItem('sinergia_user');
      const token = localStorage.getItem('sinergia_token');

      if (auth === 'true' && userStr && token) {
        try {
          const user = JSON.parse(userStr);
          this.isAuthenticated = true;
          this.user = user;
          this.token = token;
          AuthService.setAuthHeader(token);
        } catch (err) {
          console.error('Error parseando usuario de localStorage:', err);
          this.logout();
        }
      } else {
        this.logout();
      }
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getCurrentUserId: (state) => state.user?.developerId,
    getCurrentUserEmail: (state) => state.user?.email,
  },
});
