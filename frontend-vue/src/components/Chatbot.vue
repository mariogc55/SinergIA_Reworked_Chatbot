<template>
  <div class="sinergia-chatbot">
    <h2>SinergIA: Automatización de Gestión de Proyectos TI</h2>
    
    <div class="chat-history">
        <div v-for="(msg, index) in history" :key="index" :class="msg.sender">
            <strong>{{ msg.sender === 'user' ? 'Tú:' : 'SinergIA:' }}</strong> {{ msg.text }}
            <a v-if="msg.link" :href="msg.link" target="_blank">[Ver Tarea en Jira]</a>
        </div>
    </div>

    <div class="input-area">
        <input 
            v-model="userQuery" 
            @keyup.enter="sendQuery" 
            placeholder="Describe la tarea o el análisis que necesitas automatizar..."
            :disabled="loading"
        />
        <button @click="sendQuery" :disabled="loading">
            {{ loading ? 'Procesando...' : 'Automatizar' }}
        </button>
    </div>
  </div>
</template>

<script>
import { AutomationService } from '../services/AutomationService';

export default {
  name: 'SinergiaChatbot',
  data() {
    return {
      userQuery: '',
      history: [
        { sender: 'sinergia', text: 'Bienvenido, Gestor de Proyectos. ¿Cómo puedo ayudarte a orquestar Jira y Gemini hoy?' }
      ],
      loading: false,
      currentUserId: 'DPI_001'
    };
  },
  methods: {
    async sendQuery() {
      if (!this.userQuery.trim() || this.loading) return;

      const query = this.userQuery.trim();
      this.history.push({ sender: 'user', text: query });
      this.userQuery = '';
      this.loading = true;

      try {
        const result = await AutomationService.triggerAutomation(query, this.currentUserId);
        
        this.history.push({ 
            sender: 'sinergia', 
            text: result.message,
            link: result.jiraUrl
        });
        
      } catch (error) {
        this.history.push({ sender: 'error', text: 'ERROR: ' + error.message });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>