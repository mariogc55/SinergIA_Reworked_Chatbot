<template>
  <div class="min-h-screen bg-gray-900 pt-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-white mb-10 text-center">Análisis de Métricas y Reportes PSP</h1>
      <MetricsDashboard />
    </div>
  </div>
</template>

<script>
import MetricsDashboard from '@/components/MetricsDashboard.vue';

export default {
  name: 'ReportsView',
  components: {
    MetricsDashboard
  }
};
</script>