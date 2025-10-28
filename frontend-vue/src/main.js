import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#app');

console.log('Frontend Vue.js iniciado y conectado al MS-Orquestador (3000) y MS-Métricas (3002)');