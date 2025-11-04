<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 sm:p-10">
      
      <h2 class="text-3xl font-extrabold text-center text-gray-900 mb-8">
        {{ currentView === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}
      </h2>

      <div v-if="currentView === 'login'">
        <form @submit.prevent="handleLogin">
          <input v-model="email" type="email" placeholder="Correo Electrónico" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <input v-model="password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-150">
            Acceder a SinergIA
          </button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta? 
          <router-link to="/auth/register" class="text-blue-600 hover:text-blue-800 font-medium transition duration-150">
            Regístrate aquí
          </router-link>
        </p>
      </div>

      <div v-else-if="currentView === 'register'">
        <form @submit.prevent="handleRegister">
          <input v-model="name" type="text" placeholder="Nombre Completo" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <input v-model="email" type="email" placeholder="Correo Electrónico" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <input v-model="password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <input v-model="confirmPassword" type="password" placeholder="Confirmar Contraseña" class="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-150">
            Crear Cuenta
          </button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta? 
          <router-link to="/auth/login" class="text-blue-600 hover:text-blue-800 font-medium transition duration-150">
            Inicia Sesión
          </router-link>
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
      authStore: useAuthStore()
    };
  },
  computed: {
    currentView() {
      const route = useRoute();
      return route.params.view || 'login'; 
    }
  },
  methods: {
    handleLogin() {
      if (this.email && this.password) {
        this.authStore.login({ email: this.email, name: 'Analista' });
        this.$router.push('/chat');
      } else {
        alert('Por favor, ingresa correo y contraseña.');
      }
    },
    handleRegister() {
      if (this.name && this.email && this.password === this.confirmPassword) {
        this.authStore.login({ email: this.email, name: this.name });
        this.$router.push('/chat');
      } else {
        alert('Revisa los campos. La contraseña debe coincidir.');
      }
    }
  }
};
</script>