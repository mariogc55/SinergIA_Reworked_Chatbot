<template>
  <div class="chat-container bg-gray-800 text-white shadow-2xl rounded-xl">
    <h2 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">SinergIA: Asistente de Proyectos (Usuario: {{ authStore.user?.name || 'Invitado' }})</h2>
    
    <div class="messages bg-gray-700 rounded-lg p-3">
    </div>
    
    <div class="input-area flex gap-3 mt-4">
      <input 
        v-model="prompt" 
        @keyup.enter="sendMessage" 
        :disabled="isLoading || !authStore.isLoggedIn" 
        :placeholder="authStore.isLoggedIn ? 'Ej: Crear tarea: Construye el programa. Proyecto KAN' : 'Inicia sesión para usar el chat.'"
        class="flex-grow p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button @click="sendMessage" :disabled="isLoading || !authStore.isLoggedIn" class="px-6 py-3 border-none rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-150 disabled:bg-blue-900 disabled:cursor-not-allowed">
        {{ isLoading ? 'Procesando...' : 'Enviar' }}
      </button>
    </div>
    <p v-if="error" class="error-message text-red-400 mt-2">Error: {{ error }}</p>
    <p v-if="!authStore.isLoggedIn" class="error-message text-yellow-400 mt-2">Debes iniciar sesión para usar el Chatbot.</p>
  </div>
</template>

<script>
import { AutomationService } from '@/services/AutomationService'; 
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ChatInterface',
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      prompt: '',
      messages: [
        { type: 'bot', text: 'Hola, soy SinergIA. ¿En qué tarea de automatización puedo ayudarte hoy? (Ej: crear tarea, analizar riesgo).' }
      ],
      isLoading: false,
      error: null
    };
  },
  methods: {
    async sendMessage() {
      if (!this.prompt.trim() || this.isLoading || !this.authStore.isLoggedIn) return;

      const userPrompt = this.prompt.trim();
      this.prompt = '';
      this.error = null;
      this.isLoading = true;

      this.messages.push({ type: 'user', text: userPrompt });

      try {
        const userId = this.authStore.getCurrentUserId; 
        if (!userId) {
          throw new Error("ID de usuario no encontrado. Vuelva a iniciar sesión.");
        }
        
        const response = await AutomationService.triggerAutomation(userPrompt, userId);
        
        this.messages.push({ 
          type: 'bot', 
          text: response.message,
          jiraKey: response.jiraKey,
          jiraUrl: response.jiraUrl 
        });

      } catch (err) {
        this.error = 'No se pudo conectar con el MS-Orquestador o la lógica de negocio falló.';
        this.messages.push({ type: 'bot', text: `Hubo un error en la automatización: ${err.message || 'Intente de nuevo.'}` });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 25px;
}
.messages {
    height: 60vh;
    overflow-y: auto;
}
.message {
    margin: 10px 0;
    padding: 10px 15px;
    border-radius: 20px;
    max-width: 85%;
    word-wrap: break-word;
}
.user {
    background-color: #3b82f6;
    margin-left: auto;
    text-align: right;
}
.bot {
    background-color: #4b5563;
    margin-right: auto;
    text-align: left;
}
.messages::-webkit-scrollbar {
    width: 8px;
}
.messages::-webkit-scrollbar-thumb {
    background-color: #4a5568; 
    border-radius: 4px;
}
</style>