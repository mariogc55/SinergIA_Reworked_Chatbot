<template>
  <header>
    <h1>SinergIA: Gestión Inteligente de Proyectos</h1>
    <p>Integrando IA, PSP/PMBOK y Jira/ServiceNow</p>
  </header>
  <main>
    <ChatInterface />
  </main>
</template>

<script>
import ChatInterface from './components/ChatInterface.vue';

export default {
  name: 'App',
  components: {
    ChatInterface,
  }
}
</script>

<style >
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}
header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
header h1 {
  margin: 0;
  font-size: 1.8em;
}
header p {
  margin: 5px 0 0;
  font-size: 0.9em;
  opacity: 0.8;
}
main {
  padding: 20px;
}
</style>