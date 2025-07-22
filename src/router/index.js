import { createRouter, createWebHistory } from 'vue-router';
import NavConfigTable from '../components/NavConfigTable.vue';
import NavigationPage from '../components/NavigationPage.vue';

const routes = [
  {
    path: '/',
    component: NavigationPage
    
  },
  {
    path: '/nav-config',
    name: 'NavConfig',
    component: NavConfigTable
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;