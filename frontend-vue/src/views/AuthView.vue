<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 sm:p-10">
      
      <h2 class="text-3xl font-extrabold text-center text-gray-900 mb-8">
        {{ currentView === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}
      </h2>

      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <div v-if="currentView === 'login'">
        <form @submit.prevent="handleLogin">
          <input v-model="email" id="login-email" name="login-email" type="email" placeholder="Correo Electrónico" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <input v-model="password" id="login-password" name="login-password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Cargando...</span>
            <span v-else>Acceder a SinergIA</span>
          </button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta? 
          <a href="#" @click.prevent="goToRegister" class="text-blue-600 hover:text-blue-800 font-medium transition duration-150">
            Regístrate aquí
          </a>
        </p>
      </div>

      <div v-else-if="currentView === 'register'">
        <form @submit.prevent="handleRegister">
          <input v-model="name" id="register-name" name="register-name" type="text" placeholder="Nombre Completo" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <input v-model="email" id="register-email" name="register-email" type="email" placeholder="Correo Electrónico" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <input v-model="password" id="register-password" name="register-password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <input v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password" placeholder="Confirmar Contraseña" class="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required>
          <button type="submit" :disabled="isLoading" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Cargando...</span>
            <span v-else>Crear Cuenta</span>
          </button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta? 
          <a href="#" @click.prevent="goToLogin" class="text-blue-600 hover:text-blue-800 font-medium transition duration-150">
            Inicia Sesión
          </a>
        </p>
      </div>

      <p class="text-center mt-8">
        <router-link to="/" class="text-sm text-gray-500 hover:text-gray-900 transition duration-150">
          &larr; Volver a la página principal
        </router-link>
      </p>

    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'AuthView',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: null,
      isLoading: false,
      authStore: useAuthStore(),
    };
  },
  computed: {
    currentView() {
      const route = useRoute();
      return route.path.includes('register') ? 'register' : 'login';
    }
  },
  watch: {
    '$route.path': {
      handler() {
        this.errorMessage = null;
        this.isLoading = false;
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
      },
      immediate: true
    }
  },
  methods: {
    goToRegister() {
        this.$router.push('/auth/register');
    },
    goToLogin() {
        this.$router.push('/auth/login');
    },
    async handleLogin() {
      this.errorMessage = null;
      this.isLoading = true;
      try {
        await this.authStore.handleLogin(this.email, this.password);
        this.$router.push('/chat');
      } catch (error) {
        this.errorMessage = error.message || error.error || 'Credenciales incorrectas o error de servidor.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async handleRegister() {
      this.errorMessage = null;
      this.isLoading = true;
      
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        this.isLoading = false;
        return;
      }
      
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      try {
        await this.authStore.handleRegister(userData);
        this.$router.push('/chat');
      } catch (error) {
        this.errorMessage = error.message || error.error || 'Fallo al crear la cuenta. El correo ya puede estar en uso.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>