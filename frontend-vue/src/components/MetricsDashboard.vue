<template>
  <div class="metrics-dashboard">
    <h3>Dashboard de Rendimiento Personal (PSP)</h3>
    <p>Analista: {{ currentUserId }}</p>
    
    <div v-if="summary" class="metric-card">
        <h4>Métricas de Calidad (PSP2)</h4>
        <p><strong>Eficiencia de Eliminación de Defectos (DDE):</strong> {{ summary.DDE }}%</p>
        <p><strong>Productividad (LOC/Hora):</strong> {{ summary.productivity }}</p>
        
        <h4>Métricas de Cronograma (PMBOK/PSP1)</h4>
        <p><strong>Variación de Tiempo (Real vs. Estimado):</strong> {{ summary.timeVariance }} hrs</p>
    </div>
    <p v-else-if="loadingMetrics">Cargando datos históricos y calculando métricas...</p>
    <p v-else>No hay suficientes datos registrados con PSP para generar el resumen.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'MetricsDashboard',
    data() {
        return {
            summary: null,
            loadingMetrics: false,
            currentUserId: 'DPI_001',
            METRICS_URL: 'http://localhost:3002/api/v1/metrics/psp/summary'
        };
    },
    mounted() {
        this.fetchMetricsSummary();
    },
    methods: {
        async fetchMetricsSummary() {
            this.loadingMetrics = true;
            try {
                const response = await axios.get(`${this.METRICS_URL}/${this.currentUserId}`);
                this.summary = response.data;
            } catch (error) {
                console.error("Error al obtener el resumen PSP:", error);
            } finally {
                this.loadingMetrics = false;
            }
        }
    }
};
</script>