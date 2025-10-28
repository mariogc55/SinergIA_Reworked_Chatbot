<template>
  <div class="chat-container">
    <h2>SinergIA: Asistente de Proyectos (v1.0)</h2>
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
        <p>{{ msg.text }}</p>
        <p v-if="msg.jiraKey" class="jira-link">
          Tarea Creada: <a :href="msg.jiraUrl" target="_blank">{{ msg.jiraKey }}</a>
        </p>
      </div>
    </div>
    
    <div class="input-area">
      <input 
        v-model="prompt" 
        @keyup.enter="sendMessage" 
        :disabled="isLoading" 
        placeholder="Ej: 'Crear una tarea que diga construye el programa Clave del proyecto KAN'"
      />
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? 'Procesando...' : 'Enviar' }}
      </button>
    </div>
    <p v-if="error" class="error-message">Error: {{ error }}</p>
  </div>
</template>

<script>
import { AutomationService } from '../services/AutomationService'; 

export default {
  name: 'ChatInterface',
  data() {
    return {
      prompt: '',
      userId: 'user-pmbok-id', 
      messages: [
        { type: 'bot', text: 'Hola, soy SinergIA. ¿En qué tarea de automatización puedo ayudarte hoy? (Ej: crear tarea, analizar riesgo).' }
      ],
      isLoading: false,
      error: null
    };
  },
  methods: {
    async sendMessage() {
      if (!this.prompt.trim() || this.isLoading) return;

      const userPrompt = this.prompt.trim();
      this.prompt = '';
      this.error = null;
      this.isLoading = true;

      this.messages.push({ type: 'user', text: userPrompt });

      try {
        const response = await AutomationService.triggerAutomation(userPrompt, this.userId);
        
        this.messages.push({ 
          type: 'bot', 
          text: response.message,
          jiraKey: response.jiraKey,
          jiraUrl: response.jiraUrl 
        });

      } catch (err) {
        console.error("Error de Orquestación:", err);
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
    max-width: 700px;
    margin: 50px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}
.messages {
    height: 400px;
    overflow-y: auto;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
    padding-right: 10px;
}
.message {
    margin: 10px 0;
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 80%;
}
.user {
    background-color: #e0f7fa;
    margin-left: auto;
    text-align: right;
}
.bot {
    background-color: #f1f8e9;
    margin-right: auto;
    text-align: left;
}
.jira-link {
    font-size: 0.8em;
    color: #007bff;
    margin-top: 5px;
}
.input-area {
    display: flex;
    gap: 10px;
}
.input-area input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.input-area button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}
.input-area button:disabled {
    background-color: #a0c4ff;
    cursor: not-allowed;
}
.error-message {
    color: red;
    margin-top: 10px;
}
</style>