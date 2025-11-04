import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    userId: 'DPI_001' 
  }),
  actions: {
    login(userData) {

      this.isAuthenticated = true;
      this.user = { 
        name: userData.name || 'Usuario SinergIA', 
        email: userData.email 
      };
      localStorage.setItem('sinergia_auth', 'true'); 
      localStorage.setItem('sinergia_user', JSON.stringify(this.user));
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('sinergia_auth');
      localStorage.removeItem('sinergia_user');
    },
    initializeAuth() {
      const auth = localStorage.getItem('sinergia_auth');
      const user = localStorage.getItem('sinergia_user');
      if (auth === 'true' && user) {
        this.isAuthenticated = true;
        this.user = JSON.parse(user);
      }
    }
  },
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getCurrentUserId: (state) => state.userId
  }
});