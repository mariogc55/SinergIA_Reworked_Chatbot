<template>
  <div class="chat-container bg-gray-800 text-white shadow-2xl rounded-xl p-4">
    <h2 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
      Asistente de Proyectos ({{ authStore.user?.name || 'Invitado' }})
    </h2>

    <div class="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
        <h3 class="text-lg font-semibold mb-2 text-blue-400">Configuración de Jira</h3>
        <p class="text-xs text-gray-300 mb-3">Ingresa tus credenciales para activar el chat.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
                <label class="block text-xs mb-1">Jira Site (subdominio)</label>
                <input v-model="jiraConfig.site" type="text" placeholder="ej: mi-empresa" class="w-full p-2 rounded bg-gray-800 border border-gray-500 text-sm" />
                <span class="text-[10px] text-gray-400">https://{{jiraConfig.site || '...'}}.atlassian.net</span>
            </div>
            <div>
                <label class="block text-xs mb-1">Correo Electrónico</label>
                <input v-model="jiraConfig.email" type="email" placeholder="usuario@email.com" class="w-full p-2 rounded bg-gray-800 border border-gray-500 text-sm" />
            </div>
            <div>
                <label class="block text-xs mb-1">API Token</label>
                <input v-model="jiraConfig.apiToken" type="password" placeholder="Pegar token aquí" class="w-full p-2 rounded bg-gray-800 border border-gray-500 text-sm" />
            </div>
        </div>
    </div>

    <div class="messages bg-gray-900 rounded-lg p-3 mb-4 h-64 overflow-y-auto border border-gray-700">
      <div v-for="(msg, index) in messages" :key="index" class="message mb-2 p-2 rounded max-w-[85%]" 
           :class="msg.type === 'user' ? 'bg-blue-600 ml-auto text-right' : 'bg-gray-600 mr-auto text-left'">
        <p>{{ msg.text }}</p>
        <div v-if="msg.jiraUrl" class="mt-1">
          <a :href="msg.jiraUrl" target="_blank" class="text-blue-200 underline text-sm">Ver en Jira ({{ msg.jiraKey }})</a>
        </div>
      </div>
    </div>
    
    <div class="input-area flex gap-3">
      <input 
        v-model="prompt" 
        @keyup.enter="sendMessage"
        maxlength="300"
        :disabled="isLoading || !isJiraConfigured" 
        :placeholder="isJiraConfigured ? 'Ej: Crear tarea: Revisar base de datos en proyecto KAN' : 'Completa las credenciales de Jira arriba para comenzar.'"
        class="flex-grow p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        @click="sendMessage" 
        :disabled="isLoading || !isJiraConfigured" 
        class="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed">
        {{ isLoading ? '...' : 'Enviar' }}
      </button>
    </div>
    
    <p v-if="error" class="text-red-400 mt-2 text-sm">Error: {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { AutomationService } from '@/services/AutomationService';

const authStore = useAuthStore();
const prompt = ref('');
const messages = ref([{ type: 'bot', text: 'Hola. Configura tus credenciales de Jira arriba para empezar a gestionar tu proyecto.' }]);
const isLoading = ref(false);
const error = ref(null);

const jiraConfig = ref({
    site: '',
    email: '',
    apiToken: ''
});

const isJiraConfigured = computed(() => {
    return jiraConfig.value.site.length > 0 && 
           jiraConfig.value.email.length > 0 && 
           jiraConfig.value.apiToken.length > 0;
});

async function sendMessage() {
    if (!prompt.value.trim() || isLoading.value || !isJiraConfigured.value) return;

    const userPrompt = prompt.value.trim();
    prompt.value = '';
    error.value = null;
    isLoading.value = true;

    messages.value.push({ type: 'user', text: userPrompt });

    try {
        const userId = authStore.getCurrentUserId;
        
        const response = await AutomationService.triggerAutomation(userPrompt, userId, jiraConfig.value);

        messages.value.push({
            type: 'bot',
            text: response.message,
            jiraKey: response.jiraKey,
            jiraUrl: response.jiraUrl
        });
    } catch (err) {
        error.value = err.message || 'Error en la comunicación.';
        messages.value.push({ type: 'bot', text: 'Hubo un error procesando tu solicitud. Verifica tus credenciales.' });
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.chat-container { max-width: 900px; margin: 0 auto; height: 100%; }
.message { padding: 10px 15px; border-radius: 12px; max-width: 85%; word-wrap: break-word; }
.user { background-color: #2563eb; margin-left: auto; text-align: right; }
.bot { background-color: #374151; margin-right: auto; text-align: left; }
</style>