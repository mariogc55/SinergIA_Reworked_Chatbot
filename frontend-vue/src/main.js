import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; 
import './assets/main.css'; 
import { useAuthStore } from './stores/authStore'; 

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router);

app.mount('#app');