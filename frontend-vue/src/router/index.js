import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ChatbotView from '@/views/ChatbotView.vue';
import ReportsView from '@/views/ReportsView.vue';
import StatusView from '@/views/StatusView.vue';
import AuthView from '@/views/AuthView.vue';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatbotView,
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth/:view?',
      name: 'auth',
      component: AuthView,
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'auth', params: { view: 'login' } });
  } else {
    next();
  }
});

export default router;
