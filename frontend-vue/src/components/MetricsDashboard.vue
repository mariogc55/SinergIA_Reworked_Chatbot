<template>
  <div class="metrics-dashboard bg-gray-800 text-white shadow-2xl rounded-xl p-6 max-w-4xl mx-auto my-10">
    <h3 class="text-3xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-3">Dashboard de Rendimiento Personal (PSP)</h3>
    <p class="text-lg mb-4">Analista ID: <span class="font-semibold">{{ authStore.getCurrentUserId || 'N/A' }}</span></p>
    
    <div v-if="summary" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="metric-card bg-gray-700 p-6 rounded-lg shadow-inner">
        <h4 class="text-xl font-semibold mb-3 text-white">Métricas de Calidad (PSP2)</h4>
        <div class="space-y-3">
            <p><strong>Eficiencia de Eliminación de Defectos (DDE):</strong> <span class="text-green-400 font-bold text-xl">{{ summary.DDE }}%</span></p>
            <p><strong>Productividad (LOC/Hora):</strong> <span class="text-yellow-400 font-bold text-xl">{{ summary.productivity }}</span></p>
        </div>
      </div>
      
      <div class="metric-card bg-gray-700 p-6 rounded-lg shadow-inner">
        <h4 class="text-xl font-semibold mb-3 text-white">Métricas de Cronograma (PMBOK/PSP1)</h4>
        <div class="space-y-3">
            <p><strong>Variación de Tiempo (Real vs. Estimado):</strong> <span :class="{'text-red-400': summary.timeVariance > 0, 'text-green-400': summary.timeVariance <= 0}" class="font-bold text-xl">{{ summary.timeVariance }} hrs</span></p>
            <p class="text-sm text-gray-400 mt-2">* Un valor positivo indica retraso; negativo, anticipación.</p>
        </div>
      </div>
    </div>
    
    <p v-else-if="loadingMetrics" class="text-center py-10 text-gray-400">
        Cargando datos históricos y calculando métricas...
    </p>
    <p v-else-if="authStore.isLoggedIn" class="text-center py-10 text-yellow-500">
        No hay suficientes datos registrados con PSP para generar el resumen.
    </p>
    <p v-else class="text-center py-10 text-red-500">
        Debes iniciar sesión para ver el Dashboard de Métricas.
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export default {
    name: 'MetricsDashboard',
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    },
    data() {
        return {
            summary: null,
            loadingMetrics: false,
            METRICS_URL: 'http://localhost:3000/api/v1/metrics/psp-summary'
        };
    },
    mounted() {
      if (this.authStore.isLoggedIn) {
        this.fetchMetricsSummary();
      }
    },
    methods: {
        async fetchMetricsSummary() {
            if (!this.authStore.isLoggedIn || !this.authStore.getCurrentUserId) {
                this.summary = null;
                return;
            }

            this.loadingMetrics = true;
            try {
                const userId = this.authStore.getCurrentUserId;
                const response = await axios.get(`${this.METRICS_URL}/${userId}`);
                this.summary = response.data;
            } catch (error) {
                this.summary = null;
            } finally {
                this.loadingMetrics = false;
            }
        }
    },
    watch: {
      'authStore.isLoggedIn'(newVal) {
        if (newVal) {
          this.fetchMetricsSummary();
        } else {
          this.summary = null;
        }
      }
    }
};
</script>