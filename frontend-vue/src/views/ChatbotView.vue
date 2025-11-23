<template>
  <div class="min-h-screen flex bg-gray-900 relative">
    
    <button @click="toggleSidebar" class="sm:hidden absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-700 text-white shadow-lg">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'"></path></svg>
    </button>
    
    <div v-if="isSidebarOpen" @click="toggleSidebar" class="sm:hidden fixed inset-0 bg-black opacity-50 z-20"></div>

    <aside :class="[
            isSidebarOpen ? 'w-64' : 'w-0', 
            {'w-64 sm:w-16': !isSidebarOpen && !isMobile, 'w-64': isSidebarOpen && !isMobile}
          ]" 
          class="fixed sm:relative h-full bg-gray-800 text-white flex-shrink-0 transition-all duration-300 z-30 overflow-x-hidden"
    >
      <div class="p-4 flex items-center h-16 border-b border-gray-700">
        <h3 v-if="isSidebarOpen" class="text-xl font-bold text-blue-400">Menú SinergIA</h3>
        <button v-if="!isMobile" @click="toggleSidebar" class="ml-auto focus:outline-none">
          <svg class="w-6 h-6 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        </button>
      </div>

      <nav class="p-4 space-y-2">
        <a href="https://jiratmario-1761276751230.atlassian.net/jira/software/projects/KAN/list" target="_blank" class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition duration-150 whitespace-nowrap">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
          <span v-if="isSidebarOpen" class="ml-3">Tareas Jira</span>
        </a>

        <a href="https://jiratmario-1761276751230.atlassian.net/jira/software/projects/KAN/summary" target="_blank" class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition duration-150 whitespace-nowrap">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span v-if="isSidebarOpen" class="ml-3">Prioridades Jira</span>
        </a>

        <router-link to="/reports" class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition duration-150 whitespace-nowrap">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          <span v-if="isSidebarOpen" class="ml-3">Reportes SinergIA</span>
        </router-link>

        <router-link to="/" class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition duration-150 whitespace-nowrap">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span v-if="isSidebarOpen" class="ml-3">Volver a Inicio</span>
        </router-link>
      </nav>
    </aside>

    <main class="flex-grow p-4 sm:p-8 overflow-y-auto">
      <div :class="{'pt-12 sm:pt-0': isMobile}">
        <ChatInterface />
      </div>
    </main>
  </div>
</template>

<script>
import ChatInterface from '@/components/ChatInterface.vue';

export default {
  name: 'ChatbotView',
  components: {
    ChatInterface,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 640,
      isMobile: window.innerWidth < 640
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      this.isMobile = window.innerWidth < 640;
      if (!this.isMobile) {
        this.isSidebarOpen = true;
      } else if (this.isMobile && this.isSidebarOpen) {
      }
    }
  }
};
</script>