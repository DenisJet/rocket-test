import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/components/MainView.vue';
import App from '@/App.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: App,
    },
  ],
});

export default router;
