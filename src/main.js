import { createApp } from 'vue';
import pinia from './store';
import './style.css'
import App from './App.vue'
import router from './router/index'
import 'vue-sonner/style.css'
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
