<template>
  <div class="min-h-screen bg-gray-900 pt-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span
            class="inline-flex h-3 w-3 rounded-full"
            :class="overallStatusClass"
          ></span>
          <h1 class="text-3xl font-extrabold text-white">
            Estado de Microservicios
          </h1>
        </div>

        <button
          @click="refresh"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition"
        >
          Refrescar ahora
        </button>
      </div>

      <p class="text-gray-300 text-sm mb-4">
        Última actualización:
        <span class="font-mono">
          {{ lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Sin datos aún' }}
        </span>
      </p>

      <p v-if="error" class="mb-4 text-sm text-red-400">
        {{ error }}
      </p>

      <div v-if="loading" class="text-gray-300">Cargando estado...</div>

      <div v-else class="grid gap-6 md:grid-cols-3">
        <div
          v-for="service in services"
          :key="service.key"
          class="rounded-xl border bg-gray-800/60 border-gray-700 p-4 shadow-md"
        >
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-semibold text-lg text-white">
              {{ service.name }}
            </h2>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="statusPillClass(service.status)"
            >
              {{ service.status }}
            </span>
          </div>

          <p class="text-sm text-gray-300 mb-2">
            {{ service.message || 'Sin mensaje adicional.' }}
          </p>

          <dl class="text-xs text-gray-400 space-y-1 mt-2">
            <div v-if="service.responseTimeMs != null" class="flex justify-between">
              <dt>Tiempo de respuesta:</dt>
              <dd>{{ service.responseTimeMs }} ms</dd>
            </div>
            <div v-if="service.httpStatus" class="flex justify-between">
              <dt>HTTP:</dt>
              <dd>{{ service.httpStatus }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Último check:</dt>
              <dd>{{ service.checkedAt ? new Date(service.checkedAt).toLocaleTimeString() : '-' }}</dd>
            </div>
            <div v-if="service.error" class="text-red-400 mt-1">
              Error: {{ service.error }}
            </div>
          </dl>
        </div>
      </div>

      <p class="mt-6 text-xs text-gray-500">
        * Esta vista se actualiza automáticamente cada 10 segundos para mantener sincronizado el estado con los microservicios.
      </p>
    </div>
  </div>
</template>

<script>
import { StatusService } from '@/services/StatusService';

export default {
  name: 'StatusView',
  data() {
    return {
      loading: true,
      error: null,
      services: [],
      lastUpdated: null,
      intervalId: null,
    };
  },
  computed: {
    overallStatusClass() {
      if (!this.services.length) return 'bg-gray-500';

      if (this.services.some((s) => s.status === 'DOWN')) {
        return 'bg-red-500 animate-pulse';
      }

      if (this.services.some((s) => s.status === 'DEGRADED')) {
        return 'bg-yellow-500';
      }

      return 'bg-green-500';
    },
  },
  methods: {
    statusPillClass(status) {
      switch (status) {
        case 'UP':
          return 'bg-green-500/20 text-green-300 border border-green-500/60';
        case 'DEGRADED':
          return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/60';
        case 'DOWN':
          return 'bg-red-500/20 text-red-300 border border-red-500/60';
        default:
          return 'bg-gray-500/20 text-gray-300 border border-gray-500/60';
      }
    },
    async loadStatus() {
      this.error = null;
      try {
        const data = await StatusService.getStatus();
        this.lastUpdated = data.checkedAt || new Date().toISOString();
        this.services = data.services || [];
      } catch (err) {
        console.error('[StatusView] Error al cargar estado:', err);
        this.error =
          err?.response?.data?.error ||
          err?.message ||
          'No se pudo obtener el estado de los servicios.';
      } finally {
        this.loading = false;
      }
    },
    refresh() {
      this.loading = true;
      this.loadStatus();
    },
  },
  mounted() {
    this.loadStatus();
    this.intervalId = setInterval(this.loadStatus, 10000); // 10 s
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>
