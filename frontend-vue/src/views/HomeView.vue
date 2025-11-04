<template>
  <div class="min-h-screen bg-gray-900 text-white">

    <header class="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-sm shadow-lg">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 max-w-7xl">
        <router-link to="/" class="text-2xl font-bold text-blue-400">SinergIA</router-link>
        <nav class="hidden md:flex space-x-8 font-medium">
          <a href="#services" class="hover:text-blue-400 transition duration-150">Servicios</a>
          <a href="#team" class="hover:text-blue-400 transition duration-150">Equipo</a>
          <router-link v-if="authStore.isLoggedIn" to="/chat" class="hover:text-blue-400 transition duration-150">Chatbot</router-link>
          <router-link v-if="authStore.isLoggedIn" to="/reports" class="hover:text-blue-400 transition duration-150">Reportes</router-link>
        </nav>
        <div class="flex items-center space-x-4">
          
          <template v-if="authStore.isLoggedIn">
            <span class="text-sm text-gray-300 hidden sm:block">Bienvenido, {{ authStore.user.name.split(' ')[0] }}</span>
            <button @click="logout" class="px-4 py-2 text-sm font-semibold rounded-lg border border-red-400 text-red-400 hover:bg-red-400 hover:text-gray-900 transition duration-150">
              Cerrar Sesión
            </button>
          </template>
          
          <template v-else>
            <router-link to="/auth/login" class="px-4 py-2 text-sm font-semibold rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 transition duration-150">
              Iniciar Sesión
            </router-link>
            <router-link to="/auth/register" class="hidden sm:block px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-150">
              Crear Cuenta
            </router-link>
          </template>

        </div>
      </div>
    </header>

    <main>
      <section class="relative pt-8 pb-24 lg:pt-16 lg:pb-40 overflow-hidden">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
          <div class="order-2 lg:order-1 text-center lg:text-left">
            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 text-white">
              Sinerg<span style="color: #00EEFF;">IA</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-300 mb-8">
              Integramos la inteligencia artificial con tus herramientas de gestión de proyectos (Jira, ServiceNow) para automatizar tareas, analizar riesgos y optimizar flujos de trabajo.
            </p>
            
          </div>
          <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
            <img src="/images/sinergia-main-hero.png" alt="SinergIA AI Bot and dashboard graphics" class="max-h-96 w-auto lg:max-h-[500px] object-contain">
          </div>
        </div>
        <div class="absolute inset-0 z-0 opacity-10">
           <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900"></div>
        </div>
      </section>

      <section id="services" class="py-24 bg-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 class="text-4xl font-extrabold text-center mb-16">Servicios de Transformación Digital</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div class="bg-gray-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
              <img src="/images/icon-jira.png" alt="Jira Icon" class="w-16 h-16 mb-4 object-contain">
              <h3 class="text-xl font-bold mb-2 text-blue-400">Automatización Jira</h3>
              <p class="text-gray-300">Crea tareas, bugs y stories automáticamente a partir de prompts de lenguaje natural.</p>
            </div>
            <div class="bg-gray-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
              <img src="/images/icon-gemini.png" alt="AI Icon" class="w-16 h-16 mb-4 object-contain">
              <h3 class="text-xl font-bold mb-2 text-blue-400">Análisis Inteligente</h3>
              <p class="text-gray-300">Clasificación, priorización y resumen de solicitudes usando el poder de Gemini.</p>
            </div>
            <div class="bg-gray-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
              <img src="/images/icon-snow.png" alt="ServiceNow Icon" class="w-16 h-16 mb-4 object-contain">
              <h3 class="text-xl font-bold mb-2 text-blue-400">Integración ServiceNow</h3>
              <p class="text-gray-300">Soporte nativo para la gestión de incidentes y cambios en ServiceNow.</p>
            </div>
            <div class="bg-gray-700 p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
              <img src="/images/icon-risk.png" alt="Risk Icon" class="w-16 h-16 mb-4 object-contain">
              <h3 class="text-xl font-bold mb-2 text-blue-400">Gestión de Riesgos</h3>
              <p class="text-gray-300">Identificación y mitigación proactiva de riesgos en tus proyectos.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="team" class="py-20 bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 class="text-4xl font-extrabold text-center mb-12">Conoce al Equipo SinergIA</h2>
          <div class="flex flex-wrap justify-center gap-8">
            <div class="text-center p-4 bg-gray-800 rounded-lg shadow-xl w-40">
              <div class="h-16 w-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-3 text-gray-900">MG</div>
              <p class="font-semibold text-white">Mario Guerrero</p>
            </div>
            <div class="text-center p-4 bg-gray-800 rounded-lg shadow-xl w-40">
              <div class="h-16 w-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-3 text-gray-900">HA</div>
              <p class="font-semibold text-white">Hilan Alegria</p>
            </div>
            <div class="text-center p-4 bg-gray-800 rounded-lg shadow-xl w-40">
              <div class="h-16 w-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-3 text-gray-900">DZ</div>
              <p class="font-semibold text-white">Daniel Zuñiga</p>
            </div>
            <div class="text-center p-4 bg-gray-800 rounded-lg shadow-xl w-40">
              <div class="h-16 w-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-3 text-gray-900">RO</div>
              <p class="font-semibold text-white">Raul Orobio</p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <h2 class="text-4xl font-extrabold mb-4">¿Listo para Optimizar tu Trabajo?</h2>
          <p class="text-xl text-gray-300 mb-8">
            Únete a la nueva era de la gestión de proyectos con SinergIA.
          </p>
          <router-link :to="authStore.isLoggedIn ? '/chat' : '/auth/login'" class="px-10 py-4 bg-blue-600 text-white font-bold rounded-full text-xl shadow-xl hover:bg-blue-700 transition duration-300">
            {{ authStore.isLoggedIn ? 'Acceder al Chat' : 'Iniciar Sesión' }}
          </router-link>
        </div>
      </section>
    </main>

    <footer class="bg-gray-900 border-t border-gray-700 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 max-w-7xl">
        <p class="mb-2">&copy; {{ new Date().getFullYear() }} SinergIA. Todos los derechos reservados.</p>
        <p class="text-sm">Contacto: soporte@sinergia.com</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'HomeView',
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    logout() {
      this.authStore.logout();
      this.$router.push('/');
    }
  }
};
</script>